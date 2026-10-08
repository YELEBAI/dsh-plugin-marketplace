/** Electron Node 模式下验证真实 Host 契约；不启动 GUI、Web Server 或用户 Profile。 */
import assert from 'node:assert/strict'
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { delimiter, join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { createGzip } from 'node:zlib'
import tar from 'tar-stream'

const [installation, fixture] = process.argv.slice(2)
assert(installation && fixture)
process.env.DSH_PACKAGE_ROOT = join(installation, 'resources', 'app.asar', 'dsh', 'node_modules', '@deepseek-ai', 'dsh')
await import('./use-installed-dsh.mjs')
const anchor = join(process.env.DSH_PACKAGE_ROOT, 'package.json')
const requireRuntime = createRequire(anchor)
const runtime = {
  command: process.execPath,
  args: ['--expose-internals', join(installation, 'resources', 'runtime', 'pnpm', 'bin', 'pnpm.cjs')],
  env: { ELECTRON_RUN_AS_NODE: '1', DSH_DESKTOP_NODE_EXECUTABLE: process.execPath, PATH: join(installation, 'resources', 'runtime', 'bin') + delimiter + process.env.PATH },
}
const profileDir = join(fixture, 'desktop')
mkdirSync(profileDir, { recursive: true })
writeFileSync(join(profileDir, 'package.json'), JSON.stringify({ name: 'dsh-profile-desktop', private: true, dependencies: {}, dsh: { profile: { bundles: [] } } }))
const { Context, Service } = await import('@deepseek-ai/cordis')
const { evaluatePluginCompatibility } = await import('@deepseek-ai/dsh-app-boot')
const { validateTypertManifest } = await import('@deepseek-ai/dsh-typert-loader')
const { TYPERT } = await import('../lib/typert.js')
assert.equal(evaluatePluginCompatibility(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))), undefined)
assert.equal(validateTypertManifest('dsh-plugin-marketplace', TYPERT).invocations.length, 20)
const { JobTable, runPnpmJob } = await import('../src/host/installer.ts')
const { packageManagerFor, withDesktopProfileLock, isDesktopHost, assertDesktopPluginCompatibility } = await import('../src/host/runtime.ts')
const { profileLocation } = await import('../src/host/profile.ts')
const { installLocation, writeMarketplaceSettings } = await import('../src/host/install-location.ts')
const { scheduleProcessRestart } = await import('../src/host/restart.ts')
const { MarketplaceService } = await import('../lib/index.js')

