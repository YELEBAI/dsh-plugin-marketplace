/** 复用启动器的包管理运行配置；不把桌面端私有工具写入全局 PATH。 */
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

export interface PackageManagerRuntime {
  command: string
  args?: readonly string[]
  env?: Readonly<Record<string, string>>
}

export interface RuntimeContext {
  get?: (name: string) => unknown
}

export function activeProfileRuntime(ctx: RuntimeContext): { dir: string; name?: string; installAnchor?: string; packageManager?: PackageManagerRuntime } | undefined {
  const value = ctx.get?.('profileContext') as { dir?: unknown; name?: unknown; installAnchor?: unknown; packageManager?: unknown } | undefined
  if (value === undefined || typeof value?.dir !== 'string' || value.dir.trim() === '') return undefined
  const runtime = value.packageManager as PackageManagerRuntime | undefined
  if (runtime !== undefined) {
    if (runtime === null || typeof runtime !== 'object' || typeof runtime.command !== 'string' || runtime.command.trim() === ''
      || (runtime.args !== undefined && (!Array.isArray(runtime.args) || runtime.args.some(arg => typeof arg !== 'string')))
      || (runtime.env !== undefined && (runtime.env === null || typeof runtime.env !== 'object' || Array.isArray(runtime.env)
        || Object.values(runtime.env).some(value => typeof value !== 'string')))) {
      throw new Error('DSH supplied an invalid Profile package-manager runtime.')
    }
  }
  return {
    dir: value.dir,
    ...(typeof value.name === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(value.name) ? { name: value.name } : {}),
    ...(typeof value.installAnchor === 'string' ? { installAnchor: value.installAnchor } : {}),
    ...(runtime === undefined ? {} : { packageManager: runtime }),
  }
}

export function isDesktopHost(electron = process.versions.electron, env: NodeJS.ProcessEnv = process.env): boolean {
  return electron !== undefined && env.ELECTRON_RUN_AS_NODE === '1'
}

export function packageManagerFor(ctx: RuntimeContext, desktop = isDesktopHost()): PackageManagerRuntime | undefined {
  const runtime = activeProfileRuntime(ctx)?.packageManager
  if (desktop && runtime === undefined) {
    throw new Error('Desktop did not supply its bundled package manager; refusing to use system pnpm.')
  }
  return runtime
}

/** 与桌面端官方管理器共用 package.json.lock；外层仍保留市场 FIFO 与旧 Profile 锁。 */
export async function withDesktopProfileLock<T>(ctx: RuntimeContext, dir: string, work: () => Promise<T>, desktop = isDesktopHost()): Promise<T> {
  if (!desktop) return work()
  const anchor = activeProfileRuntime(ctx)?.installAnchor
  if (anchor === undefined) throw new Error('Desktop did not supply its installation anchor; refusing an uncoordinated Profile write.')
  const module = await import(pathToFileURL(createRequire(anchor).resolve('@deepseek-ai/dsh-atomic-write')).href) as {
    withFileLock?: <R>(filename: string, operation: () => Promise<R>, options: { waitMs: number }) => Promise<R>
  }
  if (typeof module.withFileLock !== 'function') throw new Error('Desktop Profile writer lock is unavailable.')
  return module.withFileLock(join(dir, 'package.json'), work, { waitMs: 120_000 })
}

/** 使用桌面端自身的版本契约预检；市场不能暗中创建版本豁免。 */
export async function assertDesktopPluginCompatibility(ctx: RuntimeContext, manifest: unknown, desktop = isDesktopHost()): Promise<void> {
  if (!desktop) return
  const anchor = activeProfileRuntime(ctx)?.installAnchor
  if (anchor === undefined) throw new Error('Desktop installation anchor is unavailable.')
  const module = await import(pathToFileURL(createRequire(anchor).resolve('@deepseek-ai/dsh-app-boot')).href) as {
    evaluatePluginCompatibility?: (manifest: unknown) => { name: string; version: string; runtimeVersion: string; peers: Record<string, string> } | undefined
  }
  if (typeof module.evaluatePluginCompatibility !== 'function') throw new Error('Desktop plugin compatibility checker is unavailable.')
  const issue = module.evaluatePluginCompatibility(manifest)
  if (issue !== undefined) throw new Error('Plugin ' + issue.name + '@' + issue.version + ' does not declare compatibility with Desktop DSH ' + issue.runtimeVersion + ': ' + JSON.stringify(issue.peers))
}
