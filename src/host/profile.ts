/** Profile-directory resolution and bundle-layer reconciliation.
 *  Mirrors `dsh plugin` semantics (apps/cli/src/plugin.ts): pnpm manages
 *  the profile directory, and a dependency that declares dsh.bundle.patch
 *  joins the dsh.profile.bundles layer stack after every install/update.
 */

import { createRequire } from 'node:module'
import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import {
  DEFAULT_PROFILE_BUNDLES,
  PROFILE_TEMPLATES,
  initProfile,
  readProfileManifest,
  resolveProfileDir,
  writeProfileManifest,
  type ProfileManifest,
} from '@deepseek-ai/dsh-app-boot'
import type { MarketplaceInstalledEntry } from '../types.ts'
import { reconcileBundleName, toggleBundleName } from './bundle-state.ts'

const NAME = 'dsh'

export interface ProfileLocation {
  dir: string
  name: string
}

/**
 * The profile this plugin runs inside. The Loader's baseUrl is the config
 * tree directory — for a `dsh --profile <name>` launch that IS the profile
 * directory (the same anchor client-modules and typert-loader use). It may
 * arrive as a file:// URL string or a URL object, never as a bare path.
 * A file anchor pointing at cordis.yml resolves to its directory; anything
 * else falls back to the standard `web` profile location.
 */
export function profileLocation(ctx: Context): ProfileLocation {
  const baseUrl = ctx.baseUrl
  if (baseUrl !== undefined) {
    let raw: string
    if (typeof baseUrl === 'string') {
      raw = /^[a-z][a-z0-9+.-]*:/.test(baseUrl) ? fileURLToPath(new URL(baseUrl)) : baseUrl
    } else {
      raw = fileURLToPath(baseUrl)
    }
    const dir = /\.(yml|yaml|json)$/.test(basename(raw)) ? dirname(raw) : raw
    const name = basename(dir)
    if (name !== '' && name !== '.' && name !== '..') return { dir, name }
  }
  const fallback = 'web'
  return { dir: resolveProfileDir(fallback), name: fallback }
}

/** Initialize the profile directory when it does not exist yet. */
export function ensureProfile(dir: string, name: string): void {
  if (!existsSync(join(dir, 'package.json'))) {
    const template = PROFILE_TEMPLATES[name]
    if (template === undefined) initProfile(dir, DEFAULT_PROFILE_BUNDLES)
    else initProfile(dir, template.bundles, template.patchReload)
  }
}

/** Resolve an installed dependency's package.json from the profile directory. */
export function packageManifestPath(packageName: string, dir: string): string | null {
  try {
    // 暂存项目自身可能就是待检查的包；Node 会通过 `exports` 支持包自引用。
    const ownManifest = join(dir, 'package.json')
    try {
      const ownPackage = JSON.parse(readFileSync(ownManifest, 'utf8')) as { name?: unknown; exports?: unknown }
      if (ownPackage.name === packageName && ownPackage.exports !== undefined) return realpathSync(ownManifest)
    } catch {
      // 自身清单不可读时继续按 node_modules 搜索。
    }

    const require = createRequire(join(dir, 'package.json'))
    // `exports` 可能不导出 `./package.json`；按 Node 的普通查找路径解析包目录后直接读取清单。
    for (const searchPath of require.resolve.paths(packageName) ?? []) {
      const candidate = join(searchPath, packageName, 'package.json')
      if (existsSync(candidate)) return realpathSync(candidate)
    }
    return null
  } catch {
    return null
  }
}

/** Whether an installed dependency declares dsh.bundle.patch (i.e. is a bundle). */
export function exportsPatch(packageName: string, dir: string): boolean {
  const path = packageManifestPath(packageName, dir)
  if (path === null) return false
  try {
    const manifest = JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
    const dsh = manifest.dsh as Record<string, unknown> | undefined
    const bundle = dsh?.bundle as Record<string, unknown> | undefined
    return typeof bundle?.patch === 'string'
  } catch {
    return false
  }
}

/** Installed version of one dependency, or null when unresolvable. */
export function installedVersion(packageName: string, dir: string): string | null {
  const path = packageManifestPath(packageName, dir)
  if (path === null) return null
  try {
    const manifest = JSON.parse(readFileSync(path, 'utf8')) as { version?: unknown }
    return typeof manifest.version === 'string' ? manifest.version : null
  } catch {
    return null
  }
}

