/** Plugin install-location resolution, persistence, and managed-dir helpers.
 *  The default location is the running Profile's node_modules, where pnpm
 *  manages everything. A custom install directory switches installs to an
 *  external entity directory: the marketplace downloads and validates the
 *  package first, copies the entity there, links required Host peer
 *  dependencies, records a file: dependency in the Profile, and keeps a
 *  junction from the Profile's node_modules to the external directory.
 */

import {
  accessSync,
  constants,
  existsSync,
  lstatSync,
  mkdirSync,
  realpathSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import type { ProfileManifest } from '@deepseek-ai/dsh-app-boot'
import { linkedPnpmStore } from './installer.ts'
import { profileLocation } from './profile.ts'
import { isDesktopHost } from './runtime.ts'
import type { RegistryConfig } from './registry.ts'

/** Resolved install location for the running Profile. */
export interface ProfileInstallLocation {
  dir: string
  name: string
  /** Whether plugin entities live outside the Profile default directory. */
  custom: boolean
  /** Directory where plugin entities are installed. */
  pluginDir: string
  /** Store the Profile's node_modules is bound to (null when unknown). */
  storeDir: string | null
}

/** Marketplace-managed settings (install dir, etc.), persisted under DSH_HOME. */
export function marketplaceSettingsPath(): string {
  const base = process.env.DSH_HOME?.trim() || join(homedir(), '.dsh')
  return join(base, 'marketplace', 'settings.json')
}

interface MarketplaceSettings {
  installDir: string
  pluginRoots: string[]
  agentWorkspaceDir: string
}

export function readMarketplaceSettings(): MarketplaceSettings {
  try {
    const parsed = JSON.parse(readFileSync(marketplaceSettingsPath(), 'utf8')) as Record<string, unknown>
    if (parsed === null || typeof parsed !== 'object') return { installDir: '', pluginRoots: [], agentWorkspaceDir: '' }
    const installDir = typeof parsed.installDir === 'string' ? parsed.installDir.trim() : ''
    const agentWorkspaceDir = typeof parsed.agentWorkspaceDir === 'string' ? parsed.agentWorkspaceDir.trim() : ''
    const pluginRoots = Array.isArray(parsed.pluginRoots)
      ? (parsed.pluginRoots as unknown[]).filter((value): value is string => typeof value === 'string' && value.trim() !== '').map(value => resolve(value))
      : []
    return { installDir, pluginRoots, agentWorkspaceDir }
  } catch {
    return { installDir: '', pluginRoots: [], agentWorkspaceDir: '' }
  }
}

export function writeMarketplaceSettings(patch: Partial<MarketplaceSettings>): void {
  const file = marketplaceSettingsPath()
  const next = { ...readMarketplaceSettings(), ...patch }
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, JSON.stringify(next, null, 2) + '\n', 'utf8')
}

export function defaultPluginRoot(profileDir: string): string {
  return join(resolve(profileDir), 'node_modules')
}

/** Default workspace used only by marketplace-created install/update Agents. */
export function defaultAgentWorkspaceDir(): string {
  return join(dirname(marketplaceSettingsPath()), 'agent-workspace')
}

/** Resolve and prepare the dedicated Agent workspace without touching user workspaces. */
export function agentWorkspaceLocation(): { workspaceDir: string; workspaceDirCustom: boolean } {
  const configured = readMarketplaceSettings().agentWorkspaceDir
  const defaultDir = resolve(defaultAgentWorkspaceDir())
  const workspaceDir = configured === '' ? defaultDir : resolve(configured)
  const custom = workspaceDir.toLocaleLowerCase() !== defaultDir.toLocaleLowerCase()
  if (custom) {
    if (!existsSync(workspaceDir) || !statSync(workspaceDir).isDirectory()) {
      throw new Error('Configured Agent workspace is not an existing directory: ' + workspaceDir)
    }
  } else {
    mkdirSync(workspaceDir, { recursive: true })
  }
  accessSync(workspaceDir, constants.R_OK | constants.W_OK)
  return { workspaceDir: realpathSync(workspaceDir), workspaceDirCustom: custom }
}

/** Persist an existing custom Agent workspace; empty restores the isolated default. */
export function persistAgentWorkspace(requestedDir: string): { workspaceDir: string; workspaceDirCustom: boolean } {
  const value = requestedDir.trim()
  if (value !== '' && !isAbsolute(value)) throw new Error('Agent workspace must be an absolute path.')
  if (value !== '') {
    const requested = resolve(value)
    if (!existsSync(requested) || !statSync(requested).isDirectory()) {
      throw new Error('Agent workspace must be an existing directory: ' + requested)
    }
    accessSync(requested, constants.R_OK | constants.W_OK)
  }
  const defaultDir = resolve(defaultAgentWorkspaceDir())
  const resolved = value === '' ? defaultDir : realpathSync(resolve(value))
  writeMarketplaceSettings({
    agentWorkspaceDir: resolved.toLocaleLowerCase() === defaultDir.toLocaleLowerCase() ? '' : resolved,
  })
  return agentWorkspaceLocation()
}

