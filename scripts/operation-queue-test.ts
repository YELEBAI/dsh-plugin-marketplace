/** 已构建 Host 的快速接单、重复抑制与卸载失败隔离测试。 */

import { strict as assert } from 'node:assert'
import fs from 'node:fs'
import { syncBuiltinESMExports } from 'node:module'
import { mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import MarketplaceService from '../lib/index.js'
import { JobTable, MutationQueue, type JobRecord } from '../src/host/installer.ts'
import { readProfileManifest, type ProfileManifest } from '@deepseek-ai/dsh-app-boot'
import { createProfilePackageLink, localDependencySpec, type ProfileInstallLocation } from '../src/host/install-location.ts'

type TestService = {
  restartPending: boolean
  pendingInstallResolution: number
  jobs: JobTable
  mutationQueue: MutationQueue
  registry: { find: (repo: string) => Promise<typeof plugin> }
  github: { details: () => Promise<never> }
  startJob: (kind: 'install' | 'update', repo: string, ref: string) => Promise<{ ok: boolean; value?: { jobId: string }; error?: { code: string } }>
  uninstallBatch: (request: { packageNames: string[] }) => Promise<{ ok: boolean; value?: { jobs: Array<{ jobId: string }> } }>
}

const plugin = {
  fullName: 'owner/plugin',
  packageName: 'fixture-plugin',
  version: '1.0.0',
  bundlePatch: './cordis.patch.yml',
  verifiedCommit: 'a'.repeat(40),
  install: {
    mode: 'automatic' as const,
    source: 'github' as const,
    spec: 'github:owner/plugin#' + 'a'.repeat(40),
    profiles: ['web'],
    requiresRestart: true,
  },
}

let rejectDetails: ((error: Error) => void) | undefined
const details = new Promise<never>((_resolve, reject) => { rejectDetails = reject })
const service = Object.create(MarketplaceService.prototype) as TestService
service.restartPending = false
service.pendingInstallResolution = 0
service.jobs = new JobTable()
service.mutationQueue = new MutationQueue()
service.registry = { find: async () => plugin }
service.github = { details: async () => details }

const started = await service.startJob('update', plugin.fullName, plugin.verifiedCommit)
assert.equal(started.ok, true)
assert.ok(started.value?.jobId, 'update must return a job id before GitHub details settle')
assert.equal(service.jobs.get(started.value!.jobId)?.finishedAt, null)

const duplicate = await service.startJob('update', plugin.fullName, plugin.verifiedCommit)
assert.equal(duplicate.ok, false)
assert.equal(duplicate.error?.code, 'job-duplicate')

rejectDetails?.(new Error('synthetic GitHub failure'))
await service.mutationQueue.drain()
assert.equal(service.jobs.get(started.value!.jobId)?.phase, 'failed')

const removals = await service.uninstallBatch({ packageNames: ['plugin-a', 'plugin-b'] })
assert.equal(removals.ok, true)
assert.equal(removals.value?.jobs.length, 2)
await service.mutationQueue.drain()
for (const job of removals.value?.jobs ?? []) assert.equal(service.jobs.get(job.jobId)?.phase, 'failed')

const manualRoot = mkdtempSync(join(tmpdir(), 'mkt-manual-queue-'))
const previousDshHome = process.env.DSH_HOME
const manualProfile = join(manualRoot, 'profiles', 'web')
const manualCommit = 'b'.repeat(40)
const manualDetails = {
  repo: 'owner/manual-plugin',
  ref: manualCommit,
  resolvedRef: manualCommit,
  manifest: {
    name: 'manual-plugin',
    version: '1.0.0',
    description: 'fixture',
    license: 'MIT',
    bundlePatch: './cordis.patch.yml',
    hasClient: false,
    entry: null,
  },
  patch: '[]\n',
  entrySource: null,
  readmeUrl: 'https://github.com/owner/manual-plugin#readme',
  rate: { limit: 5000, remaining: 4999, reset: 0 },
}
type ManualTestService = {
  restartPending: boolean
  pendingInstallResolution: number
  jobs: JobTable
  mutationQueue: MutationQueue
  ctx: { baseUrl: URL }
  config: { registryCacheMinutes: number; registryRequestTimeoutMs: number }
  github: { details: () => Promise<typeof manualDetails> }
  driveInstall: (
    job: ReturnType<JobTable['create']>,
    profile?: unknown,
    spec?: unknown,
    before?: { dependencies?: Record<string, unknown> },
  ) => Promise<void>
  manualInstall: (request: { command: string }) => Promise<{ ok: boolean; value?: { jobId: string; operation: 'install' | 'update' }; error?: { code: string } }>
}

try {
  process.env.DSH_HOME = manualRoot
  mkdirSync(manualProfile, { recursive: true })
  writeFileSync(join(manualProfile, 'package.json'), JSON.stringify({
    name: 'visual-test-profile',
    private: true,
    dependencies: {},
    dsh: { profile: { bundles: [] } },
  }, null, 2) + '\n')

  let resolveManual!: (value: typeof manualDetails) => void
  const pendingManual = new Promise<typeof manualDetails>((resolve) => { resolveManual = resolve })
  const manualService = Object.create(MarketplaceService.prototype) as ManualTestService
  manualService.restartPending = false
  manualService.pendingInstallResolution = 0
  manualService.jobs = new JobTable()
  manualService.mutationQueue = new MutationQueue()
  manualService.ctx = { baseUrl: pathToFileURL(manualProfile + '/') }
  manualService.config = { registryCacheMinutes: 15, registryRequestTimeoutMs: 10_000 }
  manualService.github = { details: async () => pendingManual }
  let driveCalls = 0
  let lastDriveDependency: unknown
  manualService.driveInstall = async (job, _profile, _spec, before) => {
    driveCalls += 1
    lastDriveDependency = before?.dependencies?.['manual-plugin']
    manualService.jobs.settle(job, { packageName: job.packageName, version: '1.0.0', requiresRestart: true })
  }

  const command = 'dsh plugin --profile web add github:owner/manual-plugin#' + manualCommit
  const pendingManualResult = manualService.manualInstall({ command })
  const competing = manualService.jobs.create('update', 'other-plugin')
  resolveManual(manualDetails)
  const blockedManual = await pendingManualResult
  assert.equal(blockedManual.ok, false)
  assert.equal(blockedManual.error?.code, 'job-running')
  assert.equal(driveCalls, 0, 'manual install must not race an operation accepted while GitHub details resolve')
  manualService.jobs.fail(competing, { code: 'fixture', message: 'finished fixture operation' })

  const activeOnly = new JobTable()
  const finishedJob = activeOnly.create('update', 'finished-plugin')
  activeOnly.settle(finishedJob, { packageName: 'finished-plugin', version: '1.0.0', requiresRestart: false })
  const activeJob = activeOnly.create('update', 'active-plugin')
  assert.deepEqual(activeOnly.list().map(job => job.jobId), [activeJob.jobId], 'restored queue must exclude finished history')

  manualService.github = { details: async () => manualDetails }
  const acceptedManual = await manualService.manualInstall({ command })
  assert.equal(acceptedManual.ok, true)
  assert.equal(acceptedManual.value?.operation, 'install')
  await manualService.mutationQueue.drain()
  assert.equal(driveCalls, 1, 'manual install must execute through the shared mutation queue')

  const crossProcessLock = join(manualProfile, '.dsh-marketplace-mutation.lock')
  writeFileSync(crossProcessLock, JSON.stringify({
    pid: process.pid,
    createdAt: Date.now(),
    token: 'other-service',
  }))
  let updatePrepared = false
  let earlyUpdateResult: unknown
  const pendingUpdate = manualService.manualInstall({ command }).then((result) => {
    earlyUpdateResult = result
    return result
  }).finally(() => { updatePrepared = true })
  await new Promise(resolve => setTimeout(resolve, 25))
  assert.equal(updatePrepared, false, 'manual operation identity must wait for the cross-process Profile lock: ' + JSON.stringify(earlyUpdateResult))

  mkdirSync(join(manualProfile, 'node_modules', 'manual-plugin'), { recursive: true })
  writeFileSync(join(manualProfile, 'node_modules', 'manual-plugin', 'package.json'), JSON.stringify({
    name: 'manual-plugin',
    version: '0.9.0',
    dsh: { bundle: { patch: './cordis.patch.yml' } },
  }, null, 2) + '\n')
  writeFileSync(join(manualProfile, 'package.json'), JSON.stringify({
    name: 'visual-test-profile',
    private: true,
    dependencies: { 'manual-plugin': 'github:owner/manual-plugin#' + 'a'.repeat(40) },
    dsh: { profile: { bundles: ['manual-plugin'] } },
  }, null, 2) + '\n')
  unlinkSync(crossProcessLock)
  const acceptedUpdate = await pendingUpdate
  assert.equal(acceptedUpdate.ok, true)
  assert.equal(acceptedUpdate.value?.operation, 'update', 'manual source must also update an installed package')
  assert.equal(manualService.jobs.get(acceptedUpdate.value!.jobId)?.kind, 'update')
  await manualService.mutationQueue.drain()
  assert.equal(lastDriveDependency, 'github:owner/manual-plugin#' + 'a'.repeat(40), 'manual update must use the Profile snapshot captured under the lock')
} finally {
  if (previousDshHome === undefined) delete process.env.DSH_HOME
  else process.env.DSH_HOME = previousDshHome
  rmSync(manualRoot, { recursive: true, force: true })
}

// 模拟 Windows 在卸载实体时占用文件，覆盖清理已部分发生的情况。
const cleanupRoot = mkdtempSync(join(tmpdir(), 'mkt-uninstall-cleanup-'))
const originalRmSync = fs.rmSync
try {
  process.env.DSH_HOME = cleanupRoot
  for (const partial of [false, true]) {
    const dir = join(cleanupRoot, partial ? 'partial-profile' : 'locked-profile')
    const pluginDir = join(cleanupRoot, partial ? 'partial-plugins' : 'locked-plugins')
    const target = join(pluginDir, 'cleanup-plugin')
    mkdirSync(dir, { recursive: true })
    mkdirSync(target, { recursive: true })
    writeFileSync(join(target, 'package.json'), JSON.stringify({
      name: 'cleanup-plugin', version: '1.0.0', dsh: { bundle: { patch: './cordis.patch.yml' } },
    }))
    writeFileSync(join(target, 'index.js'), 'export default {}')
    const before = {
      private: true,
      dependencies: { 'cleanup-plugin': localDependencySpec(dir, target) },
      dsh: { profile: { bundles: ['cleanup-plugin'] } },
    } as ProfileManifest
    writeFileSync(join(dir, 'package.json'), JSON.stringify(before))
    createProfilePackageLink(dir, 'cleanup-plugin', target, 'fixture')
    const cleanupService = Object.create(MarketplaceService.prototype) as {
      jobs: JobTable
      driveUninstall: (job: JobRecord, profile: ProfileInstallLocation, before: ProfileManifest, bundle: boolean) => Promise<void>
    }
    cleanupService.jobs = new JobTable()
    const job = cleanupService.jobs.create('uninstall', 'cleanup-plugin')
    fs.rmSync = (path, options) => {
      if (String(path) !== target) return originalRmSync(path, options)
      if (partial) originalRmSync(join(target, 'index.js'))
      throw Object.assign(new Error('synthetic Windows file lock'), { code: 'EPERM' })
    }
    syncBuiltinESMExports()
    await cleanupService.driveUninstall(job, {
      dir, name: 'web', custom: true, pluginDir, storeDir: join(cleanupRoot, 'store'),
    }, before, true)
    const after = readProfileManifest('dsh', dir)
    assert.equal(job.phase, 'done', job.log)
    assert.equal(job.failure, null)
    assert.equal(after.dependencies?.['cleanup-plugin'], undefined, '不得重新关联可能已被部分删除的实体')
    assert.deepEqual(after.dsh?.profile?.bundles, [], '卸载后的 Bundle 层必须与依赖一致')
    assert(job.log.includes(target), '清理警告必须标明需要处理的残留路径')
    assert(job.log.includes('synthetic Windows file lock'))
    fs.rmSync = originalRmSync
    syncBuiltinESMExports()
  }

  const dir = join(cleanupRoot, 'update-profile')
  const pluginDir = join(cleanupRoot, 'update-plugins')
  const target = join(pluginDir, 'cleanup-plugin')
  const source = join(cleanupRoot, 'new-version')
  mkdirSync(dir, { recursive: true })
  for (const [path, version] of [[target, '1.0.0'], [source, '2.0.0']]) {
    mkdirSync(path!, { recursive: true })
    writeFileSync(join(path!, 'package.json'), JSON.stringify({
      name: 'cleanup-plugin', version, dsh: { bundle: { patch: './cordis.patch.yml' } },
    }))
    writeFileSync(join(path!, 'cordis.patch.yml'), '[]\n')
  }
  const before = {
    private: true,
    dependencies: { 'cleanup-plugin': localDependencySpec(dir, target) },
    dsh: { profile: { bundles: ['cleanup-plugin'] } },
  } as ProfileManifest
  writeFileSync(join(dir, 'package.json'), JSON.stringify(before))
  createProfilePackageLink(dir, 'cleanup-plugin', target, 'fixture')
  const updateService = Object.create(MarketplaceService.prototype) as {
    jobs: JobTable
    driveInstall: (job: JobRecord, profile: ProfileInstallLocation, spec: string, before: ProfileManifest, bundle: boolean, restart: boolean, target: string) => Promise<void>
  }
  updateService.jobs = new JobTable()
  const job = updateService.jobs.create('update', 'cleanup-plugin')
  const backup = target + '.marketplace-backup-' + job.jobId
  fs.rmSync = (path, options) => {
    if (String(path) !== backup) return originalRmSync(path, options)
    throw Object.assign(new Error('synthetic backup lock'), { code: 'EPERM' })
  }
  syncBuiltinESMExports()
  await updateService.driveInstall(job, {
    dir, name: 'web', custom: true, pluginDir, storeDir: join(cleanupRoot, 'store'),
  }, 'file:' + source.replace(/\\/g, '/'), before, true, true, target)
  assert.equal(job.phase, 'done', job.log)
  assert.equal(job.failure, null, '旧备份清理失败不能把成功更新变为失败')
  assert.equal(job.outcome?.version, '2.0.0')
  assert.equal(JSON.parse(fs.readFileSync(join(target, 'package.json'), 'utf8')).version, '2.0.0')
  assert.deepEqual(readProfileManifest('dsh', dir).dsh?.profile?.bundles, ['cleanup-plugin'])
  assert(job.log.includes(backup), '更新清理警告必须标明残留备份')
} finally {
  if (previousDshHome === undefined) delete process.env.DSH_HOME
  else process.env.DSH_HOME = previousDshHome
  fs.rmSync = originalRmSync
  syncBuiltinESMExports()
  rmSync(cleanupRoot, { recursive: true, force: true })
}

console.log('operation queue tests passed: 10')
