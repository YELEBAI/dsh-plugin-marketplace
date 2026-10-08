/** 真实 Cordis/Remote 与 pnpm 验证 Web 默认及自定义目录；所有写入限于入口的临时目录。 */
import assert from 'node:assert/strict'
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { pipeline } from 'node:stream/promises'
import { createGzip } from 'node:zlib'
import tar from 'tar-stream'

const [fixture] = process.argv.slice(2)
assert(fixture)
if (process.env.DSH_PACKAGE_ROOT?.trim()) await import('./use-installed-dsh.mjs')
const { Context, Service } = await import('@deepseek-ai/cordis')
const { MarketplaceService } = await import('../lib/index.js')
const { isDesktopHost, packageManagerFor, assertDesktopPluginCompatibility } = await import('../src/host/runtime.ts')
const { installLocation, marketplaceSettingsPath } = await import('../src/host/install-location.ts')
const { profileLocation } = await import('../src/host/profile.ts')
assert.equal(isDesktopHost(), false, 'Web 不能错误套用 Desktop 运行模式')
assert.equal(existsSync(join(process.env.DSH_HOME, '.credentials.yaml')), false, '隔离环境不带入用户登录数据')

const registryUrl = new URL('../registry/plugins.json', import.meta.url).href
const registryRows = JSON.parse(readFileSync(new URL(registryUrl), 'utf8')).plugins
const packageName = 'mkt-web-target'
const kept = 'mkt-web-kept'
const disabled = 'mkt-web-disabled'
const beforeState = [kept]

async function archivePackage(directory, manifest, id) {
  mkdirSync(directory, { recursive: true })
  const files = {
    'package.json': JSON.stringify(manifest),
    'index.js': 'export default function apply() {}',
    'cordis.patch.yml': '- insert:\n    - id: ' + id + '\n      name: ' + manifest.name + '\n',
  }
  const pack = tar.pack()
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(directory, name), content)
    pack.entry({ name: 'package/' + name }, content)
  }
  pack.finalize()
  const archive = directory + '.tgz'
  await pipeline(pack, createGzip(), createWriteStream(archive))
  return 'file:' + archive.replaceAll('\\', '/')
}