/** Resolve the running Profile and the directory that holds plugin entities. */
export function installLocation(ctx: Context, config: RegistryConfig): ProfileInstallLocation {
  const base = profileLocation(ctx)
  // ASAR 中的 Host peers 由桌面端解析器提供，不能像 Web 一样链接到外部实体目录。
  if (base.name === 'desktop' || isDesktopHost()) return {
    ...base, custom: false, pluginDir: defaultPluginRoot(base.dir), storeDir: linkedPnpmStore(base.dir),
  }
  const override = (config?.installDir ?? '').trim()
    || (process.env.DSH_PLUGIN_INSTALL_DIR ?? '').trim()
    || readMarketplaceSettings().installDir
    || ''
  const defaultRoot = defaultPluginRoot(base.dir)
  const resolvedOverride = override === '' ? defaultRoot : resolve(override)
  const custom = resolvedOverride.toLocaleLowerCase() !== resolve(defaultRoot).toLocaleLowerCase()
  return {
    dir: base.dir,
    name: base.name,
    custom,
    pluginDir: custom ? resolvedOverride : defaultRoot,
    storeDir: linkedPnpmStore(base.dir),
  }
}

/** Persist a chosen install directory; empty restores the Profile default. */
export function persistInstallLocation(profileDir: string, requestedDir: string): { installDir: string; installDirCustom: boolean } {
  const settings = readMarketplaceSettings()
  const defaultRoot = defaultPluginRoot(profileDir)
  const previousRoot = settings.installDir || defaultRoot
  const resolvedRoot = requestedDir.trim() === '' ? defaultRoot : resolve(requestedDir)
  const custom = resolvedRoot.toLocaleLowerCase() !== resolve(defaultRoot).toLocaleLowerCase()
  const pluginRoots = [...new Set([
    ...(settings.pluginRoots ?? []),
    previousRoot,
    resolvedRoot,
  ].map(value => resolve(value)))]
  writeMarketplaceSettings({ installDir: custom ? resolvedRoot : '', pluginRoots })
  return { installDir: custom ? resolvedRoot : defaultRoot, installDirCustom: custom }
}

/** Folder name used for a package inside the plugin entity directory. */
export function pluginFolderName(packageName: string): string {
  return packageName
}

export function pluginTarget(profile: ProfileInstallLocation, packageName: string): string {
  return join(profile.pluginDir, ...packageName.split('/'))
}

function fileDependencyTarget(profileDir: string, spec: string): string {
  const value = spec.slice(5)
  if (value.startsWith('//')) {
    try {
      return fileURLToPath(spec)
    } catch {
      // Fall through to path resolution so malformed specs fail validation
      // without escaping the marketplace-managed root checks.
    }
  }
  return resolve(profileDir, value)
}

/**
 * Resolve where an installed plugin entity lives. file: directory specs point
 * at the entity; file: tarball specs fall back to the managed plugin folder so
 * updates never mistake the archive for the entity.
 */
export function installedPluginTarget(profile: ProfileInstallLocation, packageName: string, manifest: ProfileManifest): string {
  const spec = manifest.dependencies?.[packageName]
  if (typeof spec === 'string' && spec.startsWith('file:')) {
    const target = fileDependencyTarget(profile.dir, spec)
    if (!target.toLocaleLowerCase().endsWith('.tgz')) return target
  }
  return pluginTarget(profile, packageName)
}

/** Roots the marketplace is allowed to manage, including previously chosen ones. */
export function knownPluginRoots(profile: ProfileInstallLocation): string[] {
  if (profile.name === 'desktop' || isDesktopHost()) return [resolve(defaultPluginRoot(profile.dir)).toLocaleLowerCase()]
  return [...new Set([
    defaultPluginRoot(profile.dir),
    profile.pluginDir,
    ...(readMarketplaceSettings().pluginRoots ?? []),
  ].map(value => resolve(value).toLocaleLowerCase()))]
}

/** Whether a target directory is a marketplace-managed entity of packageName. */
export function isManagedPluginTarget(profile: ProfileInstallLocation, packageName: string, target: string): boolean {
  const resolvedTarget = resolve(target).toLocaleLowerCase()
  const expectedTargets = knownPluginRoots(profile)
    .map(root => resolve(root, ...packageName.split('/')).toLocaleLowerCase())
  if (!expectedTargets.includes(resolvedTarget)) return false
  try {
    const manifest = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8')) as { name?: unknown }
    return manifest.name === packageName
  } catch {
    return false
  }
}