/** Local description/repository facts of one installed package. */
export function installedPackageSummary(packageName: string, dir: string): { description: string | null; repositoryUrl: string | null } {
  const path = packageManifestPath(packageName, dir)
  if (path === null) return { description: null, repositoryUrl: null }
  try {
    const manifest = JSON.parse(readFileSync(path, 'utf8')) as {
      description?: unknown
      homepage?: unknown
      repository?: unknown
    }
    const repository = typeof manifest.repository === 'string' ? manifest.repository : (manifest.repository as { url?: unknown } | undefined)?.url
    return {
      description: typeof manifest.description === 'string' && manifest.description.trim() !== '' ? manifest.description.trim() : null,
      repositoryUrl: typeof manifest.homepage === 'string' && manifest.homepage.trim() !== ''
        ? manifest.homepage.trim()
        : typeof repository === 'string' && repository.trim() !== ''
          ? repository.replace(/^git\+/, '').replace(/\.git$/, '')
          : null,
    }
  } catch {
    return { description: null, repositoryUrl: null }
  }
}

interface InstalledPackageFacts {
  version: string
  isBundle: boolean
  location: string
  description: string | null
  repositoryUrl: string | null
}

/** 一次解析已安装包清单，避免列表扫描对同一 package.json 重复 resolve/read。 */
function installedPackageFacts(packageName: string, dir: string): InstalledPackageFacts | null {
  const manifestPath = packageManifestPath(packageName, dir)
  if (manifestPath === null) return null
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      version?: unknown
      description?: unknown
      homepage?: unknown
      repository?: unknown
      dsh?: { bundle?: { patch?: unknown } }
    }
    if (typeof manifest.version !== 'string') return null
    const repository = typeof manifest.repository === 'string'
      ? manifest.repository
      : (manifest.repository as { url?: unknown } | undefined)?.url
    return {
      version: manifest.version,
      isBundle: typeof manifest.dsh?.bundle?.patch === 'string',
      location: dirname(manifestPath),
      description: typeof manifest.description === 'string' && manifest.description.trim() !== '' ? manifest.description.trim() : null,
      repositoryUrl: typeof manifest.homepage === 'string' && manifest.homepage.trim() !== ''
        ? manifest.homepage.trim()
        : typeof repository === 'string' && repository.trim() !== ''
          ? repository.replace(/^git\+/, '').replace(/\.git$/, '')
          : null,
    }
  } catch {
    return null
  }
}

/**
 * Reconcile one package's bundle layer after a marketplace mutation. New
 * bundles and dependencies that gain a bundle declaration join the stack;
 * an installed bundle already omitted from the stack remains disabled.
 */
export function reconcileBundle(
  before: ProfileManifest,
  beforeDeclaresBundle: boolean,
  packageName: string,
  dir: string,
): ProfileManifest {
  const after = readProfileManifest(NAME, dir)
  const current = after.dsh?.profile?.bundles ?? []
  const plugins = reconcileBundleName(
    current,
    packageName,
    before.dependencies?.[packageName] !== undefined,
    beforeDeclaresBundle,
    after.dependencies?.[packageName] !== undefined,
    exportsPatch(packageName, dir),
  )
  if (!sameNames(current, plugins)) {
    after.dsh = { ...after.dsh, profile: { ...after.dsh?.profile, bundles: plugins } }
    writeProfileManifest(dir, after)
  }
  return after
}

/** Return a manifest with only one dependency changed and every current bundle choice preserved. */
export function mergeProfileDependency(
  manifest: ProfileManifest,
  packageName: string,
  spec: string | undefined,
): ProfileManifest {
  const dependencies = { ...manifest.dependencies }
  if (spec === undefined) delete dependencies[packageName]
  else dependencies[packageName] = spec
  return { ...manifest, dependencies }
}

/** Merge one dependency into the latest on-disk manifest instead of rewriting a stale snapshot. */
export function writeProfileDependency(packageName: string, spec: string | undefined, dir: string): void {
  const current = readProfileManifest(NAME, dir)
  writeProfileManifest(dir, mergeProfileDependency(current, packageName, spec))
}

