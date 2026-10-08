/** RegistryClient 并发读取、条件刷新与离线恢复回归测试。 */

import { strict as assert } from 'node:assert'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { RegistryClient } from '../src/host/registry.ts'

const plugin = {
  owner: 'owner',
  repo: 'plugin',
  fullName: 'owner/plugin',
  description: 'fixture',
  stars: 1,
  forks: 0,
  openIssues: 0,
  language: 'TypeScript',
  license: 'MIT',
  updatedAt: '2026-08-21T00:00:00.000Z',
  defaultBranch: 'main',
  verifiedCommit: 'a'.repeat(40),
  htmlUrl: 'https://github.com/owner/plugin',
  topics: ['dsh-plugin'],
  packageName: 'fixture-plugin',
  version: '1.0.0',
  bundlePatch: './cordis.patch.yml',
  hasClient: true,
  dshStd: {
    status: 'valid',
    profile: 'tui-admission/0.15',
    manifestVersion: '0.15',
    pluginId: 'com.example.fixture',
    requirements: ['commands.dsh/v1alpha1#Command'],
    permissions: ['commands.invoke'],
    authorizationRequired: false,
    subscriptions: [],
    checks: ['TUI-PKG-001', 'TUI-PKG-002'],
    issues: [],
  },
  verifiedAt: '2026-08-21T00:00:00.000Z',
  install: {
    mode: 'automatic',
    source: 'github',
    spec: 'github:owner/plugin#' + 'a'.repeat(40),
    profiles: ['web'],
    requiresBuildApproval: false,
    requiresRestart: true,
    manualSteps: false,
    instructionsUrl: 'https://github.com/owner/plugin#readme',
  },
}

let registryReads = 0
let discoveryReads = 0
let remoteStatus = 200
let remoteStars = 1
let growth = 1
let discoveryAvailable = true
let lastEtag: string | undefined
let originalFetch: typeof globalThis.fetch | undefined
let searchPlugins: typeof plugin[] | undefined
const server = createServer((request, response) => {
  response.setHeader('content-type', 'application/json')
  if (request.url === '/plugins.json') {
    registryReads += 1
    lastEtag = request.headers['if-none-match'] as string | undefined
    response.statusCode = remoteStatus === 304 && lastEtag === undefined ? 200 : remoteStatus
    response.setHeader('etag', '"registry-v1"')
    response.end(JSON.stringify({ schemaVersion: 2, generatedAt: '2026-08-21T00:00:00.000Z', plugins: searchPlugins ?? [{ ...plugin, stars: remoteStars }] }))
    return
  }
  if (request.url === '/discovery.json') {
    discoveryReads += 1
    if (!discoveryAvailable) {
      response.statusCode = 503
      response.end('{}')
      return
    }
    response.end(JSON.stringify({
      schemaVersion: 1,
      generatedAt: '2026-08-21T00:00:00.000Z',
      windowDays: 7,
      plugins: searchPlugins?.map(item => ({ fullName: item.fullName, categories: [item.install.profiles.includes('desktop') ? 'ui' : 'data'], starGrowth7d: item.stars }))
        ?? [{ fullName: plugin.fullName, categories: ['developer-tools'], starGrowth7d: growth }],
    }))
    return
  }
  if (request.url === '/bundled/plugins.json') {
    response.end(JSON.stringify({ schemaVersion: 2, generatedAt: '2026-08-21T00:00:00.000Z', plugins: [plugin] }))
    return
  }
  response.statusCode = 404
  response.end('{}')
})

