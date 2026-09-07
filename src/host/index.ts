/** Marketplace host service: the `marketplace` Typert Remote namespace.
 *  Search reads the central verified Registry; details and install-time
 *  verification read GitHub. Install/update/uninstall run pnpm jobs in
 *  the profile directory and reconcile the dsh.profile.bundles layer stack
 *  exactly like `dsh plugin add/remove` does. Every method resolves to a
 *  RemoteResult union — business failures carry a typed code, unexpected
 *  throws are folded into the same shape.
 *
 *  Local fork additions on top of upstream 0.6.1:
 *  - every pnpm job reuses the Profile-linked store (linkedPnpmStore);
 *  - an optional custom install directory with Host-backed picker support;
 *  - static conflict diagnosis (duplicate bundle ids / Cordis services)
 *    with pre-install, pre-enable and manual diagnosis gates;
 *  - unlinked plugin directories are reported and kept out of Profile ops;
 *  - default-mode installs/uninstalls keep manifest + lockfile rollback.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, renameSync, cpSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { ProfileManifest } from '@deepseek-ai/dsh-app-boot'
import type {
  MarketplaceAgentWorkspace,
  MarketplaceBatchUpdateRequest,
  MarketplaceBatchUpdateResult,
  MarketplaceBatchPackageRequest,
  MarketplaceBatchToggleRequest,
  MarketplaceBatchToggleResult,
  MarketplaceBatchUninstallResult,
  MarketplaceConflict,
  MarketplaceDetailsRequest,
  MarketplaceDiagnoseConflictsResult,
  MarketplaceGuidedAgentRequest,
  MarketplaceGuidedAgentTask,
  MarketplaceInstallLocation,
  MarketplaceInstallRequest,
  MarketplaceManualInstallRequest,
  MarketplaceManualInstallResult,
  MarketplaceInstalled,
  MarketplaceInstalledRequest,
  MarketplaceJobStatus,
  MarketplaceJobStatusRequest,
  MarketplacePluginDetails,
  MarketplacePluginCategory,
  MarketplaceRegistryPlugin,
  MarketplaceRestartResult,
  MarketplaceResult,
  MarketplaceSearchPage,
  MarketplaceSearchRequest,
  MarketplaceUninstallRequest,
  MarketplaceToggleRequest,
  MarketplaceToggleResult,
} from '../types.ts'
import { readProfileManifest, writeProfileManifest } from '@deepseek-ai/dsh-app-boot'
import { GitHubClient, GitHubError } from './github.ts'
import { githubArchiveSpec } from './install-spec.ts'
import { buildGuidedAgentTask } from './guided-agent.ts'
import { loadInstallSkill, type MarketplaceSkillRegistration } from './install-skill.ts'
import { JobTable, MutationQueue, runPnpmJob, runProfilePnpmJob, withProfileMutationLock, type JobRecord } from './installer.ts'
import { parseManualInstall } from './manual-install.ts'
import { scheduleProcessRestart } from './restart.ts'
import {
  SELF_BRANCH,
  SELF_PACKAGE,
  SELF_REPOSITORY,
  applySelfUpdate,
  compareSemver,
  selfUpdateTarget,
  shouldRefreshSelfUpdate,
  type SelfUpdateTarget,
} from './self-update.ts'
import {
  RegistryClient,
  RegistryConfigSchema,
  RegistryError,
  type RegistryConfig,
} from './registry.ts'
import {
  ensureProfile,
  exportsPatch,
  installedEntries,
  installedVersion,
  packageManifestPath,
  profileLocation,
  reconcileBundle,
  writeProfileDependency,
} from './profile.ts'
import {
  agentWorkspaceLocation,
  createProfilePackageLink,
  installLocation,
  linkProfilePeerDependencies,
  localDependencySpec,
  managedInstalledPluginTarget,
  marketplaceSettingsPath,
  persistInstallLocation,
  persistAgentWorkspace,
  pluginTarget,
  profilePackagePath,
  removePackagePath,
  type ProfileInstallLocation,
} from './install-location.ts'
import { toggleBundleName } from './bundle-state.ts'
import {
  computeConflicts,
  conflictIdentity,
  extractPatchRows,
  extractServiceNames,
  packageEntryPath,
  packagePatchPath,
  readSourceText,
  stagedInstallConflict,
} from './conflicts.ts'

const NAME = 'dsh'
const BUNDLED_REGISTRY_URL = new URL('../registry/plugins.json', import.meta.url).href
const DEFAULT_REGISTRY_URL = 'https://raw.githubusercontent.com/YELEBAI/dsh-plugin-marketplace/main/registry/plugins.json'

type Ok<T> = { ok: true; value: T }
type Err = { ok: false; error: { code: string; message: string; details: object } }
type InstallSource = {
  registered: MarketplaceRegistryPlugin | SelfUpdateTarget
  details: MarketplacePluginDetails
}

function ok<T>(value: T): Ok<T> {
  return { ok: true, value }
}

function fail(code: string, message: string, details: object = {}): Err {
  return { ok: false, error: { code, message, details } }
}

class MarketplaceOperationError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly details: object = {},
  ) {
    super(message)
    this.name = 'MarketplaceOperationError'
  }
}

/** Normalize any thrown value into the Remote error branch. */
function toFailure(error: unknown): Err {
  if (error instanceof GitHubError) {
    return fail(error.code, error.message, error.details)
  }
  if (error instanceof RegistryError) {
    return fail(error.code, error.message, error.details)
  }
  if (error instanceof MarketplaceOperationError) {
    return fail(error.code, error.message, error.details)
  }
  const message = error instanceof Error ? error.message : String(error)
  return fail('internal', message, {})
}

export class MarketplaceService extends TypertRemoteService {
  static inject = ['skills']
  static Config = RegistryConfigSchema

