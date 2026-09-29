/** 使用本地包验证真实 pnpm 的 Store 复用、卸载和无 TTY 重建，无需网络。 */
import { strict as assert } from 'node:assert'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { JobTable, linkedPnpmStore, runPnpmJob } from '../src/host/installer.ts'

const root = mkdtempSync(join(tmpdir(), 'mkt-store-integration-'))
const profile = join(root, 'profile with spaces')
const fixture = join(profile, 'fixture')
const jobs = new JobTable()
async function run(args: string[], fallback: string | null = null): Promise<void> {
  const job = jobs.create('install', 'fixture')
  assert.equal(await runPnpmJob(job, args, profile, jobs, fallback), 0, job.log)
}
try {
  mkdirSync(fixture, { recursive: true })
  writeFileSync(join(fixture, 'package.json'), JSON.stringify({ name: 'fixture', version: '1.0.0' }))
  const manifest = { name: 'profile', private: true, dependencies: { fixture: 'file:./fixture' } }
  writeFileSync(join(profile, 'package.json'), JSON.stringify(manifest))
  writeFileSync(join(profile, 'pnpm-workspace.yaml'), 'nodeLinker: hoisted\nautoInstallPeers: false\n')
  await run(['install', '--offline', '--ignore-scripts'], join(root, 'store', 'v11', 'v11'))
  const store = linkedPnpmStore(profile)
  assert.ok(store)
  await run(['remove', 'fixture'])
  assert.equal(linkedPnpmStore(profile), store)
  assert.equal(JSON.parse(readFileSync(join(profile, 'package.json'), 'utf8')).dependencies?.fixture, undefined)

  // 模拟恢复旧清单，并强制发生模块目录重建，覆盖无 TTY 与 CI 冻结锁文件问题。
  writeFileSync(join(profile, 'package.json'), JSON.stringify(manifest))
  writeFileSync(join(profile, 'pnpm-workspace.yaml'), 'nodeLinker: isolated\nautoInstallPeers: false\n')
  await run(['install', '--offline', '--ignore-scripts'])
  assert.equal(linkedPnpmStore(profile), store)
  assert.equal(JSON.parse(readFileSync(join(profile, 'node_modules', 'fixture', 'package.json'), 'utf8')).version, '1.0.0')
  console.log('store integration passed: install, remove, non-interactive rollback')
} finally {
  rmSync(root, { recursive: true, force: true })
}