/** Persist whether one installed bundle participates in the Profile layer stack. */
export function setBundleEnabled(packageName: string, enabled: boolean, dir: string): boolean {
  const manifest = readProfileManifest(NAME, dir)
  if (manifest.dependencies?.[packageName] === undefined || !exportsPatch(packageName, dir)) return false
  const current = manifest.dsh?.profile?.bundles ?? []
  const bundles = toggleBundleName(current, packageName, enabled)
  if (!sameNames(current, bundles)) {
    manifest.dsh = { ...manifest.dsh, profile: { ...manifest.dsh?.profile, bundles } }
    writeProfileManifest(dir, manifest)
  }
  return true
}

function sameNames(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

/**
 * Installed dependency rows with versions and bundle-layer membership, plus
 * bundle-declaring directories that exist in the plugin directory but are not
 * linked to the Profile. Scoped folders (@scope/pkg) are scanned one level
 * deeper so marketplace-managed scoped packages are still discovered.
 */
export function installedEntries(manifest: ProfileManifest, dir: string, pluginDir: string, scanUnlinkedDirectories = true): MarketplaceInstalledEntry[] {
  const bundles = new Set(manifest.dsh?.profile?.bundles ?? [])
  const entries: MarketplaceInstalledEntry[] = []
  const linkedPackages = new Set(Object.keys(manifest.dependencies ?? {}))
  for (const packageName of Object.keys(manifest.dependencies ?? {})) {
    const facts = installedPackageFacts(packageName, dir)
    if (facts === null) continue
    const declared = manifest.dependencies?.[packageName]
    entries.push({
      packageName,
      version: facts.version,
      isBundle: facts.isBundle,
      linked: true,
      location: facts.location,
      enabled: facts.isBundle && bundles.has(packageName),
      currentSpec: typeof declared === 'string' ? declared : '',
      description: facts.description,
      repositoryUrl: facts.repositoryUrl,
      registryRepo: null,
      availableVersion: null,
      availableVersionSource: null,
      verifiedCommit: null,
      updateAvailable: false,
      canUpdate: false,
      install: null,
    })
  }
  const scanLocation = (location: string): void => {
    try {
      const pluginManifest = JSON.parse(readFileSync(join(location, 'package.json'), 'utf8')) as {
        name?: unknown
        version?: unknown
        description?: unknown
        homepage?: unknown
        repository?: unknown
        dsh?: { bundle?: { patch?: unknown } }
      }
      const packageName = typeof pluginManifest.name === 'string' ? pluginManifest.name.trim() : ''
      if (packageName === '' || linkedPackages.has(packageName) || typeof pluginManifest.dsh?.bundle?.patch !== 'string') return
      const repository = typeof pluginManifest.repository === 'string' ? pluginManifest.repository : (pluginManifest.repository as { url?: unknown } | undefined)?.url
      entries.push({
        packageName,
        version: typeof pluginManifest.version === 'string' ? pluginManifest.version : 'unknown',
        isBundle: true,
        linked: false,
        location,
        enabled: false,
        currentSpec: '',
        description: typeof pluginManifest.description === 'string' ? pluginManifest.description : null,
        repositoryUrl: typeof pluginManifest.homepage === 'string'
          ? pluginManifest.homepage
          : typeof repository === 'string'
            ? repository.replace(/^git\+/, '').replace(/\.git$/, '')
            : null,
        registryRepo: null,
        availableVersion: null,
        availableVersionSource: null,
        verifiedCommit: null,
        updateAvailable: false,
        canUpdate: false,
        install: null,
      })
    } catch {
      // Not a readable plugin entity — ignore.
    }
  }
  if (!scanUnlinkedDirectories) return entries.sort((a, b) => a.packageName.localeCompare(b.packageName))
  try {
    for (const item of readdirSync(pluginDir, { withFileTypes: true })) {
      if (!item.isDirectory()) continue
      const location = join(pluginDir, item.name)
      scanLocation(location)
      if (item.name.startsWith('@')) {
        try {
          for (const child of readdirSync(location, { withFileTypes: true })) {
            if (!child.isDirectory()) continue
            scanLocation(join(location, child.name))
          }
        } catch {
          // Ignore unreadable scoped folders.
        }
      }
    }
  } catch {
    // The plugin directory may not exist yet (e.g. a custom location).
  }
  return entries.sort((a, b) => a.packageName.localeCompare(b.packageName))
}
