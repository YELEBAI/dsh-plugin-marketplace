/** 用真实 DSH 组件验证界面；只调用模拟 Remote，不操作 Profile。 */
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { mkdtemp, readFile, rm, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkout, packageRoot, resolveDsh, resolveTool } from './dsh-environment.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const esbuild = require(resolveTool('esbuild'))
const { chromium } = require(resolveTool('playwright'))
async function reactPackage(name) {
  return dirname(require.resolve(name + '/package.json', { paths: [root] }))
}
const react = await reactPackage('react')
const reactDom = await reactPackage('react-dom')
const output = await mkdtemp(join(tmpdir(), 'dsh-marketplace-ui-'))
const screenshots = process.env.MARKETPLACE_SCREENSHOTS_DIR?.trim() || join(root, 'docs', 'screenshots')
const primitives = join(checkout, 'packages/client/ui-primitives/src')
let browser
let server
try {
  await esbuild.build({
    absWorkingDir: root,
    entryPoints: ['scripts/ui-preview.tsx'],
    bundle: true, format: 'esm', platform: 'browser', jsx: 'automatic',
    tsconfigRaw: { compilerOptions: {} }, outfile: join(output, 'preview.js'),
    alias: {
      react,
      'react-dom': reactDom,
      '@deepseek-ai/dsh-client-ui-primitives': packageRoot === undefined
        ? join(root, 'scripts/ui-primitives.tsx')
        : resolveDsh('@deepseek-ai/dsh-client-ui-primitives'),
    },
    nodePaths: [join(packageRoot ?? checkout, 'node_modules'), ...(process.env.MARKETPLACE_TOOLS_DIR ? [join(process.env.MARKETPLACE_TOOLS_DIR, 'node_modules')] : [])],
    loader: { '.module.css': 'local-css', '.woff2': 'dataurl', '.woff': 'dataurl', '.ttf': 'dataurl' },
    plugins: [{
      name: 'dsh-fixture',
      setup(build) {
        build.onResolve({ filter: /^@dsh-fixture\// }, ({ path }) => {
          const name = path.slice('@dsh-fixture/'.length)
          if (name === 'theme.css') return { path: packageRoot === undefined
            ? join(checkout, 'packages/client/ui-theme/src/styles/design-platform.css')
            : resolveDsh('@deepseek-ai/dsh-client-ui-theme/client'), namespace: 'theme-text' }
          return { path: join(primitives, name === 'icons' ? 'icons/index.tsx' : name + '.tsx') }
        })
        build.onLoad({ filter: /.*/, namespace: 'theme-text' }, async ({ path }) => {
          const source = await readFile(path, 'utf8')
          if (packageRoot === undefined) return { contents: source, loader: 'text' }
          // 发布包将官方 design-platform.css 内联为字符串；不执行整个主题插件。
          const inline = source.match(/var design_platform_css_default = ("(?:\\.|[^"\\])*");/)
          if (!inline) throw new Error('Published DSH theme has no recognizable design-platform CSS; use DSH_CHECKOUT for this release')
          return { contents: JSON.parse(inline[1]), loader: 'text' }
        })
      },
    }],
  })
  const html = `<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/preview.css"><style>body{margin:0;background:var(--dsw-alias-bg-layer-1);font-family:system-ui,"Microsoft YaHei",sans-serif}.fixture-shell{width:min(960px,calc(100% - 32px));margin:28px auto}button,input,select{font-family:inherit}</style><body><div id="root"></div><script type="module" src="/preview.js"></script></body></html>`
  server = createServer(async (request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname
    if (path !== '/preview.js' && path !== '/preview.css') {
      response.setHeader('content-type', 'text/html; charset=utf-8')
      response.end(html)
      return
    }
    try {
      response.setHeader('content-type', path.endsWith('.css') ? 'text/css' : 'text/javascript')
      response.end(await readFile(join(output, path.slice(1))))
    } catch { response.writeHead(404); response.end() }
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const url = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH })
  const page = await browser.newPage({ viewport: { width: 992, height: 940 }, deviceScaleFactor: 1 })
  const pageErrors = []
  page.on('pageerror', error => pageErrors.push(error.message))
  await page.goto(url)
  await page.locator('.mkt-card').first().waitFor()
  await mkdir(screenshots, { recursive: true })
  await page.screenshot({ path: join(screenshots, 'marketplace-refresh-light.png'), fullPage: true, animations: 'disabled' })
  console.log('浅色预览已生成')

  async function noOverflow(label) {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
    assert.equal(overflow, false, label + ' 不应横向溢出')
  }
  for (const width of [960, 620, 360]) {
    await page.setViewportSize({ width: width + 32, height: 940 })
    await noOverflow('catalog ' + width)
  }
  await page.screenshot({ path: join(screenshots, 'marketplace-refresh-mobile.png'), fullPage: true, animations: 'disabled' })
  await page.setViewportSize({ width: 992, height: 940 })
  await page.evaluate(() => document.body.setAttribute('data-ds-dark-theme', ''))
  await page.screenshot({ path: join(screenshots, 'marketplace-refresh-dark.png'), fullPage: true, animations: 'disabled' })
  await page.evaluate(() => document.body.removeAttribute('data-ds-dark-theme'))

  const search = page.getByRole('searchbox', { name: '搜索已验证的 DSH 插件' })
  await search.fill('nothing-matches-this')
  await page.getByText('没有匹配的插件。', { exact: true }).waitFor()
  await page.getByRole('button', { name: '重置筛选', exact: true }).click()
  await page.locator('.mkt-card').first().waitFor()
  assert.equal(await search.inputValue(), '')
  await page.getByRole('combobox', { name: '插件分类' }).selectOption('agents')
  await page.getByText('找到 1 个插件', { exact: true }).waitFor()
  await page.getByRole('button', { name: '重置筛选', exact: true }).click()
  await page.getByText('找到 3 个插件', { exact: true }).waitFor()

  await page.getByRole('button', { name: '安装', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.waitFor()
  const confirm = dialog.locator('button').last()
  assert.equal(await confirm.isDisabled(), true, '未确认风险时不能提交安装')
  await dialog.getByRole('checkbox').check()
  assert.equal(await confirm.isEnabled(), true)
  await dialog.getByRole('button', { name: '取消', exact: true }).click()
  assert.equal(await page.evaluate(() => window.__marketplaceFixture.installs), 0)

  await page.getByRole('button', { name: '已安装插件', exact: true }).click()
  await page.locator('.mkt-installed-card').first().waitFor()
  await page.locator('.mkt-installed-card').first().getByRole('checkbox').check()
  await page.getByRole('searchbox').fill('no-installed-match')
  await page.getByText('1 个已选插件不在当前筛选中，批量操作仍会包含它们。', { exact: true }).waitFor()
  assert.equal(await page.getByRole('button', { name: '卸载已选（1）', exact: true }).isEnabled(), true)
  await page.getByRole('button', { name: '卸载已选（1）', exact: true }).click()
  await dialog.waitFor()
  await dialog.getByRole('button', { name: '取消', exact: true }).click()
  assert.deepEqual(await page.evaluate(() => window.__marketplaceFixture.uninstallBatches), [])
  await page.getByRole('button', { name: '卸载已选（1）', exact: true }).click()
  await dialog.getByRole('checkbox').check()
  await dialog.locator('button').last().click()
  await page.waitForFunction(() => window.__marketplaceFixture.uninstallBatches.length === 1)
  assert.deepEqual(await page.evaluate(() => window.__marketplaceFixture.uninstallBatches), [['@dsh/focus-panel']], '隐藏的已选插件应与确认数量和 Remote 参数一致')
  await page.getByRole('button', { name: '重置筛选', exact: true }).click()
  await page.locator('.mkt-installed-card').first().getByRole('checkbox').check()
  assert.equal(await page.locator('.mkt-installed-card').first().getAttribute('data-selected'), 'true')
  assert.equal(await page.locator('.mkt-installed-card').first().getByRole('button', { name: '卸载', exact: true }).getAttribute('data-tone'), 'danger')
  await page.screenshot({ path: join(screenshots, 'marketplace-refresh-installed.png'), fullPage: true, animations: 'disabled' })
  for (const width of [960, 620, 360]) {
    await page.setViewportSize({ width: width + 32, height: 940 })
    await noOverflow('installed ' + width)
  }
  await page.getByRole('button', { name: '管理与诊断', exact: true }).click()
  await page.locator('.mkt-management').waitFor()
  for (const width of [960, 620, 360]) {
    await page.setViewportSize({ width: width + 32, height: 940 })
    await noOverflow('management ' + width)
  }
  await page.setViewportSize({ width: 992, height: 940 })
  await page.screenshot({ path: join(screenshots, 'marketplace-refresh-management.png'), fullPage: true, animations: 'disabled' })
  await page.goto(url + '/?lang=en')
  await page.setViewportSize({ width: 360, height: 940 })
  await page.locator('.mkt-card').first().waitFor()
  await noOverflow('English navigation 360')
  await page.getByRole('button', { name: 'Installed plugins', exact: true }).click()
  await page.locator('.mkt-installed-card').first().waitFor()
  await noOverflow('English installed 360')

  // 复现设置侧栏挤占宽度后的内容区，检查实际可见数量，而非只检查无溢出。
  await page.goto(url + '/?density=1')
  await page.locator('.mkt-card').nth(11).waitFor()
  for (const width of [490, 556]) {
    await page.setViewportSize({ width: width + 32, height: 794 })
    await noOverflow('dense catalog ' + width)
    const cards = await page.locator('.mkt-card').evaluateAll(elements => elements.map(element => {
      const { x, y, bottom, height } = element.getBoundingClientRect()
      return { x, y, bottom, height }
    }))
    await page.screenshot({ path: join(screenshots, 'marketplace-refresh-density.png'), animations: 'disabled' })
    assert.equal(cards[0].y, cards[1].y, width + 'px 应显示两列')
    assert.ok(cards[1].x > cards[0].x)
    assert.ok(cards.every(card => card.height <= 220), '默认卡片无需大块留白：' + JSON.stringify(cards))
    const visibleCount = cards.filter(card => card.y >= 0 && card.bottom <= 794).length
    assert.ok(visibleCount >= 4, width + 'px 首屏应至少完整显示四个插件')
    console.log(`内容区 ${width}px：双列，卡片 ${cards[0].height}px，首屏完整显示 ${visibleCount} 个插件`)
  }
  await page.screenshot({ path: join(screenshots, 'marketplace-refresh-density.png'), animations: 'disabled' })
  await page.getByRole('button', { name: '详情', exact: true }).first().click()
  await page.getByRole('button', { name: '详情', exact: true }).first().getAttribute('aria-expanded').then(value => assert.equal(value, 'true'))
  await noOverflow('dense expanded details')
  await page.goto(url + '/?density=1&lang=en')
  await page.setViewportSize({ width: 522, height: 794 })
  await page.locator('.mkt-card').nth(11).waitFor()
  await noOverflow('English dense catalog 490')

  const dataLens = page.locator('.mkt-card').filter({ has: page.getByText('data-lens', { exact: true }) })
  async function confirmDataLensInstall() {
    await dataLens.getByRole('button', { name: '安装', exact: true }).click()
    await dialog.waitFor()
    await dialog.getByRole('checkbox').check()
    await dialog.locator('button').last().click()
    await page.waitForFunction(() => window.__marketplaceFixture.installs === 1)
  }
  async function settleFixtureRender() {
    // 等待被显式释放的 Promise 及 React 渲染提交，不猜测 Remote 的耗时。
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  }

  // 目录残留条目不是当前 Profile 的已安装插件；访问已安装页不应改变安装行为。
  await page.goto(url)
  await page.getByRole('button', { name: '已安装插件', exact: true }).click()
  await page.getByText('目录中存在，但未关联当前 Profile', { exact: true }).waitFor()
  await page.getByRole('button', { name: '插件市场', exact: true }).click()
  await confirmDataLensInstall()
  assert.deepEqual(await page.evaluate(() => window.__marketplaceFixture.installRequests), [
    { repo: 'dsh-labs/data-lens', ref: 'b'.repeat(40) },
  ], '未关联条目应通过确认并以该插件的精确来源安装')
  await dataLens.getByRole('button', { name: '已安装', exact: true }).waitFor()
  assert.equal(await page.getByText('该插件已安装。', { exact: true }).count(), 0)

  // Profile 独立失败时保持目录可浏览；原页重试应保留筛选并恢复安装能力。
  for (const copy of [
    { lang: 'zh', retry: '重试安装检查', unavailable: '无法确认安装条件', checking: '正在检查安装条件…', install: '安装', category: '插件分类' },
    { lang: 'en', retry: 'Retry install check', unavailable: 'Install requirements unavailable', checking: 'Checking install requirements…', install: 'Install', category: 'Plugin category' },
  ]) {
    await page.goto(url + '/?scenario=profile-retry&lang=' + copy.lang)
    const profileError = page.locator('.mkt-profile-error')
    await profileError.getByRole('alert').waitFor()
    if (copy.lang === 'zh') await page.screenshot({ path: join(screenshots, 'marketplace-profile-retry.png'), fullPage: true, animations: 'disabled' })
    assert.equal(await dataLens.getByRole('button', { name: copy.unavailable, exact: true }).isDisabled(), true)
    await page.getByRole('searchbox').fill('data-lens')
    await page.getByRole('combobox', { name: copy.category }).selectOption('data')
    await noOverflow(copy.lang + ' profile retry')
    await profileError.getByRole('button', { name: copy.retry, exact: true }).click()
    await page.waitForFunction(() => window.__marketplaceFixture.installLocationCalls === 2)
    assert.equal(await profileError.getByRole('button', { name: copy.checking, exact: true }).isDisabled(), true, '请求未完成时应禁止重复重试')
    assert.equal(await dataLens.getByRole('button', { name: copy.checking, exact: true }).isDisabled(), true)
    await page.evaluate(() => window.__marketplaceFixture.releaseProfile())
    await profileError.waitFor({ state: 'detached' })
    await dataLens.getByRole('button', { name: copy.install, exact: true }).waitFor()
    assert.equal(await dataLens.getByRole('button', { name: copy.install, exact: true }).isEnabled(), true)
    assert.equal(await page.getByRole('searchbox').inputValue(), 'data-lens')
    assert.equal(await page.getByRole('combobox', { name: copy.category }).inputValue(), 'data')
    assert.deepEqual(await page.evaluate(() => ({
      profile: window.__marketplaceFixture.installLocationCalls,
      installed: window.__marketplaceFixture.installedCalls,
      installs: window.__marketplaceFixture.installs,
    })), { profile: 2, installed: 0, installs: 0 }, '重试只重读安装信息，不切换到已安装页或提交安装')
  }

  // 已安装列表成功后，早先的安装信息读取无论成功或失败都不得回退有效状态。
  for (const outcome of ['success', 'failure']) {
    await page.goto(url + '/?scenario=profile-late')
    await page.getByRole('button', { name: '已安装插件', exact: true }).click()
    await page.locator('.mkt-installed-card').first().waitFor()
    await page.getByRole('button', { name: '插件市场', exact: true }).click()
    await dataLens.getByRole('button', { name: '安装', exact: true }).waitFor()
    assert.equal(await dataLens.getByRole('button', { name: '安装', exact: true }).isEnabled(), true, '完整列表成功后无需等待旧请求即可安装')
    await page.evaluate(outcome => {
      if (outcome === 'success') window.__marketplaceFixture.releaseStaleProfile()
      else window.__marketplaceFixture.failProfile()
    }, outcome)
    await settleFixtureRender()
    assert.equal(await page.locator('.mkt-profile-error').count(), 0)
    assert.equal(await page.getByText('当前 Profile：web', { exact: true }).isVisible(), true)
    assert.equal(await dataLens.getByRole('button', { name: '安装', exact: true }).isEnabled(), true)
    assert.equal(await page.locator('.mkt-card').filter({ has: page.getByText('focus-panel', { exact: true }) }).getByRole('button', { name: '已安装', exact: true }).isVisible(), true, '旧快照不得清除已关联状态')
  }

  // 初始空快照迟到时保留新任务；阻塞状态响应，避免在途轮询掩盖任务被清空的问题。
  await page.goto(url + '/?scenario=jobs-race')
  await confirmDataLensInstall()
  await dataLens.getByRole('button', { name: '正在安装…', exact: true }).waitFor()
  await page.evaluate(() => window.__marketplaceFixture.releaseJobs())
  await settleFixtureRender()
  assert.equal(await dataLens.getByRole('button', { name: '正在安装…', exact: true }).isDisabled(), true, '初始空快照不能移除本页的新任务')
  await page.evaluate(() => window.__marketplaceFixture.releaseJobStatus())
  await page.waitForFunction(() => window.__marketplaceFixture.jobStatusCalls.includes('fixture-install'))
  const pollsAfterRestore = await page.evaluate(() => window.__marketplaceFixture.jobStatusCalls.length)
  await page.waitForFunction(previous => window.__marketplaceFixture.jobStatusCalls.length > previous, pollsAfterRestore)
  assert.equal(await dataLens.getByRole('button', { name: '正在安装…', exact: true }).isDisabled(), true, '恢复后应继续轮询且防止重复安装')
  await page.screenshot({ path: join(screenshots, 'marketplace-task-progress.png'), fullPage: true, animations: 'disabled' })
  await page.evaluate(() => window.__marketplaceFixture.finishInstall())
  await dataLens.getByRole('button', { name: '已安装', exact: true }).waitFor()
  await dataLens.getByText('安装中 — 完成 (@dsh/data-lens@0.8.2)', { exact: true }).waitFor()
  assert.equal(await page.evaluate(() => window.__marketplaceFixture.installs), 1)

  // 同 ID 的旧快照也不能把本页已经完成的任务退回排队状态。
  await page.goto(url + '/?scenario=jobs-race')
  await confirmDataLensInstall()
  await page.evaluate(() => {
    window.__marketplaceFixture.finishInstall()
    window.__marketplaceFixture.releaseJobStatus()
  })
  await dataLens.getByText('安装中 — 完成 (@dsh/data-lens@0.8.2)', { exact: true }).waitFor()
  await page.evaluate(() => window.__marketplaceFixture.releaseJobs('stale'))
  await settleFixtureRender()
  assert.equal(await dataLens.getByText('安装中 — 完成 (@dsh/data-lens@0.8.2)', { exact: true }).isVisible(), true)
  assert.equal(await dataLens.getByRole('button', { name: '已安装', exact: true }).isVisible(), true)
  assert.equal(await dataLens.getByText('安装中 — 等待前序插件完成', { exact: true }).count(), 0)

  // Agent 创建失败必须撤销进行中横幅，同时恢复操作并显示失败原因。
  await page.goto(url + '/?scenario=agent-failure')
  await page.getByRole('button', { name: 'Agent 安装', exact: true }).click()
  await page.getByText('正在创建安装 Agent…', { exact: true }).waitFor()
  assert.equal(await page.getByRole('button', { name: '创建中…', exact: true }).isDisabled(), true)
  await page.evaluate(() => window.__marketplaceFixture.failAgent())
  await page.getByRole('alert').filter({ hasText: 'fixture: Agent 创建失败' }).waitFor()
  await page.getByText('正在创建安装 Agent…', { exact: true }).waitFor({ state: 'detached' })
  await page.getByRole('button', { name: 'Agent 安装', exact: true }).waitFor()
  assert.equal(await page.getByRole('button', { name: 'Agent 安装', exact: true }).isEnabled(), true)
  assert.equal(await page.evaluate(() => window.__marketplaceFixture.agentCalls), 1)
  await page.getByRole('alert').filter({ hasText: 'fixture: Agent 创建失败' }).getByRole('button', { name: '关闭', exact: true }).click()
  assert.equal(await page.getByText('正在创建安装 Agent…', { exact: true }).count(), 0, '关闭错误通知后仍不应显示虚假的进行中状态')

  // Desktop 只允许显式声明的插件，重启说明不调用 Web 的 Host 重启 RPC。
  await page.goto(url + '/?scenario=desktop')
  await page.locator('.mkt-card').first().waitFor()
  await page.getByText('当前 Profile：desktop', { exact: true }).waitFor()
  const desktopPlugin = page.locator('.mkt-card').filter({ has: page.getByText('focus-panel', { exact: true }) })
  assert.equal(await desktopPlugin.locator('.mkt-platform-tag').filter({ hasText: '桌面端' }).count(), 1)
  assert.equal(await dataLens.count(), 0, 'Desktop 列表必须隐藏仅支持 Web 的插件卡片')
  assert.equal(await page.locator('.mkt-card').count(), 2)
  await page.getByText('找到 2 个插件', { exact: true }).waitFor()
  await page.getByText('仅显示明确支持桌面端的插件', { exact: true }).waitFor()
  assert.equal(await page.getByRole('button', { name: 'Agent 安装', exact: true }).count(), 1, '明确支持 Desktop 的引导安装仍然保留')
  await search.fill('data-lens')
  await page.getByText('没有匹配的插件。', { exact: true }).waitFor()
  await page.getByText('找到 0 个插件', { exact: true }).waitFor()
  assert.equal(await page.locator('.mkt-card').count(), 0, '搜索不能绕过 Desktop 过滤')
  await page.getByRole('button', { name: '重置筛选', exact: true }).click()
  await desktopPlugin.waitFor()
  await noOverflow('Desktop catalog')
  for (const width of [360, 522]) {
    await page.setViewportSize({ width, height: 794 })
    await noOverflow('Desktop filtered catalog ' + width)
  }
  await page.screenshot({ path: join(screenshots, 'marketplace-desktop-catalog.png'), fullPage: true, animations: 'disabled' })
  await desktopPlugin.getByRole('button', { name: '安装', exact: true }).click()
  await dialog.getByRole('checkbox').check()
  await dialog.locator('button').last().click()
  await page.waitForFunction(() => window.__marketplaceFixture.installs === 1)
  await page.getByRole('button', { name: '桌面端重启说明', exact: true }).click()
  await dialog.waitFor()
  assert.match(await dialog.innerText(), /托盘/)
  await dialog.getByRole('checkbox').check()
  await dialog.getByRole('button', { name: '知道了', exact: true }).click()
  assert.equal(await page.evaluate(() => window.__marketplaceFixture.restarts), 0, '不得只重启 Electron 内的 Host')
  await page.getByRole('button', { name: '管理与诊断', exact: true }).click()
  assert.equal(await page.getByRole('button', { name: '选择文件夹', exact: true }).first().isDisabled(), true)
  await page.screenshot({ path: join(screenshots, 'marketplace-desktop-management.png'), fullPage: true, animations: 'disabled' })

  await page.getByRole('button', { name: '已安装插件', exact: true }).click()
  await page.locator('.mkt-installed-card').first().waitFor()
  assert.equal(await page.getByText('data-lens', { exact: true }).count(), 1, '已安装页面仍显示 Web-only 条目，方便用户清理')
  await page.goto(url + '/?scenario=desktop&lang=en')
  await page.getByText('Showing only plugins with explicit Desktop support', { exact: true }).waitFor()
  await page.getByText('2 plugins found', { exact: true }).waitFor()
  assert.equal(await page.locator('.mkt-card').count(), 2)
  await noOverflow('English Desktop filtered catalog')

  assert.deepEqual(pageErrors, [], '浏览器不应出现未捕获异常')
  console.log('UI 回归通过：明暗主题、不同面板宽度与展示密度、中英文、筛选与批量选择、安装/卸载确认、Profile 重试、任务快照、Agent 失败恢复、Desktop 列表过滤/标记/安装边界/重启说明。')
} finally {
  await browser?.close()
  if (server?.listening) await new Promise(resolve => server.close(resolve))
  await rm(output, { recursive: true, force: true })
}
