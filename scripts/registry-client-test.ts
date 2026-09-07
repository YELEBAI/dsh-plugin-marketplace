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
const server = createServer((request, response) => {
  response.setHeader('content-type', 'application/json')
  if (request.url === '/plugins.json') {
    registryReads += 1
    lastEtag = request.headers['if-none-match'] as string | undefined
    response.statusCode = remoteStatus === 304 && lastEtag === undefined ? 200 : remoteStatus
    response.setHeader('etag', '"registry-v1"')
    response.end(JSON.stringify({ schemaVersion: 2, generatedAt: '2026-08-21T00:00:00.000Z', plugins: [{ ...plugin, stars: remoteStars }] }))
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
      plugins: [{ fullName: plugin.fullName, categories: ['developer-tools'], starGrowth7d: growth }],
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
  const source = `http://127.0.0.1:${String(address.port)}/plugins.json`
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
  console.log('registry client tests passed: 10')
} finally {
  server.close()
  await once(server, 'close')
}