  private readonly github: GitHubClient
  private readonly registry: RegistryClient
  private readonly jobs = new JobTable()
  private readonly config: RegistryConfig
  private selfUpdateCache: { details: MarketplacePluginDetails; target: SelfUpdateTarget; expiresAt: number } | undefined
  private pendingInstallResolution = 0
  private restartPending = false
  /** 同一 Profile 的写操作排队执行，避免批量操作并发改写锁文件。 */
  private readonly mutationQueue = new MutationQueue()

  constructor(ctx: Context, config: RegistryConfig) {
    super(ctx, 'marketplace')
    ;(ctx as Context & { skills: { register: (skill: MarketplaceSkillRegistration) => () => void } }).skills.register(loadInstallSkill())
    this.config = config
    this.github = new GitHubClient(config.registryRequestTimeoutMs)
    const source = config.registryUrl ?? process.env.DSH_PLUGIN_REGISTRY_URL?.trim() ?? DEFAULT_REGISTRY_URL
    // Fail a self-contained URL misconfiguration while the plugin is loading.
    new URL(source)
    this.registry = new RegistryClient(
      source,
      BUNDLED_REGISTRY_URL,
      config.registryCacheMinutes * 60_000,
      config.registryRequestTimeoutMs,
      source === DEFAULT_REGISTRY_URL,
    )
  }

