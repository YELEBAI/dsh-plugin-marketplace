/** Install/uninstall/update job table and the pnpm spawn pipeline.
 *  Jobs run detached from the RPC call: installPlugin() returns a jobId and the
 *  client polls jobStatus(), so a long pnpm run never blocks the wire.
 */

import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { closeSync, openSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, resolve, win32 } from 'node:path'
import type {
  MarketplaceJobKind,
  MarketplaceJobPhase,
  MarketplaceJobStatus,
} from '../types.ts'

const MAX_LOG_CHARS = 65536
const MAX_ACTIVE_JOBS = 50
const MAX_FINISHED_JOBS = 12
const FINISHED_JOB_TTL_MS = 10 * 60_000
const PROFILE_LOCK_FILE = '.dsh-marketplace-mutation.lock'
const PROFILE_LOCK_TIMEOUT_MS = 2 * 60_000
const PROFILE_LOCK_STALE_MS = 15 * 60_000
const WINDOWS_ABSOLUTE_PATH = /^(?:[A-Za-z]:[\\/]|\\\\)/

function resolveStoreDir(dir: string, storeDir: string): string {
  const normalized = WINDOWS_ABSOLUTE_PATH.test(storeDir) ? win32.normalize(storeDir) : storeDir
  return isAbsolute(normalized) || WINDOWS_ABSOLUTE_PATH.test(normalized)
    ? normalized
    : resolve(dir, normalized)
}

export interface JobOutcome {
  packageName: string
  version: string
  requiresRestart: boolean
}

export interface JobFailure {
  code: string
  message: string
}

export interface JobRecord {
  jobId: string
  kind: MarketplaceJobKind
  packageName: string
  phase: MarketplaceJobPhase
  log: string
  exitCode: number | null
  startedAt: number
  finishedAt: number | null
  outcome: JobOutcome | null
  failure: JobFailure | null
}

export class JobTable {
  private readonly jobs = new Map<string, JobRecord>()
  private seq = 0

  create(
    kind: MarketplaceJobKind,
    packageName: string,
    phase: MarketplaceJobPhase = 'spawning',
  ): JobRecord {
    this.pruneFinished()
    this.seq += 1
    const record: JobRecord = {
      jobId: 'mkt-' + String(this.seq) + '-' + Date.now().toString(36),
      kind,
      packageName,
      phase,
      log: '',
      exitCode: null,
      startedAt: Date.now(),
      finishedAt: null,
      outcome: null,
      failure: null,
    }
    this.jobs.set(record.jobId, record)
    this.pruneFinished()
    return record
  }

  get(jobId: string): JobRecord | undefined {
    return this.jobs.get(jobId)
  }

  list(): MarketplaceJobStatus[] {
    this.pruneFinished()
    return [...this.jobs.values()]
      .filter(job => job.finishedAt === null)
      .sort((left, right) => left.startedAt - right.startedAt)
      .map(job => this.snapshot(job))
  }

  hasActive(): boolean {
    for (const job of this.jobs.values()) {
      if (job.finishedAt === null) return true
    }
    return false
  }

  atCapacity(): boolean {
    let active = 0
    for (const job of this.jobs.values()) {
      if (job.finishedAt !== null) continue
      active += 1
      if (active >= MAX_ACTIVE_JOBS) return true
    }
    return false
  }

  hasActivePackage(packageName: string): boolean {
    for (const job of this.jobs.values()) {
      if (job.packageName === packageName && job.finishedAt === null) return true
    }
    return false
  }

  append(job: JobRecord, chunk: string): void {
    job.log = (job.log + chunk).slice(-MAX_LOG_CHARS)
  }

  phase(job: JobRecord, value: MarketplaceJobPhase): void {
    job.phase = value
  }

  exit(job: JobRecord, code: number | null): void {
    job.exitCode = code
  }

  settle(job: JobRecord, outcome: JobOutcome): void {
    job.phase = 'done'
    job.outcome = outcome
    job.finishedAt = Date.now()
  }

  fail(job: JobRecord, failure: JobFailure): void {
    job.phase = 'failed'
    job.failure = failure
    job.finishedAt = Date.now()
  }

  snapshot(job: JobRecord): MarketplaceJobStatus {
    return {
      jobId: job.jobId,
      kind: job.kind,
      packageName: job.packageName,
      phase: job.phase,
      log: job.log,
      exitCode: job.exitCode,
      startedAt: job.startedAt,
      finishedAt: job.finishedAt,
      outcome: job.outcome === null ? null : { ...job.outcome },
      failure: job.failure === null ? null : { ...job.failure },
    }
  }