for (const mode of ['legacy-default', 'current-custom']) {
  const base = join(fixture, mode)
  const profileDir = join(base, 'profiles', 'web')
  mkdirSync(profileDir, { recursive: true })
  const fixedDependencies = {}
  for (const name of [kept, disabled]) {
    const source = join(base, name)
    const manifest = { name, version: '1.0.0', type: 'module', main: './index.js', dsh: { bundle: { patch: './cordis.patch.yml' } } }
    fixedDependencies[name] = await archivePackage(source, manifest, name)
    const installedDir = join(profileDir, 'node_modules', name)
    mkdirSync(installedDir, { recursive: true })
    for (const file of ['package.json', 'index.js', 'cordis.patch.yml']) writeFileSync(join(installedDir, file), readFileSync(join(source, file)))
  }
  writeFileSync(join(profileDir, 'package.json'), JSON.stringify({ name: 'web-fixture', private: true, dependencies: fixedDependencies, dsh: { profile: { bundles: beforeState } } }))
  const readProfile = () => JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8'))
  const stages = []
  for (const version of [1, 2, 3]) {
    stages.push(await archivePackage(join(base, 'target-v' + version), {
      name: packageName, version: version + '.0.0', type: 'module', main: './index.js',
      dsh: { bundle: { patch: './cordis.patch.yml' } },
      scripts: { postinstall: 'node -e "process.exit(91)"', prepare: 'node -e "process.exit(92)"' },
    }, version === 3 ? kept : packageName))
  }

  const ctx = new Context()
  ctx.baseUrl = pathToFileURL(profileDir + '/')
  if (mode === 'current-custom') {
    // 新版 Web 的可信 Profile 上下文优先于 Loader 路径，但没有 Desktop 私有运行时。
    ctx.baseUrl = pathToFileURL(join(base, 'wrong-loader-anchor') + '/')
    ctx.provide('profileContext', { name: 'web', dir: profileDir })
  }
  const skills = new Service(ctx, 'skills')
  let skillCount = 0
  skills.register = () => { skillCount += 1; return () => {} }
  await ctx.plugin(MarketplaceService, { registryUrl, registryCacheMinutes: 15, registryRequestTimeoutMs: 1_000 })
  try {
    const market = ctx.marketplace
    assert.equal(skillCount, 1, 'Web 仍注册安装 Skill')
    assert.equal(packageManagerFor(ctx), undefined, '无私有运行时的 Web 继续使用系统 pnpm')
    assert.equal(resolve(profileLocation(ctx).dir), profileDir)
    await assertDesktopPluginCompatibility(ctx, { name: 'web-only', version: '1.0.0', peerDependencies: { '@deepseek-ai/dsh-app-boot': '~0.1.7' } })
    const catalog = await market.search({ query: '', page: 1, sort: 'stars', category: 'all' })
    assert(catalog.ok, JSON.stringify(catalog))
    assert.equal(catalog.value.totalCount, registryRows.length, 'Web 列表不能继承 Desktop 的发现过滤')
    const webOnly = registryRows.find(row => row.install.profiles.includes('web') && !row.install.profiles.includes('desktop'))
    assert(webOnly, 'fixture 必须包含 Web-only 条目')
    const search = await market.search({ query: webOnly.packageName, page: 1, sort: 'stars', category: 'all' })
    assert(search.ok && search.value.items.some(row => row.packageName === webOnly.packageName))
    const customDir = mode === 'current-custom' ? join(base, 'custom plugins') : ''
    const locationResult = await market.setInstallDir({ installDir: customDir })
    assert(locationResult.ok, JSON.stringify(locationResult))
    assert.equal(locationResult.value.installDirCustom, customDir !== '', 'Web 自定义安装目录仍可使用')
    const location = installLocation(ctx, {})
    const target = join(location.pluginDir, packageName)
    for (const version of [1, 2, 3]) {
      if (version === 2) {
        const disable = await market.setEnabled({ packageName, enabled: false })
        assert(disable.ok, JSON.stringify(disable))
      }
      const before = readProfile()
      const job = market.jobs.create(version === 1 ? 'install' : 'update', packageName)
      await market.withMutationLock(profileDir, async () => {
        assert.equal(existsSync(join(profileDir, 'package.json.lock')), false, 'Web 不要求 Desktop 专属写入锁')
        await market.driveInstall(job, location, stages[version - 1], before, version > 1, false, location.custom ? target : null)
      })
      assert.equal(job.phase, version === 3 ? 'failed' : 'done', job.log + '\n' + JSON.stringify(job.failure))
      if (version === 3) assert.match(job.failure.message, /bundle id .*more than once/i, '冲突更新必须被安全拒绝')
      assert.equal(JSON.parse(readFileSync(join(target, 'package.json'), 'utf8')).version, (version === 1 ? 1 : 2) + '.0.0')
      assert.deepEqual(readProfile().dsh.profile.bundles, version === 1 ? [kept, packageName] : beforeState, '更新/失败不能重启用已停用插件或更改其他 Bundle 顺序')
      for (const name of [kept, disabled]) assert.equal(readProfile().dependencies[name], fixedDependencies[name])
    }
    const installed = await market.installed({ refresh: false })
    assert(installed.ok, JSON.stringify(installed))
    const entry = installed.value.entries.find(row => row.packageName === packageName)
    assert(entry?.linked && !entry.enabled && entry.version === '2.0.0', 'Web 安装更新后仍正确收录并保留停用状态')
    const removal = market.jobs.create('uninstall', packageName)
    await market.withMutationLock(profileDir, () => market.driveUninstall(removal, location, readProfile(), true, false))
    assert.equal(removal.phase, 'done', removal.log)
    assert.equal(readProfile().dependencies[packageName], undefined)
    assert.deepEqual(readProfile().dsh.profile.bundles, beforeState)
    for (const name of [kept, disabled]) assert.equal(readProfile().dependencies[name], fixedDependencies[name])
    assert.equal(marketplaceSettingsPath().startsWith(process.env.DSH_HOME), true)
    assert.equal(existsSync(join(process.env.DSH_HOME, '.credentials.yaml')), false)
    console.log('Web runtime passed:', mode, 'catalog/profile/install/update/disabled state/conflict rejection/uninstall/isolated home')
  } finally {
    await ctx.fiber.dispose()
  }
}
