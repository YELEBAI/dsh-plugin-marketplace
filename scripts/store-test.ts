/** Unit tests for the Profile-linked pnpm store selection and arg building.
 *  Run: node --experimental-strip-types scripts/store-test.ts
 *  Covers PR notes §14 items 1–2 (store parsing forms and propagation).
 */

import { strict as assert } from 'node:assert'
import { existsSync, mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { JobTable, MutationQueue, linkedPnpmStore, pnpmArgsFor, removeStaleProfileLock, systemPnpmRuntime, withProfileMutationLock } from '../src/host/installer.ts'

let passed = 0
function ok(name: string, fn: () => void): void {
  fn()
  passed += 1
  console.log('ok - ' + name)
}

const tmp = mkdtempSync(join(tmpdir(), 'mkt-store-test-'))
try {
  // 标准 Windows shim 不经 shell，PATH 中的空格、优先级和自定义入口保持可预测。
  for (const relative of ['node_modules/pnpm/bin/pnpm.cjs', 'node_modules/pnpm/bin/pnpm.mjs', 'node_modules/corepack/dist/pnpm.js']) {
    const directory = join(tmp, 'runtime with spaces', relative.replaceAll('/', '-'))
    const script = join(directory, relative)
    mkdirSync(join(script, '..'), { recursive: true })
    writeFileSync(join(directory, 'pnpm.cmd'), '@echo off')
    writeFileSync(script, '')
    ok('Windows shim resolves shell-free entry ' + relative, () => {
      assert.deepEqual(systemPnpmRuntime({ Path: '"' + directory + '"' }, 'win32'), { command: process.execPath, args: [script] })
    })
  }
  const executableDir = join(tmp, 'standalone')
  mkdirSync(executableDir)
  writeFileSync(join(executableDir, 'pnpm.exe'), '')
  ok('Windows standalone pnpm uses its executable directly', () => {
    assert.deepEqual(systemPnpmRuntime({ PATH: executableDir }, 'win32'), { command: join(executableDir, 'pnpm.exe') })
  })
  const customShim = join(tmp, 'custom-shim')
  mkdirSync(customShim)
  writeFileSync(join(customShim, 'pnpm.cmd'), '@echo off')
  ok('unknown first shim does not fall through to a different PATH entry', () => {
    assert.equal(systemPnpmRuntime({ PATH: customShim + ';' + executableDir }, 'win32'), undefined)
  })
  ok('non-Windows pnpm lookup is unchanged', () => {
    assert.equal(systemPnpmRuntime({ PATH: executableDir }, 'linux'), undefined)
  })
  // JSON form with a space in the path.
  const jsonDir = join(tmp, 'json')
  mkdirSync(join(jsonDir, 'node_modules'), { recursive: true })
  writeFileSync(join(jsonDir, 'node_modules', '.modules.yaml'), JSON.stringify({ storeDir: 'D:/store json' }))
  ok('reads JSON storeDir with spaces', () => assert.equal(linkedPnpmStore(jsonDir), 'D:\\store json'))

  const repeatedDir = join(tmp, 'repeated')
  mkdirSync(join(repeatedDir, 'node_modules'), { recursive: true })
  writeFileSync(join(repeatedDir, 'node_modules', '.modules.yaml'), JSON.stringify({
    storeDir: 'D:\\\\\\\\DeepSeekHarness\\\\\\\\.pnpm-store\\\\v11',
  }))
  ok('normalizes repeatedly expanded Windows separators', () => {
    assert.equal(linkedPnpmStore(repeatedDir), 'D:\\DeepSeekHarness\\.pnpm-store\\v11')
  })

  // Plain YAML scalar form, Windows backslash path.
  const yamlDir = join(tmp, 'yaml')
  mkdirSync(join(yamlDir, 'node_modules'), { recursive: true })
  writeFileSync(join(yamlDir, 'node_modules', '.modules.yaml'), 'storeDir: C:\\pnpm store\\v9\n')
  ok('reads YAML storeDir with backslashes', () => assert.equal(linkedPnpmStore(yamlDir), 'C:\\pnpm store\\v9'))

  // Missing .modules.yaml.
  const bareDir = join(tmp, 'bare')
  mkdirSync(join(bareDir, 'node_modules'), { recursive: true })
  ok('missing .modules.yaml resolves to null', () => assert.equal(linkedPnpmStore(bareDir), null))

  // Missing node_modules entirely.
  const emptyDir = join(tmp, 'empty')
  mkdirSync(emptyDir, { recursive: true })
  ok('missing node_modules resolves to null', () => assert.equal(linkedPnpmStore(emptyDir), null))

  // Relative storeDir is resolved against the bound project before it is
  // forwarded to staging or external plugin directories with another cwd.
  const relDir = join(tmp, 'relative')
  mkdirSync(join(relDir, 'node_modules'), { recursive: true })
  writeFileSync(join(relDir, 'node_modules', '.modules.yaml'), 'storeDir: ../../shared-store\n')
  ok('relative storeDir resolved against the linked project', () => {
    assert.equal(linkedPnpmStore(relDir), join(relDir, '../../shared-store'))
  })

  // Empty JSON storeDir falls back to the YAML scan / null.
  const emptyStore = join(tmp, 'empty-store')
  mkdirSync(join(emptyStore, 'node_modules'), { recursive: true })
  writeFileSync(join(emptyStore, 'node_modules', '.modules.yaml'), '{\n  "storeDir": ""\n}\n')
  ok('empty storeDir string resolves to null', () => assert.equal(linkedPnpmStore(emptyStore), null))

  // pnpmArgsFor: no store -> args unchanged.
  const noStore = pnpmArgsFor(['remove', 'some-pkg'], bareDir, null)
  ok('no store leaves args untouched', () => {
    assert.deepEqual(noStore.args, ['remove', 'some-pkg'])
    assert.equal(noStore.storeDir, null)
  })

  // pnpmArgsFor: linked store appended for every job kind.
  for (const args of [
    ['add', 'github:owner/repo#deadbeef', '--ignore-scripts'],
    ['remove', 'some-pkg'],
    ['install', '--lockfile-only', '--ignore-scripts'],
  ]) {
    const withStore = pnpmArgsFor(args, jsonDir, null)
    ok('linked store appended for pnpm ' + args[0], () => {
      assert.deepEqual(withStore.args, [...args, '--config.store-dir=D:\\store json'])
      assert.equal(withStore.storeDir, 'D:\\store json')
    })
  }

  const versionedStore = pnpmArgsFor(['add', 'x'], repeatedDir, null)
  ok('versioned .modules store path is preserved exactly', () => {
    assert.deepEqual(versionedStore.args, ['add', 'x', '--config.store-dir=D:\\DeepSeekHarness\\.pnpm-store\\v11'])
    assert.equal(versionedStore.storeDir, 'D:\\DeepSeekHarness\\.pnpm-store\\v11')
  })

  // pnpmArgsFor: fallback store used when the directory is not bound.
  const fallback = pnpmArgsFor(['add', 'x'], bareDir, 'C:/fallback-store')
  ok('fallback store used when directory is unbound', () => {
    assert.deepEqual(fallback.args, ['add', 'x', '--config.store-dir=C:\\fallback-store'])
  })

  // pnpmArgsFor: linked store wins over the fallback.
  const linkedWins = pnpmArgsFor(['remove', 'x'], yamlDir, 'C:/fallback-store')
  ok('linked store wins over fallback', () => {
    assert.deepEqual(linkedWins.args, ['remove', 'x', '--config.store-dir=C:\\pnpm store\\v9'])
    assert.equal(linkedWins.storeDir, 'C:\\pnpm store\\v9')
  })

  const jobs = new JobTable()
  const first = jobs.create('install', 'first-plugin')
  const second = jobs.create('update', 'second-plugin', 'queued')
  ok('multiple Profile mutations can be represented in one serialized queue', () => {
    assert.equal(jobs.hasActive(), true)
    assert.equal(jobs.hasActivePackage('second-plugin'), true)
    assert.deepEqual(jobs.list().map(job => [job.packageName, job.phase]), [
      ['first-plugin', 'spawning'],
      ['second-plugin', 'queued'],
    ])
  })
  jobs.settle(first, { packageName: 'first-plugin', version: '1.0.0', requiresRestart: true })
  ok('a queued mutation remains active after the previous job settles', () => {
    assert.equal(jobs.hasActive(), true)
  })
  jobs.settle(second, { packageName: 'second-plugin', version: '2.0.0', requiresRestart: true })
  ok('the queue becomes idle after every mutation settles', () => assert.equal(jobs.hasActive(), false))

  const capacity = new JobTable()
  for (let index = 0; index < 50; index += 1) capacity.create('update', 'plugin-' + String(index), 'queued')
  ok('the operation queue caps active jobs at the upstream batch limit', () => {
    assert.equal(capacity.atCapacity(), true)
  })

  const mutations = new MutationQueue()
  const order: string[] = []
  mutations.enqueue(async () => { order.push('first'); throw new Error('expected failure') })
  mutations.enqueue(async () => { order.push('second') })
  await mutations.drain()
  ok('a failed mutation does not block the next queued mutation', () => {
    assert.deepEqual(order, ['first', 'second'])
  })

  const lockDir = join(tmp, 'profile-lock')
  mkdirSync(lockDir)
  const lockOrder: string[] = []
  let releaseFirst!: () => void
  let reportFirstStarted!: () => void
  const firstStarted = new Promise<void>((resolve) => { reportFirstStarted = resolve })
  const firstGate = new Promise<void>((resolve) => { releaseFirst = resolve })
  const firstLock = withProfileMutationLock(lockDir, async () => {
    lockOrder.push('first-start')
    reportFirstStarted()
    await firstGate
    lockOrder.push('first-end')
  })
  await firstStarted
  const secondLock = withProfileMutationLock(lockDir, async () => { lockOrder.push('second') })
  await new Promise(resolve => setTimeout(resolve, 25))
  assert.deepEqual(lockOrder, ['first-start'], '第二个 Profile 写入必须等待跨进程锁')
  releaseFirst()
  await Promise.all([firstLock, secondLock])
  ok('Profile file lock serializes independent callers', () => {
    assert.deepEqual(lockOrder, ['first-start', 'first-end', 'second'])
  })

  const oldLiveLock = join(lockDir, '.dsh-marketplace-mutation.lock')
  writeFileSync(oldLiveLock, JSON.stringify({
    pid: process.pid,
    createdAt: Date.now() - 60 * 60_000,
    token: 'still-live',
  }))
  ok('an old lock is not reclaimed while its owner process is alive', () => {
    assert.equal(removeStaleProfileLock(oldLiveLock), false)
    assert.equal(existsSync(oldLiveLock), true)
  })
  unlinkSync(oldLiveLock)

  const replacementLock = join(lockDir, '.dsh-marketplace-mutation.lock')
  await withProfileMutationLock(lockDir, async () => {
    writeFileSync(replacementLock, JSON.stringify({
      pid: process.pid,
      createdAt: Date.now(),
      token: 'replacement-owner',
    }))
  })
  ok('lock cleanup does not delete a replacement owner lock', () => {
    assert.equal(existsSync(replacementLock), true)
  })
  unlinkSync(replacementLock)
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log('store tests passed: ' + passed)