  /** 限制完成记录的数量与寿命，同时始终保留所有活跃任务。 */
  private pruneFinished(now = Date.now()): void {
    const finished = [...this.jobs.entries()]
      .filter(([, job]) => job.finishedAt !== null)
      .sort((left, right) => (left[1].finishedAt ?? 0) - (right[1].finishedAt ?? 0))
    for (const [jobId, job] of finished) {
      if (now - (job.finishedAt ?? now) > FINISHED_JOB_TTL_MS) this.jobs.delete(jobId)
    }
    const retained = finished.filter(([jobId]) => this.jobs.has(jobId))
    for (const [jobId] of retained.slice(0, Math.max(0, retained.length - MAX_FINISHED_JOBS))) this.jobs.delete(jobId)
  }
}

/** Profile 写操作的先进先出串行队列；单项拒绝不会阻断后续任务。 */
export class MutationQueue {
  private tail: Promise<void> = Promise.resolve()

  enqueue(work: () => Promise<void>): void {
    const scheduled = this.tail.catch(() => undefined).then(work)
    this.tail = scheduled.catch(() => undefined)
    void scheduled
  }

  async drain(): Promise<void> {
    await this.tail
  }
}

/** 跨 MarketplaceService/DSH 进程串行修改同一 Profile。 */
export async function withProfileMutationLock<T>(dir: string, work: () => Promise<T>): Promise<T> {
  const lockPath = join(dir, PROFILE_LOCK_FILE)
  const deadline = Date.now() + PROFILE_LOCK_TIMEOUT_MS
  const token = randomUUID()
  let descriptor: number | null = null
  while (descriptor === null) {
    try {
      const candidate = openSync(lockPath, 'wx')
      try {
        writeFileSync(candidate, JSON.stringify({ pid: process.pid, createdAt: Date.now(), token }) + '\n', 'utf8')
        descriptor = candidate
      } catch (error) {
        closeSync(candidate)
        try { unlinkSync(lockPath) } catch { /* The failed create may not have left a file. */ }
        throw error
      }
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'EEXIST') throw error
      if (removeStaleProfileLock(lockPath)) continue
      if (Date.now() >= deadline) throw new Error('Another DSH process is modifying this Profile. Wait for it to finish and retry.')
      await delay(200)
    }
  }
  try {
    return await work()
  } finally {
    closeSync(descriptor)
    try {
      const current = JSON.parse(readFileSync(lockPath, 'utf8')) as { token?: unknown }
      if (current.token === token) unlinkSync(lockPath)
    } catch { /* Another cleanup path may already have removed or replaced it. */ }
  }
}

export function removeStaleProfileLock(lockPath: string): boolean {
  try {
    const value = JSON.parse(readFileSync(lockPath, 'utf8')) as { pid?: unknown; createdAt?: unknown }
    const pid = typeof value.pid === 'number' ? value.pid : 0
    const createdAt = typeof value.createdAt === 'number' ? value.createdAt : 0
    // A live owner always wins, regardless of age. Long downloads must never
    // lose mutual exclusion merely because they crossed the stale-file TTL.
    if (processAlive(pid)) return false
    if (pid <= 0 && createdAt > 0 && Date.now() - createdAt < PROFILE_LOCK_STALE_MS) return false
    unlinkSync(lockPath)
    return true
  } catch {
    try {
      // 另一进程可能刚以 wx 创建文件、尚未写完 JSON；新文件不能按损坏锁删除。
      if (Date.now() - statSync(lockPath).mtimeMs < PROFILE_LOCK_STALE_MS) return false
      unlinkSync(lockPath)
      return true
    } catch {
      return false
    }
  }
}

function processAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false
  try { process.kill(pid, 0); return true } catch (error) { return (error as NodeJS.ErrnoException).code === 'EPERM' }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Reuse the pnpm store the working directory's node_modules is already bound
 * to (read from node_modules/.modules.yaml). Passing the same store to every
 * pnpm invocation prevents ERR_PNPM_UNEXPECTED_STORE when the Profile and the
 * staging/plugin directories would otherwise resolve different stores.
 */