server.listen(0, '127.0.0.1')
await once(server, 'listening')
try {
  const address = server.address()
  if (address === null || typeof address === 'string') throw new Error('测试 HTTP 服务未取得端口')
  // Keep the fixture local while exercising the production HTTPS-only gate.
  const source = 'https://registry.test/plugins.json'
  originalFetch = globalThis.fetch
  globalThis.fetch = (input, init) => {
    const url = new URL(String(input))
    if (url.hostname === 'registry.test') {
      return originalFetch!(`http://127.0.0.1:${String(address.port)}${url.pathname}`, init)
    }
    return originalFetch!(input, init)
  }
  const insecureSource = `http://127.0.0.1:${String(address.port)}/plugins.json`
  const insecure = new RegistryClient(insecureSource, insecureSource, 60_000, 5_000)
  await assert.rejects(
    insecure.search('', 1, 'stars', 'all'),
    error => error instanceof Error
      && 'details' in error
      && (error as { details?: { cause?: string } }).details?.cause === 'Unsupported Registry URL protocol "http:"',
    '明文 HTTP Registry 必须在发起请求前拒绝',
  )
  const registry = new RegistryClient(source, source, 60_000, 5_000)
  const results = await Promise.all([
    registry.search('', 1, 'stars', 'all'),
    registry.find(plugin.fullName),
    registry.findByPackage(plugin.packageName),
    registry.findByPackage(plugin.packageName),
    registry.findByPackages([plugin.packageName, 'missing-plugin']),
  ])

  assert.equal(results[0].items.length, 1)
  assert.equal(results[1]?.packageName, plugin.packageName)
  assert.equal(results[2]?.fullName, plugin.fullName)
  assert.equal(results[2]?.dshStd?.status, 'valid')
  assert.deepEqual([...results[4].keys()], [plugin.packageName])
  assert.equal(registryReads, 1, '并发调用必须共享同一次 Registry 请求')
  assert.equal(discoveryReads, 1, '并发调用必须共享同一次 discovery 请求')
  await registry.refresh()
  assert.equal(registryReads, 2, '显式检查更新必须绕过 TTL 重新读取 Registry')
  assert.equal(discoveryReads, 2, '显式检查更新必须同步刷新 discovery 数据')

  growth = 7
  remoteStatus = 304
  await registry.refresh()
  assert.equal(lastEtag, '"registry-v1"', '显式刷新保留 ETag，避免重复下载未变化的核心数据')
  assert.equal((await registry.find(plugin.fullName))?.starGrowth7d, 7, '304 仍须合并最新 discovery')
  assert.equal((await registry.findByPackage(plugin.packageName))?.starGrowth7d, 7, '包名索引必须同步更新')
  assert.equal((await registry.search('', 1, 'trending', 'all')).items[0]?.starGrowth7d, 7)

  discoveryAvailable = false
  await registry.refresh()
  assert.equal((await registry.find(plugin.fullName))?.starGrowth7d, 7, '304 时可选数据故障应保留已有分类与热度')
  discoveryAvailable = true

  remoteStatus = 200
  const beforeConcurrentRefresh = registryReads
  await Promise.all([registry.refresh(), registry.refresh(), registry.refresh()])
  assert.equal(registryReads - beforeConcurrentRefresh, 1, '并发显式刷新必须合并为一次请求')

  remoteStars = 99
  const resilient = new RegistryClient(source, source.replace('/plugins.json', '/bundled/plugins.json'), 60_000, 5_000)
  assert.equal((await resilient.find(plugin.fullName))?.stars, 99)
  remoteStatus = 503
  await resilient.refresh()
  assert.equal((await resilient.find(plugin.fullName))?.stars, 99, '手动刷新失败必须保留最近的远端快照，不能退回旧包内数据')
  await registry.refresh()
  assert.equal((await registry.find(plugin.fullName))?.packageName, plugin.packageName, '没有独立包内快照时也应保留有效缓存')

  remoteStatus = 200
  const missingBundle = new RegistryClient(source, source.replace('/plugins.json', '/missing/plugins.json'), 60_000, 5_000, true)
  assert.equal((await missingBundle.find(plugin.fullName))?.stars, 99, '包内快照缺失时首屏应尝试远端')
  const bundledFirst = new RegistryClient(source, source.replace('/plugins.json', '/bundled/plugins.json'), 60_000, 5_000, true)
  assert.equal((await bundledFirst.find(plugin.fullName))?.stars, 1, '首屏先返回包内快照')
  await bundledFirst.refresh()
  assert.equal((await bundledFirst.find(plugin.fullName))?.stars, 99, '显式刷新等待后台读取并最终使用远端快照')
  // 高 Star 的 Web 条目超过一页，防止实现只隐藏当前页而丢掉后面的桌面端条目。
  function searchFixture(repo: string, profiles: string[], stars: number, mode: 'automatic' | 'guided' = 'automatic') {
    const fullName = 'owner/' + repo
    return {
      ...plugin, repo, fullName, stars, packageName: 'fixture-' + repo,
      htmlUrl: 'https://github.com/' + fullName,
      install: {
        ...plugin.install, profiles, mode,
        spec: mode === 'automatic' ? 'github:' + fullName + '#' + plugin.verifiedCommit : '',
        requiresBuildApproval: mode === 'guided', manualSteps: mode === 'guided',
        instructionsUrl: 'https://github.com/' + fullName + '#readme',
      },
    }
  }
  searchPlugins = [
    ...Array.from({ length: 55 }, (_, index) => searchFixture('web-' + index, ['web'], 5_000 + index)),
    ...Array.from({ length: 35 }, (_, index) => searchFixture('desktop-' + index, index % 2 === 0 ? ['desktop'] : ['web', 'desktop'], 1_000 - index)),
    searchFixture('dual-guided', ['web', 'desktop'], 1, 'guided'),
    searchFixture('unknown', [], 3_000, 'guided'),
    searchFixture('headless-only', ['headless'], 3_000),
    { ...searchFixture('desktop-prose-only', ['web'], 3_000), description: 'Supports desktop! 支持桌面端' },
  ]
  const scoped = new RegistryClient(source, source, 60_000, 5_000)
  const desktopFirst = await scoped.search('', 1, 'stars', 'all', 'desktop')
  const desktopSecond = await scoped.search('', 2, 'stars', 'all', 'desktop')
  assert.equal(desktopFirst.totalCount, 36, '计数仅包含明确支持 Desktop 的插件')
  assert.equal(desktopFirst.items.length, 30, 'Desktop 条目必须先过滤再分页，不能留下空首页')
  assert.equal(desktopSecond.items.length, 6)
  assert.equal(new Set([...desktopFirst.items, ...desktopSecond.items].map(item => item.fullName)).size, 36)
  assert([...desktopFirst.items, ...desktopSecond.items].every(item => item.install.profiles.includes('desktop')))
  assert.equal(desktopFirst.items[0]?.repo, 'desktop-0', '排序应基于兼容条目而不是过滤前的第一页')
  assert(desktopSecond.items.some(item => item.install.mode === 'guided'), '桌面端引导安装仍保留')
  assert.equal((await scoped.search('', 3, 'stars', 'all', 'desktop')).items.length, 0)
  assert.equal((await scoped.search('web-', 1, 'stars', 'all', 'desktop')).totalCount, 0, '搜索不能恢复 Web-only 条目')
  assert.equal((await scoped.search('desktop', 1, 'stars', 'all', 'desktop')).totalCount, 35, '宣传文案不能代替明确的 Profile')
  assert.equal((await scoped.search('', 1, 'trending', 'ui', 'desktop')).totalCount, 36)
  assert.equal((await scoped.search('', 1, 'updated', 'data', 'desktop')).totalCount, 0)
  assert.equal((await scoped.search('', 1, 'stars', 'all')).totalCount, searchPlugins.length, '不指定目标时保留原来的 Web 市场范围')
  assert.equal((await scoped.findByPackage('fixture-web-0'))?.repo, 'web-0', '发现过滤不能污染已安装包查找索引')
  console.log('registry client tests passed: cache/refresh/offline recovery and Desktop scope/search/category/sort/pagination/index isolation')
} finally {
  if (originalFetch !== undefined) globalThis.fetch = originalFetch
  server.close()
  await once(server, 'close')
}