const ctx = new Context()
ctx.provide('profileContext', { name: 'desktop', dir: profileDir, installAnchor: anchor, packageManager: runtime })
const skills = new Service(ctx, 'skills')
let registeredSkill = false
skills.register = skill => { registeredSkill = skill.name === 'install-dsh-plugin'; return () => {} }
await ctx.plugin(MarketplaceService, { registryUrl: new URL('../registry/plugins.json', import.meta.url).href, registryCacheMinutes: 15, registryRequestTimeoutMs: 1_000 })
try {
  assert(isDesktopHost())
  await assert.rejects(assertDesktopPluginCompatibility(ctx, { name: 'old-only', version: '1.0.0', peerDependencies: { '@deepseek-ai/dsh-app-boot': '~0.1.7' } }), /does not declare compatibility/)
  assert(registeredSkill)
  assert.equal(profileLocation(ctx).dir, profileDir)
  const location = await ctx.marketplace.installLocation()
  assert(location.ok, JSON.stringify(location))
  assert.equal(location.value.profile, 'desktop')
  const registryEntries = JSON.parse(readFileSync(new URL('../registry/plugins.json', import.meta.url), 'utf8')).plugins
  const desktopCount = registryEntries.filter(entry => entry.install?.profiles.includes('desktop')).length
  const catalog = await ctx.marketplace.search({ query: '', page: 1, sort: 'stars', category: 'all' })
  assert(catalog.ok, JSON.stringify(catalog))
  assert.equal(catalog.value.totalCount, desktopCount, '真实 Host 按活动 Desktop Profile 过滤，不需要客户端传入范围')
  assert.equal(catalog.value.items.length, Math.min(desktopCount, 30))
  assert(catalog.value.items.every(entry => entry.install.profiles.includes('desktop')))
  if (desktopCount > 30) {
    const nextPage = await ctx.marketplace.search({ query: '', page: 2, sort: 'stars', category: 'all' })
    assert(nextPage.ok, JSON.stringify(nextPage))
    assert.equal(nextPage.value.totalCount, desktopCount)
    assert.equal(nextPage.value.items.length, Math.min(desktopCount - 30, 30))
    assert(nextPage.value.items.every(entry => entry.install.profiles.includes('desktop')))
  }
  writeMarketplaceSettings({ installDir: join(fixture, 'foreign-web-plugins'), pluginRoots: [join(fixture, 'foreign-web-plugins')] })
  assert.equal(installLocation(ctx, { installDir: join(fixture, 'other-custom') }).pluginDir, join(profileDir, 'node_modules'))
  const rejectedDir = await ctx.marketplace.setInstallDir({ installDir: join(fixture, 'other-custom') })
  assert.equal(rejectedDir.error.code, 'desktop-owned-install-dir')
  const rejectedRestart = await ctx.marketplace.restart()
  assert.equal(rejectedRestart.error.code, 'desktop-restart-required')
  await assert.rejects(scheduleProcessRestart(), /Desktop/)
  const originalPath = process.env.PATH
  const table = new JobTable(packageManagerFor(ctx))
  const packageName = 'mkt-desktop-fixture'
  const stages = [1, 2].map(version => {
    const directory = join(fixture, 'package v' + version)
    mkdirSync(directory)
    writeFileSync(join(directory, 'package.json'), JSON.stringify({ name: packageName, version: version + '.0.0', main: './index.js', dsh: { bundle: { patch: './cordis.patch.yml' } }, scripts: { postinstall: 'node -e "process.exit(97)"' } }))
    writeFileSync(join(directory, 'index.js'), 'module.exports = ' + version)
    writeFileSync(join(directory, 'cordis.patch.yml'), '- id: desktop-test\n  name: mkt-desktop-fixture\n')
    return directory
  })
  for (const [index, stage] of stages.entries()) {
    const archive = stage + '.tgz'
    const pack = tar.pack()
    for (const name of ['package.json', 'index.js', 'cordis.patch.yml']) pack.entry({ name: 'package/' + name }, readFileSync(join(stage, name)))
    pack.finalize()
    await pipeline(pack, createGzip(), createWriteStream(archive))
    const job = table.create(index === 0 ? 'install' : 'update', packageName)
    await withDesktopProfileLock(ctx, profileDir, async () => {
      assert.equal(readFileSync(join(profileDir, 'package.json.lock'), 'utf8'), process.pid + '\n', '与官方管理器相同的锁协议')
      assert.equal(await runPnpmJob(job, ['add', 'file:' + archive.replaceAll('\\', '/'), '--offline', '--ignore-scripts', '--config.auto-install-peers=false', '--store-dir', join(fixture, 'store')], profileDir, table), 0, job.log)
    })
    const manifest = JSON.parse(readFileSync(join(profileDir, 'node_modules', packageName, 'package.json'), 'utf8'))
    assert.equal(manifest.version, (index + 1) + '.0.0')
  }
  const enable = await ctx.marketplace.setEnabled({ packageName, enabled: true })
  assert(enable.ok, JSON.stringify(enable))
  assert.deepEqual(JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8')).dsh.profile.bundles, [packageName])
  const fixtureManifest = join(profileDir, 'node_modules', packageName, 'package.json')
  const incompatible = JSON.parse(readFileSync(fixtureManifest, 'utf8'))
  incompatible.peerDependencies = { '@deepseek-ai/dsh-app-boot': '~0.1.7' }
  writeFileSync(fixtureManifest, JSON.stringify(incompatible))
  const disable = await ctx.marketplace.setEnabled({ packageName, enabled: false })
  assert(disable.ok, JSON.stringify(disable))
  const rejectedEnable = await ctx.marketplace.setEnabled({ packageName, enabled: true })
  assert.equal(rejectedEnable.ok, false, '不兼容插件可停用但不能被市场重新启用')
  assert.deepEqual(JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8')).dsh.profile.bundles, [])
  const removal = table.create('uninstall', packageName)
  await withDesktopProfileLock(ctx, profileDir, async () => {
    assert.equal(await runPnpmJob(removal, ['remove', packageName, '--config.offline=true', '--config.ignore-scripts=true'], profileDir, table), 0, removal.log)
  })
  assert.equal(JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8')).dependencies?.[packageName], undefined)
  assert.equal(process.env.PATH, originalPath)
  assert.equal(JSON.parse(readFileSync(requireRuntime.resolve('@deepseek-ai/dsh-app-boot/package.json'), 'utf8')).version, '0.2.0-rc.2')
  console.log('Desktop real-runtime regressions passed: Host/RPC/Skill/profile/catalog filtering/peer compatibility, bundled pnpm offline install/update/remove, official writer lock, no Host-only restart')
} finally { await ctx.fiber.dispose() }