export function linkedPnpmStore(dir: string): string | null {
  try {
    const metadata = readFileSync(join(dir, 'node_modules', '.modules.yaml'), 'utf8')
    try {
      const parsed = JSON.parse(metadata) as { storeDir?: unknown }
      if (typeof parsed?.storeDir === 'string' && parsed.storeDir.trim() !== '') {
        const storeDir = parsed.storeDir.trim()
        return resolveStoreDir(dir, storeDir)
      }
    } catch {
      // Fall through to the YAML scan below.
    }
    const match = /^\s*["']?storeDir["']?\s*:\s*["']?([^"'\r\n]+)["']?\s*,?\s*$/m.exec(metadata)
    const storeDir = match?.[1]?.trim()
    if (storeDir === undefined || storeDir === '') return null
    return resolveStoreDir(dir, storeDir)
  } catch {
    return null
  }
}

/**
 * Build the pnpm argument list for one job, forwarding the store the working
 * directory is bound to (or the caller-supplied Profile-linked fallback).
 * Exposed separately so the store-selection logic is unit-testable without
 * spawning a process.
 */
export function pnpmArgsFor(
  args: string[],
  dir: string,
  fallbackStoreDir: string | null,
): { args: string[]; storeDir: string | null } {
  const storeDir = linkedPnpmStore(dir) ?? (fallbackStoreDir === null ? null : resolveStoreDir(dir, fallbackStoreDir))
  return {
    // pnpm 会识别已带版本后缀的实际路径；去掉后缀会切换到另一个 Store。
    args: storeDir === null ? args : [...args, '--config.store-dir=' + storeDir],
    storeDir,
  }
}

/**
 * Run one pnpm invocation in the working directory, streaming stdout and
 * stderr into the job log. When the directory is bound to a pnpm store (or
 * the caller supplies a Profile-linked store as fallback), the same store is
 * forwarded through --config.store-dir so staging, plugin and Profile jobs
 * never drift onto another store. Mirrors the CLI's Windows shell forwarding
 * (pnpm resolves through its .cmd shim).
 */
export function runPnpmJob(
  job: JobRecord,
  args: string[],
  dir: string,
  table: JobTable,
  fallbackStoreDir: string | null = null,
): Promise<number | null> {
  return new Promise((resolve) => {
    // 后台安装与回滚没有 TTY；CI 允许 pnpm 重建依赖目录。
    // 同时保留普通 install 更新锁文件的语义，避免 CI 默认冻结锁文件。
    const jobArgs = args[0] === 'install' && !args.some(arg => /^(?:--(?:no-)?frozen-lockfile|--config\.frozen-lockfile)(?:=|$)/.test(arg))
      ? [...args, '--no-frozen-lockfile']
      : args
    const { args: pnpmArgs, storeDir } = pnpmArgsFor(jobArgs, dir, fallbackStoreDir)
    table.append(job, '$ pnpm ' + pnpmArgs.map((arg) => /\s/.test(arg) ? JSON.stringify(arg) : arg).join(' ') + '\n')
    if (storeDir !== null) table.append(job, 'Using profile-linked pnpm store: ' + storeDir + '\n')
    const child = spawn('pnpm', pnpmArgs, {
      cwd: dir,
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      env: { ...process.env, CI: 'true' },
    })
    child.stdout?.on('data', (chunk: Buffer) => { table.append(job, chunk.toString()) })
    child.stderr?.on('data', (chunk: Buffer) => { table.append(job, chunk.toString()) })
    child.on('error', (error) => {
      table.append(job, 'spawn failed: ' + error.message + '\n')
      resolve(null)
    })
    child.on('close', (code) => {
      table.exit(job, code)
      resolve(code)
    })
  })
}

/** Profile 写入失败时做有界重试，覆盖 Windows 短暂文件占用与 lockfile 竞争。 */
export async function runProfilePnpmJob(
  job: JobRecord,
  args: string[],
  dir: string,
  table: JobTable,
  fallbackStoreDir: string | null = null,
): Promise<number | null> {
  let code: number | null = null
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const logOffset = job.log.length
    code = await runPnpmJob(job, args, dir, table, fallbackStoreDir)
    if (code === 0 || code === null) return code
    const latestLog = job.log.slice(logOffset)
    if (!/(?:EBUSY|EPERM|EACCES|writeLockfile|file[- ]?lock|resource busy)/i.test(latestLog)) return code
    if (attempt < 3) {
      table.append(job, 'Profile write failed; retrying after a short Windows file-lock backoff (' + String(attempt) + '/2).\n')
      await delay(400 * attempt)
    }
  }
  return code
}