  @Remote('search')
  async search(request: MarketplaceSearchRequest): Promise<MarketplaceResult<MarketplaceSearchPage>> {
    try {
      const page = Number.isInteger(request.page) && request.page >= 1 ? request.page : 1
      const sort = request.sort === 'updated' || request.sort === 'trending' ? request.sort : 'stars'
      const category = request.category === 'all' ? 'all' : request.category as MarketplacePluginCategory
      return ok(await this.registry.search(request.query, page, sort, category))
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('details')
  async details(request: MarketplaceDetailsRequest): Promise<MarketplaceResult<MarketplacePluginDetails>> {
    try {
      return ok(await this.github.details(request.repo, request.ref ?? ''))
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('guidedTask')
  async guidedTask(request: MarketplaceGuidedAgentRequest): Promise<MarketplaceResult<MarketplaceGuidedAgentTask>> {
    try {
      const registered = await this.registry.find(request.repo)
      if (registered === undefined) {
        return fail('not-in-registry', request.repo + ' is not present in the verified DSH plugin Registry.')
      }
      if (request.ref.trim().toLocaleLowerCase() !== registered.verifiedCommit.toLocaleLowerCase()) {
        return fail('unverified-ref', 'The guided Agent task must use the exact commit approved by the Registry.', {
          requestedRef: request.ref,
          verifiedCommit: registered.verifiedCommit,
        })
      }
      if (registered.install.mode !== 'guided') {
        return fail('agent-not-required', 'This plugin already has a verified automatic install path.')
      }
      const profile = profileLocation(this.ctx)
      ensureProfile(profile.dir, profile.name)
      if (registered.install.profiles.length > 0 && !registered.install.profiles.includes(profile.name)) {
        return fail('profile-unsupported', 'This plugin is not verified for the current Profile.', {
          profile: profile.name,
          supportedProfiles: registered.install.profiles,
        })
      }
      const evidence = await this.registry.guidedEvidence(registered.fullName)
      if (evidence !== undefined && (
        evidence.packageName !== registered.packageName
        || evidence.version !== registered.version
        || evidence.verifiedCommit.toLocaleLowerCase() !== registered.verifiedCommit.toLocaleLowerCase()
      )) {
        return fail('audit-stale', 'The guided-install audit does not match the current Registry entry. Wait for the next scan before starting an Agent.')
      }
      const workspace = agentWorkspaceLocation()
      return ok(buildGuidedAgentTask(registered, profile.name, request.operation, workspace.workspaceDir, evidence))
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('installPlugin')
  async installPlugin(request: MarketplaceInstallRequest): Promise<MarketplaceResult<{ jobId: string }>> {
    return this.startJob('install', request.repo, request.ref ?? '')
  }

  @Remote('manualInstall')
  async manualInstall(request: MarketplaceManualInstallRequest): Promise<MarketplaceResult<MarketplaceManualInstallResult>> {
    if (this.restartPending) {
      return fail('restart-pending', 'DSH is already preparing to restart.')
    }
    if (this.profileMutationBusy()) {
      return fail('job-running', 'Another Profile plugin operation is already in progress.')
    }
    this.pendingInstallResolution += 1
    try {
      const profile = installLocation(this.ctx, this.config)
      ensureProfile(profile.dir, profile.name)
      let parsed: ReturnType<typeof parseManualInstall>
      try {
        parsed = parseManualInstall(request.command, profile.name)
      } catch (error) {
        return fail('manual-command-invalid', error instanceof Error ? error.message : String(error))
      }

      const details = await this.github.details(parsed.repo, parsed.ref)
      if (!/^[0-9a-f]{40}$/i.test(details.resolvedRef)) {
        return fail('manual-ref-unresolved', 'The GitHub source could not be frozen to an exact commit.')
      }
      const manifest = details.manifest
      if (manifest === null || manifest.bundlePatch === null || details.patch === null) {
        return fail('not-a-dsh-plugin', details.repo + ' does not provide a readable DSH bundle manifest and patch.')
      }
      const packageName = manifest.name.trim()
      if (!validPackageName(packageName)) {
        return fail('bad-package', 'The repository declares an invalid package name: ' + manifest.name)
      }
      // Registry-backed operations may have been accepted while the manual
      // GitHub source was resolving. Do not capture a stale Profile snapshot
      // or let the manual pnpm process race the shared mutation queue.
      if (this.jobs.hasActive()) {
        return fail('job-running', 'Another Profile plugin operation is already in progress.')
      }
      const initial = readProfileManifest(NAME, profile.dir)
      const initialOperation = initial.dependencies?.[packageName] === undefined ? 'install' : 'update'
      const job = this.jobs.create(initialOperation, packageName)
      const spec = 'github:' + details.repo + '#' + details.resolvedRef
      let resolvePrepared!: (operation: 'install' | 'update') => void
      let rejectPrepared!: (error: unknown) => void
      let preparedSettled = false
      const prepared = new Promise<'install' | 'update'>((resolve, reject) => {
        resolvePrepared = resolve
        rejectPrepared = reject
      })
      this.enqueueMutation(async () => {
        this.jobs.phase(job, 'spawning')
        try {
          await withProfileMutationLock(profile.dir, async () => {
            // The Profile may have changed in another DSH process while this
            // request was resolving GitHub or waiting for the file lock.
            const before = readProfileManifest(NAME, profile.dir)
            const operation = before.dependencies?.[packageName] === undefined ? 'install' : 'update'
            job.kind = operation
            const existingCustomTarget = operation === 'update'
              ? managedInstalledPluginTarget(profile, packageName, before)
              : null
            const target = operation === 'install' && profile.custom
              ? pluginTarget(profile, packageName)
              : existingCustomTarget ?? profilePackagePath(profile.dir, packageName)
            if (operation === 'install' && existsSync(target)) {
              throw new MarketplaceOperationError(
                'plugin-dir-exists',
                'Install blocked: target directory already exists: ' + target,
                { target },
              )
            }
            if (operation === 'install') {
              const conflict = this.installConflict(details, before, profile.dir)
              if (conflict !== null) {
                throw new MarketplaceOperationError(
                  conflict.error.code,
                  conflict.error.message,
                  conflict.error.details,
                )
              }
            }
            const beforeDeclaresBundle = operation === 'update' ? exportsPatch(packageName, profile.dir) : false
            preparedSettled = true
            resolvePrepared(operation)
            await this.driveInstall(
              job,
              profile,
              spec,
              before,
              beforeDeclaresBundle,
              true,
              operation === 'install' ? (profile.custom ? target : null) : existingCustomTarget,
            )
          })
        } catch (error) {
          if (!preparedSettled) {
            preparedSettled = true
            rejectPrepared(error)
          }
          this.failPreparedJob(job, error)
        }
      })
      const operation = await prepared
      return ok({
        jobId: job.jobId,
        operation,
        packageName,
        repository: details.repo,
        verifiedCommit: details.resolvedRef,
      })
    } catch (error) {
      return toFailure(error)
    } finally {
      this.pendingInstallResolution -= 1
    }
  }

  @Remote('update')
  async update(request: MarketplaceInstallRequest): Promise<MarketplaceResult<{ jobId: string }>> {
    return this.startJob('update', request.repo, request.ref ?? '')
  }

  @Remote('updateBatch')
  async updateBatch(request: MarketplaceBatchUpdateRequest): Promise<MarketplaceResult<MarketplaceBatchUpdateResult>> {
    const unique = new Map<string, { repo: string; ref: string }>()
    for (const update of request.updates) {
      const repo = update.repo.trim()
      if (repo !== '') unique.set(repo.toLocaleLowerCase(), { repo, ref: update.ref ?? '' })
    }
    if (unique.size === 0) return fail('empty-batch', 'Choose at least one plugin to update.')
    const outcomes = await Promise.all([...unique.values()].map(async (update) => ({
      repo: update.repo,
      result: await this.startJob('update', update.repo, update.ref),
    })))
    return ok({
      jobs: outcomes.flatMap(({ result }) => result.ok
        ? [{ jobId: result.value.jobId, packageName: this.jobs.get(result.value.jobId)?.packageName ?? 'unknown' }]
        : []),
      failures: outcomes.flatMap(({ repo, result }) => result.ok ? [] : [{ repo, message: result.error.message }]),
    })
  }

  @Remote('uninstall')
  async uninstall(request: MarketplaceUninstallRequest): Promise<MarketplaceResult<{ jobId: string }>> {
    return this.startUninstallJob(request.packageName)
  }

  @Remote('uninstallBatch')
  async uninstallBatch(request: MarketplaceBatchPackageRequest): Promise<MarketplaceResult<MarketplaceBatchUninstallResult>> {
    const packageNames = uniquePackageNames(request.packageNames)
    if (packageNames.length === 0) return fail('empty-batch', 'Choose at least one plugin to uninstall.')
    const outcomes = packageNames.map(packageName => ({ packageName, result: this.startUninstallJob(packageName) }))
    return ok({
      jobs: outcomes.flatMap(({ result }) => result.ok
        ? [{ jobId: result.value.jobId, packageName: this.jobs.get(result.value.jobId)?.packageName ?? 'unknown' }]
        : []),
      failures: outcomes.flatMap(({ packageName, result }) => result.ok ? [] : [{ packageName, message: result.error.message }]),
    })
  }

  @Remote('setEnabled')
  async setEnabled(request: MarketplaceToggleRequest): Promise<MarketplaceResult<MarketplaceToggleResult>> {
    const result = await this.setEnabledBatch({ packageNames: [request.packageName], enabled: request.enabled })
    if (!result.ok) return result
    const first = result.value.results[0]
    if (first !== undefined) return ok(first)
    const failure = result.value.failures[0]
    return fail('not-a-dsh-plugin', failure?.message ?? request.packageName + ' is not an installed DSH bundle.')
  }

  @Remote('setEnabledBatch')
  async setEnabledBatch(request: MarketplaceBatchToggleRequest): Promise<MarketplaceResult<MarketplaceBatchToggleResult>> {
    try {
      if (this.restartPending) {
        return fail('restart-pending', 'DSH is already preparing to restart.')
      }
      if (this.profileMutationBusy()) {
        return fail('job-running', 'Another Profile plugin operation is already in progress.')
      }
      const profile = installLocation(this.ctx, this.config)
      ensureProfile(profile.dir, profile.name)
      const packageNames = uniquePackageNames(request.packageNames)
      if (packageNames.length === 0) return fail('empty-batch', 'Choose at least one plugin to change.')
      return await withProfileMutationLock(profile.dir, async () => {
        const manifest = readProfileManifest(NAME, profile.dir)
        const failures: Array<{ packageName: string; message: string }> = []
        const accepted = packageNames.filter((packageName) => {
          if (!validPackageName(packageName) || manifest.dependencies?.[packageName] === undefined || !exportsPatch(packageName, profile.dir)) {
            failures.push({ packageName, message: packageName + ' is not an installed DSH bundle in profile ' + profile.name + '.' })
            return false
          }
          return true
        })
        if (accepted.length === 0) return ok({ results: [], failures, requiresRestart: false })
        let bundles = manifest.dsh?.profile?.bundles ?? []
        for (const packageName of accepted) bundles = toggleBundleName(bundles, packageName, request.enabled)
        if (request.enabled) {
          const beforeKeys = new Set(computeConflicts(manifest, profile.dir).map(conflictIdentity))
          const prospective = {
            ...manifest,
            dsh: { ...manifest.dsh, profile: { ...manifest.dsh?.profile, bundles } },
          }
          const introduced = computeConflicts(prospective, profile.dir)
            .find(conflict => !beforeKeys.has(conflictIdentity(conflict)))
          if (introduced !== undefined) {
            const subject = introduced.kind === 'service'
              ? "service '" + introduced.service + "'"
              : "bundle id '" + introduced.id + "'"
            return fail(
              'plugin-conflict',
              'Enable blocked: ' + subject + ' conflicts with ' + introduced.packages.join(', ') + '. DSH was left unchanged.',
              introduced,
            )
          }
        }
        writeProfileManifest(profile.dir, {
          ...manifest,
          dsh: { ...manifest.dsh, profile: { ...manifest.dsh?.profile, bundles } },
        })
        return ok({
          results: accepted.map(packageName => ({ packageName, enabled: request.enabled, requiresRestart: true })),
          failures,
          requiresRestart: true,
        })
      })
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('jobStatus')
  async jobStatus(request: MarketplaceJobStatusRequest): Promise<MarketplaceResult<MarketplaceJobStatus>> {
    const job = this.jobs.get(request.jobId)
    if (job === undefined) {
      return fail('job-missing', 'Unknown job: ' + request.jobId)
    }
    return ok(this.jobs.snapshot(job))
  }

  @Remote('jobs')
  async listJobs(): Promise<MarketplaceResult<MarketplaceJobStatus[]>> {
    return ok(this.jobs.list())
  }

  @Remote('installed')
  async installed(request: MarketplaceInstalledRequest): Promise<MarketplaceResult<MarketplaceInstalled>> {
    try {
      if (request.refresh) await this.registry.refresh()
      const profile = installLocation(this.ctx, this.config)
      const manifest = readProfileManifest(NAME, profile.dir)
      const entries = installedEntries(manifest, profile.dir, profile.pluginDir, profile.custom)
      const hasSelf = entries.some(entry => entry.packageName === SELF_PACKAGE)
      const liveSelfPromise: Promise<SelfUpdateTarget | undefined> = shouldRefreshSelfUpdate(request.refresh, hasSelf)
        ? this.liveSelfUpdate(true).then(({ target }) => target, () => undefined)
        : Promise.resolve(hasSelf ? this.selfUpdateCache?.target : undefined)
      const [registeredPackages, liveSelf] = await Promise.all([
        this.registry.findByPackages(entries.map(entry => entry.packageName)),
        liveSelfPromise,
      ])
      for (const entry of entries) {
        if (entry.packageName === SELF_PACKAGE && liveSelf !== undefined) {
          Object.assign(entry, applySelfUpdate(entry, liveSelf, profile.name))
          continue
        }
        const registered = registeredPackages.get(entry.packageName)
        if (registered === undefined) continue
        entry.registryRepo = registered.fullName
        entry.description = registered.description?.trim() ? registered.description : (entry.description ?? null)
        entry.repositoryUrl = registered.htmlUrl
        entry.verifiedCommit = registered.verifiedCommit
        entry.install = registered.install
        if (!entry.linked) {
          entry.updateAvailable = false
          entry.canUpdate = false
          continue
        }
        const versionOrder = compareSemver(registered.version, entry.version)
        entry.updateAvailable = versionOrder > 0
          || (versionOrder === 0
            && registered.install.source === 'github'
            && /^(?:github:|git\+https:\/\/github\.com\/|https:\/\/(?:github\.com|codeload\.github\.com)\/)/i.test(entry.currentSpec)
            && !entry.currentSpec.toLocaleLowerCase().includes(registered.verifiedCommit.toLocaleLowerCase()))
        entry.availableVersion = versionOrder > 0 ? registered.version : null
        entry.availableVersionSource = versionOrder > 0 ? 'registry' : null
        entry.canUpdate = registered.install.mode === 'automatic'
          && (registered.install.source === 'github' || registered.install.source === 'npm')
          && registered.install.profiles.includes(profile.name)
          && registered.install.spec !== ''
      }
      let conflicts: MarketplaceConflict[] = []
      try {
        conflicts = computeConflicts(manifest, profile.dir)
      } catch {
        // Diagnosis must never take the whole listing down.
      }
      return ok({
        profile: profile.name,
        installDir: profile.pluginDir,
        installDirCustom: profile.custom,
        entries,
        conflicts,
      })
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('installLocation')
  async installLocation(): Promise<MarketplaceResult<MarketplaceInstallLocation>> {
    try {
      const profile = installLocation(this.ctx, this.config)
      ensureProfile(profile.dir, profile.name)
      const manifest = readProfileManifest(NAME, profile.dir)
      return ok({
        profile: profile.name,
        packageNames: Object.keys(manifest.dependencies ?? {}),
        installDir: profile.pluginDir,
        installDirCustom: profile.custom,
      })
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('setInstallDir')
  async setInstallDir(request: { installDir: string }): Promise<MarketplaceResult<MarketplaceInstallLocation>> {
    try {
      if (this.restartPending) {
        return fail('restart-pending', 'DSH is already preparing to restart.')
      }
      if (this.profileMutationBusy()) {
        return fail('job-running', 'Another Profile plugin operation is already in progress.')
      }
      const value = typeof request.installDir === 'string' ? request.installDir.trim() : ''
      const profile = profileLocation(this.ctx)
      ensureProfile(profile.dir, profile.name)
      const location = persistInstallLocation(profile.dir, value)
      const manifest = readProfileManifest(NAME, profile.dir)
      return ok({ profile: profile.name, packageNames: Object.keys(manifest.dependencies ?? {}), ...location })
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('agentWorkspace')
  async agentWorkspace(): Promise<MarketplaceResult<MarketplaceAgentWorkspace>> {
    try {
      return ok(agentWorkspaceLocation())
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('setAgentWorkspaceDir')
  async setAgentWorkspaceDir(request: { workspaceDir: string }): Promise<MarketplaceResult<MarketplaceAgentWorkspace>> {
    try {
      if (this.restartPending) return fail('restart-pending', 'DSH is already preparing to restart.')
      const value = typeof request.workspaceDir === 'string' ? request.workspaceDir.trim() : ''
      return ok(persistAgentWorkspace(value))
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('diagnoseConflicts')
  async diagnoseConflicts(): Promise<MarketplaceResult<MarketplaceDiagnoseConflictsResult>> {
    try {
      const profile = installLocation(this.ctx, this.config)
      const manifest = readProfileManifest(NAME, profile.dir)
      return ok({ conflicts: computeConflicts(manifest, profile.dir), scannedAt: Date.now() })
    } catch (error) {
      return toFailure(error)
    }
  }

  @Remote('restart')
  async restart(): Promise<MarketplaceResult<MarketplaceRestartResult>> {
    try {
      if (this.restartPending) {
        return fail('restart-pending', 'DSH is already preparing to restart.')
      }
      if (this.pendingInstallResolution > 0 || this.jobs.hasActive()) {
        return fail('job-running', 'Wait for all plugin install, update, or uninstall jobs to finish before restarting DSH.')
      }
      const profile = profileLocation(this.ctx)
      this.restartPending = true
      try {
        await scheduleProcessRestart()
      } catch (error) {
        this.restartPending = false
        throw error
      }
      return ok({ accepted: true, profile: profile.name })
    } catch (error) {
      return toFailure(error)
    }
  }

  /** Pre-install conflict check against enabled bundles. Returns a fail() result, or null. */
  private installConflict(details: MarketplacePluginDetails, before: ProfileManifest, dir: string): Err | null {
    const bundles = before.dsh?.profile?.bundles ?? []
    const candidateIds = new Set(extractPatchRows(details.patch ?? '').map(row => row.id).filter(id => id !== ''))
    const existingIds = new Set<string>()
    const serviceOwners = new Map<string, string[]>()
    for (const bundle of bundles) {
      const patchPath = packagePatchPath(bundle, dir)
      if (patchPath === null) continue
      for (const row of extractPatchRows(readSourceText(patchPath))) {
        existingIds.add(row.id)
        const pkg = row.name !== '' ? row.name : bundle
        const entryPath = packageEntryPath(pkg, dir)
        if (entryPath === null) continue
        for (const service of extractServiceNames(readSourceText(entryPath))) {
          const list = serviceOwners.get(service) ?? []
          list.push(pkg)
          serviceOwners.set(service, list)
        }
      }
    }
    for (const id of candidateIds) {
      if (existingIds.has(id)) {
        return fail('plugin-conflict', "Install blocked: bundle id '" + id + "' is already registered by an enabled plugin. Disable the conflicting plugin first.", { kind: 'duplicate-id', id })
      }
    }
    for (const service of extractServiceNames(details.entrySource ?? '')) {
      const owners = serviceOwners.get(service)
      if (owners !== undefined && owners.length > 0) {
        return fail('plugin-conflict', "Install blocked: service '" + service + "' is already provided by " + [...new Set(owners)].join(', ') + '. Enabling both plugins would crash DSH at startup.', { kind: 'service', service, packages: [...new Set(owners)] })
      }
    }
    return null
  }

  /** 接受任务后立即返回；GitHub 校验与 Profile 写入在后台队列中继续。 */
  private async startJob(
    kind: 'install' | 'update',
    repo: string,
    ref: string,
  ): Promise<MarketplaceResult<{ jobId: string }>> {
    if (this.restartPending) {
      return fail('restart-pending', 'DSH is already preparing to restart.')
    }
    this.pendingInstallResolution += 1
    try {
      const directSelfUpdate = kind === 'update'
        && repo.trim().toLocaleLowerCase() === SELF_REPOSITORY.toLocaleLowerCase()
      const registered = directSelfUpdate ? undefined : await this.registry.find(repo)
      if (!directSelfUpdate && registered === undefined) {
        return fail('not-in-registry', repo + ' is not present in the verified DSH plugin Registry.')
      }
      if (!directSelfUpdate && ref !== '' && ref.toLocaleLowerCase() !== registered!.verifiedCommit.toLocaleLowerCase()) {
        return fail('unverified-ref', 'The requested ref is not the commit approved by the DSH plugin Registry.', {
          requestedRef: ref,
          verifiedCommit: registered!.verifiedCommit,
        })
      }
      const packageName = directSelfUpdate ? SELF_PACKAGE : registered!.packageName
      if (this.jobs.atCapacity()) return fail('queue-full', 'The plugin operation queue already contains 50 active jobs.')
      if (this.jobs.hasActivePackage(packageName)) {
        return fail('job-duplicate', packageName + ' already has an active plugin operation.')
      }
      const job = this.jobs.create(kind, packageName, this.jobs.hasActive() ? 'queued' : 'spawning')
      const source: Promise<InstallSource> = directSelfUpdate
        ? this.liveSelfUpdate(true).then(({ target, details }) => ({ registered: target, details }))
        : this.github.details(registered!.fullName, registered!.verifiedCommit)
          .then(details => ({ registered: registered!, details }))
      void source.catch(() => undefined)
      this.enqueueMutation(async () => {
        this.jobs.phase(job, 'spawning')
        try {
          await this.runInstallJob(job, kind, await source)
        } catch (error) {
          this.failPreparedJob(job, error)
        }
      })
      return ok({ jobId: job.jobId })
    } catch (error) {
      return toFailure(error)
    } finally {
      this.pendingInstallResolution -= 1
    }
  }

  private async runInstallJob(job: JobRecord, kind: 'install' | 'update', source: InstallSource): Promise<void> {
    const { registered, details } = source
    const manifest = details.manifest
    if (manifest === null || manifest.bundlePatch === null || details.patch === null) {
      throw new Error(details.repo + ' no longer provides the Registry-verified DSH bundle files.')
    }
    if (manifest.name !== registered.packageName || manifest.bundlePatch !== registered.bundlePatch) {
      throw new Error(details.repo + ' no longer matches its verified Registry identity.')
    }
    const packageName = manifest.name
    const profile = installLocation(this.ctx, this.config)
    ensureProfile(profile.dir, profile.name)
    await withProfileMutationLock(profile.dir, async () => {
      if (registered.install.mode !== 'automatic'
        || !registered.install.profiles.includes(profile.name)
        || registered.install.spec === '') {
        throw new Error("This plugin needs its author's guided installation steps.")
      }
      const before = readProfileManifest(NAME, profile.dir)
      if (kind === 'install' && before.dependencies?.[packageName] !== undefined) {
        throw new Error(packageName + ' is already installed — use Update instead.')
      }
      if (kind === 'update' && before.dependencies?.[packageName] === undefined) {
        throw new Error(packageName + ' is not installed in profile ' + profile.name + '.')
      }
      const beforeDeclaresBundle = exportsPatch(packageName, profile.dir)
      const existingCustomTarget = kind === 'update'
        ? managedInstalledPluginTarget(profile, packageName, before)
        : null
      const customTarget = kind === 'install' && profile.custom
        ? pluginTarget(profile, packageName)
        : existingCustomTarget
      const target = customTarget ?? profilePackagePath(profile.dir, packageName)
      if (kind === 'install' && existsSync(target)) {
        throw new Error('Install blocked: target directory already exists: ' + target)
      }
      if (kind === 'update' && existsSync(target)) {
        let targetManifest: { name?: unknown }
        try {
          targetManifest = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8')) as { name?: unknown }
        } catch (error) {
          throw new Error('Update blocked: cannot validate existing plugin directory ' + target + '.', { cause: error })
        }
        if (targetManifest.name !== packageName) {
          throw new Error('Update blocked: ' + target + ' belongs to ' + String(targetManifest.name ?? 'another package') + '.')
        }
      }
      if (kind === 'install') {
        const conflict = this.installConflict(details, before, profile.dir)
        if (conflict !== null) throw new Error(conflict.error.message)
      }
      await this.driveInstall(
        job,
        profile,
        executableSpec(registered),
        before,
        beforeDeclaresBundle,
        registered.install.requiresRestart,
        customTarget,
      )
    })
  }

  private startUninstallJob(rawPackageName: string): MarketplaceResult<{ jobId: string }> {
    if (this.restartPending) return fail('restart-pending', 'DSH is already preparing to restart.')
    const packageName = rawPackageName.trim()
    if (!validPackageName(packageName)) return fail('bad-package', 'Malformed package name: ' + rawPackageName)
    if (this.jobs.atCapacity()) return fail('queue-full', 'The plugin operation queue already contains 50 active jobs.')
    if (this.jobs.hasActivePackage(packageName)) {
      return fail('job-duplicate', packageName + ' already has an active plugin operation.')
    }
    const job = this.jobs.create('uninstall', packageName, this.jobs.hasActive() ? 'queued' : 'spawning')
    this.enqueueMutation(async () => {
      this.jobs.phase(job, 'spawning')
      try {
        const profile = installLocation(this.ctx, this.config)
        ensureProfile(profile.dir, profile.name)
        await withProfileMutationLock(profile.dir, async () => {
          const before = readProfileManifest(NAME, profile.dir)
          if (before.dependencies?.[packageName] === undefined) {
            throw new Error(packageName + ' is not installed in profile ' + profile.name + '.')
          }
          await this.driveUninstall(job, profile, before, exportsPatch(packageName, profile.dir))
        })
      } catch (error) {
        this.failPreparedJob(job, error)
      }
    })
    return ok({ jobId: job.jobId })
  }

  private failPreparedJob(job: JobRecord, error: unknown): void {
    if (job.finishedAt !== null) return
    const failure = toFailure(error).error
    this.jobs.append(job, 'Operation preparation failed: ' + failure.message + '\n')
    this.jobs.fail(job, { code: failure.code, message: failure.message })
  }

  private profileMutationBusy(): boolean {
    return this.pendingInstallResolution > 0 || this.jobs.hasActive()
  }

  private enqueueMutation(work: () => Promise<void>): void {
    this.mutationQueue.enqueue(work)
  }

  /** Read main/package.json directly, then freeze the update to its resolved commit. */
  private async liveSelfUpdate(force = false): Promise<{ details: MarketplacePluginDetails; target: SelfUpdateTarget }> {
    if (!force && this.selfUpdateCache !== undefined && Date.now() < this.selfUpdateCache.expiresAt) {
      return this.selfUpdateCache
    }
    const details = await this.github.details(SELF_REPOSITORY, SELF_BRANCH)
    const target = selfUpdateTarget(details)
    const cached = { details, target, expiresAt: Date.now() + 5 * 60_000 }
    this.selfUpdateCache = cached
    return cached
  }

  /** Custom-directory install: staging download → conflict check → copy → link. */
  private async driveInstall(
    job: JobRecord,
    profile: ProfileInstallLocation,
    spec: string,
    before: ProfileManifest,
    beforeDeclaresBundle: boolean,
    requiresRestart = true,
    customTarget: string | null = null,
  ): Promise<void> {
    if (customTarget === null) {
      await this.driveProfileInstall(job, profile, spec, before, beforeDeclaresBundle, requiresRestart)
      return
    }
    const stageDir = join(dirname(marketplaceSettingsPath()), 'staging', job.jobId)
    const target = customTarget
    const backup = target + '.marketplace-backup-' + job.jobId
    let targetWritten = false
    let backupCreated = false
    let manifestWritten = false
    let profilePackageState: { linkPath: string; backupPath: string; backupCreated: boolean } | null = null
    try {
      this.jobs.phase(job, 'running')
      mkdirSync(stageDir, { recursive: true })
      writeFileSync(join(stageDir, 'package.json'), JSON.stringify({ private: true }, null, 2) + '\n', 'utf8')
      let code = await runPnpmJob(job, ['add', spec, '--ignore-scripts', '--config.auto-install-peers=false'], stageDir, this.jobs, profile.storeDir)
      if (code !== 0) throw new Error(code === null ? 'pnpm could not be spawned — is pnpm on PATH?' : 'Plugin download failed: pnpm exited with code ' + String(code) + '.')
      const stagedManifest = packageManifestPath(job.packageName, stageDir)
      if (stagedManifest === null) throw new Error('Downloaded package ' + job.packageName + ' could not be found in staging.')
      const conflict = stagedInstallConflict(job.packageName, stageDir, before, profile.dir)
      if (conflict !== null) throw new Error(conflict.message)
      mkdirSync(dirname(target), { recursive: true })
      if (existsSync(target)) {
        renameSync(target, backup)
        backupCreated = true
      }
      cpSync(dirname(stagedManifest), target, {
        recursive: true,
        dereference: true,
        filter: (source) => basename(source) !== 'node_modules',
      })
      targetWritten = true
      const copiedManifest = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8')) as { name?: unknown }
      if (copiedManifest.name !== job.packageName) throw new Error('Downloaded package identity mismatch: expected ' + job.packageName + '.')
      this.jobs.append(job, 'Installing dependencies inside the plugin directory.\n')
      code = await runPnpmJob(job, [
        'install',
        '--prod',
        '--ignore-scripts',
        '--config.auto-install-peers=false',
      ], target, this.jobs, profile.storeDir)
      if (code !== 0) throw new Error(code === null ? 'pnpm could not be spawned — is pnpm on PATH?' : 'Plugin dependency install failed: pnpm exited with code ' + String(code) + '.')
      const linkedPeers = linkProfilePeerDependencies(target, profile.dir)
      if (linkedPeers.length > 0) this.jobs.append(job, 'Linked DSH host dependencies: ' + linkedPeers.join(', ') + '\n')
      writeProfileDependency(job.packageName, localDependencySpec(profile.dir, target), profile.dir)
      manifestWritten = true
      code = await runProfilePnpmJob(job, ['install', '--lockfile-only', '--ignore-scripts'], profile.dir, this.jobs, profile.storeDir)
      if (code !== 0) throw new Error(code === null ? 'pnpm could not be spawned — is pnpm on PATH?' : 'Profile lockfile update failed: pnpm exited with code ' + String(code) + '.')
      profilePackageState = createProfilePackageLink(profile.dir, job.packageName, target, job.jobId)
      this.jobs.phase(job, 'reconciling')
      reconcileBundle(before, beforeDeclaresBundle, job.packageName, profile.dir)
      const version = installedVersion(job.packageName, profile.dir) ?? 'unknown'
      this.jobs.settle(job, { packageName: job.packageName, version, requiresRestart })
      if (backupCreated) this.cleanupPackagePath(job, backup)
      if (profilePackageState.backupCreated) this.cleanupPackagePath(job, profilePackageState.backupPath)
    } catch (error) {
      if (profilePackageState !== null) {
        removePackagePath(profilePackageState.linkPath)
        if (profilePackageState.backupCreated && existsSync(profilePackageState.backupPath)) {
          renameSync(profilePackageState.backupPath, profilePackageState.linkPath)
        }
      }
      if (targetWritten) rmSync(target, { recursive: true, force: true })
      if (backupCreated && existsSync(backup)) renameSync(backup, target)
      if (manifestWritten) await this.rollbackProfileDependency(job, profile, before, true)
      this.jobs.fail(job, {
        code: 'install-failed',
        message: error instanceof Error ? error.message : String(error),
      })
    } finally {
      this.cleanupPackagePath(job, stageDir)
    }
  }

  /** Default mode: pnpm manages the Profile directly, with rollback. */
  private async driveProfileInstall(
    job: JobRecord,
    profile: ProfileInstallLocation,
    spec: string,
    before: ProfileManifest,
    beforeDeclaresBundle: boolean,
    requiresRestart = true,
  ): Promise<void> {
    const stageDir = join(dirname(marketplaceSettingsPath()), 'staging', job.jobId)
    let profileAttempted = false
    try {
      this.jobs.phase(job, 'running')
      mkdirSync(stageDir, { recursive: true })
      writeFileSync(join(stageDir, 'package.json'), JSON.stringify({ private: true }, null, 2) + '\n', 'utf8')
      let code = await runPnpmJob(job, ['add', spec, '--ignore-scripts', '--config.auto-install-peers=false'], stageDir, this.jobs, profile.storeDir)
      if (code !== 0) throw new Error(code === null ? 'pnpm could not be spawned — is pnpm on PATH?' : 'Plugin download failed: pnpm exited with code ' + String(code) + '.')
      const stagedManifest = packageManifestPath(job.packageName, stageDir)
      if (stagedManifest === null) throw new Error('Downloaded package ' + job.packageName + ' could not be found in staging.')
      const conflict = stagedInstallConflict(job.packageName, stageDir, before, profile.dir)
      if (conflict !== null) throw new Error(conflict.message)
      profileAttempted = true
      code = await runProfilePnpmJob(job, ['add', spec, '--ignore-scripts', '--config.auto-install-peers=false'], profile.dir, this.jobs, profile.storeDir)
      if (code !== 0) throw new Error(code === null ? 'pnpm could not be spawned — is pnpm on PATH?' : 'Profile install failed: pnpm exited with code ' + String(code) + '.')
      this.jobs.phase(job, 'reconciling')
      reconcileBundle(before, beforeDeclaresBundle, job.packageName, profile.dir)
      const version = installedVersion(job.packageName, profile.dir) ?? 'unknown'
      this.jobs.settle(job, { packageName: job.packageName, version, requiresRestart })
    } catch (error) {
      if (profileAttempted) {
        await this.rollbackProfileDependency(job, profile, before, false)
      }
      this.jobs.fail(job, {
        code: 'install-failed',
        message: error instanceof Error ? error.message : String(error),
      })
    } finally {
      this.cleanupPackagePath(job, stageDir)
    }
  }

  /** Custom-directory uninstall: remove the Profile link, then the managed entity. */
  private async driveUninstall(
    job: JobRecord,
    profile: ProfileInstallLocation,
    before: ProfileManifest,
    beforeDeclaresBundle: boolean,
    requiresRestart = true,
  ): Promise<void> {
    const target = managedInstalledPluginTarget(profile, job.packageName, before)
    if (target === null) {
      await this.driveProfileUninstall(job, profile, before, beforeDeclaresBundle, requiresRestart)
      return
    }
    let manifestWritten = false
    try {
      this.jobs.phase(job, 'running')
      writeProfileDependency(job.packageName, undefined, profile.dir)
      manifestWritten = true
      const code = await runProfilePnpmJob(job, ['install', '--lockfile-only', '--ignore-scripts'], profile.dir, this.jobs, profile.storeDir)
      if (code !== 0) throw new Error(code === null ? 'pnpm could not be spawned — is pnpm on PATH?' : 'Profile unlink failed: pnpm exited with code ' + String(code) + '.')
      this.jobs.phase(job, 'reconciling')
      reconcileBundle(before, beforeDeclaresBundle, job.packageName, profile.dir)
      // Profile 已解除关联；清理失败不能重新关联可能已被部分删除的插件实体。
      this.cleanupPackagePath(job, profilePackagePath(profile.dir, job.packageName))
      this.cleanupPackagePath(job, target)
      this.jobs.settle(job, { packageName: job.packageName, version: 'removed', requiresRestart })
    } catch (error) {
      if (manifestWritten) {
        await this.rollbackProfileDependency(job, profile, before, true)
      }
      this.jobs.fail(job, {
        code: 'uninstall-failed',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /** 已提交操作的文件清理失败只记录残留位置，不触发安装状态回滚。 */
  private cleanupPackagePath(job: JobRecord, path: string): void {
    try {
      removePackagePath(path)
    } catch (error) {
      this.jobs.append(job, 'Warning: cleanup did not complete for ' + path
        + '; retry removing this path after DSH restarts: '
        + (error instanceof Error ? error.message : String(error)) + '\n')
    }
  }

  /** Default mode: pnpm remove, with manifest + lockfile rollback. */
  private async driveProfileUninstall(
    job: JobRecord,
    profile: ProfileInstallLocation,
    before: ProfileManifest,
    beforeDeclaresBundle: boolean,
    requiresRestart = true,
  ): Promise<void> {
    try {
      this.jobs.phase(job, 'running')
      const code = await runProfilePnpmJob(job, ['remove', job.packageName], profile.dir, this.jobs, profile.storeDir)
      if (code !== 0) throw new Error(code === null ? 'pnpm could not be spawned — is pnpm on PATH?' : 'Profile uninstall failed: pnpm exited with code ' + String(code) + '.')
      this.jobs.phase(job, 'reconciling')
      reconcileBundle(before, beforeDeclaresBundle, job.packageName, profile.dir)
      this.jobs.settle(job, { packageName: job.packageName, version: 'removed', requiresRestart })
    } catch (error) {
      await this.rollbackProfileDependency(job, profile, before, false)
      this.jobs.fail(job, {
        code: 'uninstall-failed',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /** Restore only the target dependency, preserving newer unrelated Profile edits. */
  private async rollbackProfileDependency(
    job: JobRecord,
    profile: ProfileInstallLocation,
    before: ProfileManifest,
    lockfileOnly: boolean,
  ): Promise<void> {
    this.jobs.append(job, 'Rolling back the Profile dependency state.\n')
    try {
      writeProfileDependency(job.packageName, before.dependencies?.[job.packageName], profile.dir)
    } catch (error) {
      this.jobs.append(job, 'Warning: the Profile manifest rollback did not complete: ' + (error instanceof Error ? error.message : String(error)) + '\n')
      return
    }
    const args = lockfileOnly
      ? ['install', '--lockfile-only', '--ignore-scripts']
      : ['install', '--ignore-scripts']
    const rollbackCode = await runProfilePnpmJob(job, args, profile.dir, this.jobs, profile.storeDir)
    if (rollbackCode !== 0) this.jobs.append(job, 'Warning: automatic Profile rollback did not complete.\n')
  }
}

function executableSpec(plugin: MarketplaceRegistryPlugin | SelfUpdateTarget): string {
  if (plugin.install.source === 'github') {
    const expected = 'github:' + plugin.fullName + '#' + plugin.verifiedCommit
    if (plugin.install.spec.toLocaleLowerCase() !== expected.toLocaleLowerCase()) {
      throw new RegistryError('Registry GitHub install spec does not match the verified repository commit.', {
        repository: plugin.fullName,
      })
    }
    return githubArchiveSpec(plugin.fullName, plugin.verifiedCommit)
  }
  if (plugin.install.source === 'npm') {
    const expected = plugin.packageName + '@' + plugin.version
    if (plugin.install.spec !== expected) {
      throw new RegistryError('Registry npm install spec does not match the verified package version.', {
        repository: plugin.fullName,
      })
    }
    return expected
  }
  throw new RegistryError('Only Registry entries pinned to an exact GitHub commit or verified npm release can be installed automatically.')
}

function validPackageName(value: string): boolean {
  return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(value)
}

function uniquePackageNames(values: string[]): string[] {
  const unique = new Map<string, string>()
  for (const value of values) {
    const packageName = value.trim()
    if (packageName !== '') unique.set(packageName.toLocaleLowerCase(), packageName)
  }
  return [...unique.values()]
}

export default MarketplaceService