/** Existing marketplace-managed external entity, independent of the current setting. */
export function managedInstalledPluginTarget(
  profile: ProfileInstallLocation,
  packageName: string,
  manifest: ProfileManifest,
): string | null {
  const spec = manifest.dependencies?.[packageName]
  if (typeof spec !== 'string' || !spec.startsWith('file:') || spec.toLocaleLowerCase().endsWith('.tgz')) return null
  const target = installedPluginTarget(profile, packageName, manifest)
  return isManagedPluginTarget(profile, packageName, target) ? target : null
}

function dependencyPath(root: string, packageName: string): string {
  return join(root, ...packageName.split('/'))
}

const PACKAGE_NAME_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

/** Compatible aliases for Host peer dependencies declared with legacy names. */
const HOST_PEER_ALIASES: Record<string, string> = {
  cordis: '@deepseek-ai/cordis',
}

/**
 * External plugin directories live outside the Profile's Node resolution
 * scope, so DSH-provided peer dependencies are not found automatically.
 * Link the host-provided peers into the plugin's own node_modules to avoid a
 * successful install that crashes on the next DSH start.
 */
export function linkProfilePeerDependencies(target: string, profileDir: string): string[] {
  const manifest = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8')) as {
    peerDependencies?: Record<string, string>
    peerDependenciesMeta?: Record<string, { optional?: boolean }>
  }
  const peers = manifest.peerDependencies ?? {}
  const peerMeta = manifest.peerDependenciesMeta ?? {}
  const linked: string[] = []
  for (const packageName of Object.keys(peers)) {
    if (!PACKAGE_NAME_RE.test(packageName)) throw new Error('Invalid host peer dependency name: ' + packageName + '.')
    const destination = dependencyPath(join(target, 'node_modules'), packageName)
    const providedNames = [packageName, HOST_PEER_ALIASES[packageName]].filter((value): value is string => value !== undefined)
    const candidates = providedNames.flatMap((providedName) => [
      dependencyPath(join(profileDir, 'node_modules'), providedName),
      dependencyPath(join(dirname(profileDir), 'node_modules'), providedName),
    ])
    const source = candidates.find(candidate => existsSync(candidate))
    if (source === undefined) {
      if (peerMeta?.[packageName]?.optional === true) continue
      throw new Error('Required host peer dependency is unavailable: ' + packageName + '.')
    }
    if (existsSync(destination)) {
      try {
        if (realpathSync(destination).toLocaleLowerCase() === realpathSync(source).toLocaleLowerCase()) continue
      } catch {
        // Replace a stale or unreadable peer entry with the Host-owned one.
      }
      removePackagePath(destination)
    }
    mkdirSync(dirname(destination), { recursive: true })
    symlinkSync(source, destination, process.platform === 'win32' ? 'junction' : 'dir')
    linked.push(packageName)
  }
  return linked
}

/** file: spec pointing from the Profile directory at an external entity. */
export function localDependencySpec(profileDir: string, target: string): string {
  const resolvedTarget = resolve(target)
  let value = relative(resolve(profileDir), resolvedTarget)
  if (isAbsolute(value)) return 'file:' + resolvedTarget.replace(/\\/g, '/')
  value = value.replace(/\\/g, '/')
  if (!value.startsWith('.')) value = './' + value
  return 'file:' + value
}

/** Runtime package entry inside the Profile's node_modules. */
export function profilePackagePath(profileDir: string, packageName: string): string {
  return join(profileDir, 'node_modules', ...packageName.split('/'))
}

export function removePackagePath(path: string): void {
  try {
    if (lstatSync(path).isSymbolicLink()) unlinkSync(path)
    else rmSync(path, { recursive: true, force: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') throw error
  }
}

/** Swap the Profile runtime entry for a junction to an external entity. */
export function createProfilePackageLink(
  profileDir: string,
  packageName: string,
  target: string,
  jobId: string,
): { linkPath: string; backupPath: string; backupCreated: boolean } {
  const linkPath = profilePackagePath(profileDir, packageName)
  const backupPath = linkPath + '.marketplace-backup-' + jobId
  mkdirSync(dirname(linkPath), { recursive: true })
  let backupCreated = false
  if (existsSync(linkPath)) {
    removePackagePath(backupPath)
    renameSync(linkPath, backupPath)
    backupCreated = true
  }
  try {
    symlinkSync(target, linkPath, process.platform === 'win32' ? 'junction' : 'dir')
  } catch (error) {
    if (backupCreated && existsSync(backupPath)) renameSync(backupPath, linkPath)
    throw error
  }
  return { linkPath, backupPath, backupCreated }
}
