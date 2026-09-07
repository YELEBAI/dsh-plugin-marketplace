/** 用本机 DSH checkout 的依赖验证真实界面；只调用模拟 Remote，不操作 Profile。 */
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { mkdtemp, readFile, readdir, rm, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const checkout = resolve(process.env.DSH_CHECKOUT || 'D:/DSH/deepseek-harness')
const require = createRequire(import.meta.url)
async function checkoutDependency(name) {
  const checkoutRequire = createRequire(join(checkout, 'package.json'))
  try { return checkoutRequire(name) } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error
  }
  const store = join(checkout, 'node_modules', '.pnpm')
  for (const entry of (await readdir(store)).filter(entry => entry.startsWith(name + '@')).sort().reverse()) {
    try { return require(join(store, entry, 'node_modules', name)) } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') throw error
    }
  }
  throw new Error(`DSH checkout 未安装 ${name}；此脚本不会自动下载依赖。`)
}
const esbuild = await checkoutDependency('esbuild')
const { chromium } = await checkoutDependency('playwright')
async function reactPackage(name) {
  const store = join(checkout, 'node_modules', '.pnpm')
  const entry = (await readdir(store)).filter(entry => entry.startsWith(name + '@')).sort().reverse()[0]
  if (entry) return join(store, entry, 'node_modules', name)
  return dirname(require.resolve(name + '/package.json'))
}
const react = await reactPackage('react')
const reactDom = await reactPackage('react-dom')
const output = await mkdtemp(join(tmpdir(), 'dsh-marketplace-ui-'))
const screenshots = join(root, 'docs', 'screenshots')
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
      '@deepseek-ai/dsh-client-ui-primitives': join(root, 'scripts/ui-primitives.tsx'),
    },
    plugins: [{
      name: 'dsh-fixture',
      setup(build) {
        build.onResolve({ filter: /^@dsh-fixture\// }, ({ path }) => {
          const name = path.slice('@dsh-fixture/'.length)
          if (name === 'theme.css') return { path: join(checkout, 'packages/client/ui-theme/src/styles/design-platform.css'), namespace: 'theme-text' }
          return { path: join(primitives, name === 'icons' ? 'icons/index.tsx' : name + '.tsx') }
        })
        build.onLoad({ filter: /.*/, namespace: 'theme-text' }, async ({ path }) => ({ contents: await readFile(path, 'utf8'), loader: 'text' }))
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
    assert.equal(cards[0].y, cards[1].y, width + 'px 应显示两列')
    assert.ok(cards[1].x > cards[0].x)
    assert.ok(cards.every(card => card.height <= 220), '默认卡片无需大块留白')
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
  assert.deepEqual(pageErrors, [], '浏览器不应出现未捕获异常')
  console.log('UI 回归通过：明暗主题、不同面板宽度与展示密度、中英文、筛选重置、跨筛选选择和安装/卸载确认。')
} finally {
  await browser?.close()
  if (server?.listening) await new Promise(resolve => server.close(resolve))
  await rm(output, { recursive: true, force: true })
}
