/** Pure validation helpers shared by the Registry scanner and its tests. */

import { parseDocument } from 'yaml'

export const MAX_MANIFEST_BYTES = 256 * 1024
export const MAX_PATCH_BYTES = 64 * 1024
export const MAX_README_BYTES = 256 * 1024
export const INSTALL_CLASSIFIER_VERSION = 11
export const DSH_STD_PROFILE_VERSION = 'tui-admission/0.15'

const DSH_STD_COORDINATES = new Set([
  'commands.dsh/v1alpha1#Command',
  'storage.dsh/v1alpha1#LocalStorage',
  'messages.dsh/v1alpha1#MessageObserver',
  'presentation.dsh/v1alpha1#OpenExternal',
  'presentation.dsh/v1alpha1#UserInteraction',
  'presentation.dsh/v1alpha1#ExternalRedirect',
  'tui.dsh/v1alpha1#DecisionEvents',
  'tui.dsh/v1alpha1#Channel',
])

const DSH_STD_PERMISSION_DEFAULTS = new Map([
  ['commands.invoke', 'allow'],
  ['storage.local.read', 'deny'],
  ['storage.local.write', 'deny'],
  ['messages.observe.read', 'deny'],
  ['session.input.intercept', 'deny'],
  ['session.rewind.intercept', 'deny'],
  ['session.switch.intercept', 'deny'],
  ['session.compact.intercept', 'deny'],
])

const DSH_STD_PERMISSION_CAPABILITIES = new Map([
  ['commands.invoke', 'commands.dsh/v1alpha1#Command'],
  ['storage.local.read', 'storage.dsh/v1alpha1#LocalStorage'],
  ['storage.local.write', 'storage.dsh/v1alpha1#LocalStorage'],
  ['messages.observe.read', 'messages.dsh/v1alpha1#MessageObserver'],
  ['session.input.intercept', 'tui.dsh/v1alpha1#DecisionEvents'],
  ['session.rewind.intercept', 'tui.dsh/v1alpha1#DecisionEvents'],
  ['session.switch.intercept', 'tui.dsh/v1alpha1#DecisionEvents'],
  ['session.compact.intercept', 'tui.dsh/v1alpha1#DecisionEvents'],
])

const DSH_STD_INTERCEPT_SCOPES = new Map([
  ['session.input.intercept', 'tui/input'],
  ['session.rewind.intercept', 'tui/rewind-prompt'],
  ['session.switch.intercept', 'tui/session-switch'],
  ['session.compact.intercept', 'tui/compact'],
])

const DSH_STD_SUBSCRIPTIONS = new Set([
  'messages.observe',
  'messages.dsh/v1alpha1#MessageObserver',
])

/** Candidate is structurally not a DSH bundle. */
export class InvalidCandidateError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidCandidateError'
  }
}

/** Network or service failure that must be retried instead of rejecting a repository. */
export class RetryCandidateError extends Error {
  constructor(message) {
    super(message)
    this.name = 'RetryCandidateError'
  }
}

/** A bundle patch path must stay inside the repository root. */
export function safePatchPath(value) {
  return typeof value === 'string'
    && value.length > 0
    && value.length <= 240
    && !value.startsWith('/')
    && !value.includes('\\')
    && !value.includes('\0')
    && !value.split('/').includes('..')
    && !/^[a-z][a-z\d+.-]*:/i.test(value)
}

/** Validate package metadata and return the Registry identity fields. */
export function validateManifest(text) {
  let value
  try {
    value = JSON.parse(text)
  } catch {
    throw new InvalidCandidateError('package.json is not valid JSON')
  }
  if (!plainObject(value)) throw new InvalidCandidateError('package.json must contain an object')
  const name = value.name
  if (typeof name !== 'string' || !/^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/.test(name)) {
    throw new InvalidCandidateError('package.json has no valid lowercase npm package name')
  }
  const version = value.version
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new InvalidCandidateError('package.json has no valid semantic version')
  }
  const dsh = value.dsh
  if (!plainObject(dsh) || !plainObject(dsh.bundle) || !safePatchPath(dsh.bundle.patch)) {
    throw new InvalidCandidateError('package.json does not declare a safe dsh.bundle.patch')
  }
  const client = dsh.client
  if (client !== undefined) {
    if (!plainObject(client) || client.platform !== 'web') {
      throw new InvalidCandidateError('dsh.client must declare platform "web"')
    }
    if (!plainObject(value.exports) || value.exports['./client'] === undefined) {
      throw new InvalidCandidateError('dsh.client requires a ./client package export')
    }
  }
  const lifecycleScripts = plainObject(value.scripts)
    ? ['preinstall', 'install', 'postinstall', 'prepare'].filter(name => typeof value.scripts[name] === 'string')
    : []
  const runtimeEntryGroups = packageRuntimeEntryGroups(value, client !== undefined)
  const marketplace = dsh.marketplace
  let declaredProfiles
  let declaredManualSteps
  let declaredRequiresRestart
  let declaredRequiresBuildApproval
  if (marketplace !== undefined) {
    if (!plainObject(marketplace)) {
      throw new InvalidCandidateError('dsh.marketplace must be an object when declared')
    }
    if (marketplace.profiles !== undefined) {
      if (!Array.isArray(marketplace.profiles)
        || marketplace.profiles.length === 0
        || marketplace.profiles.length > 8
        || marketplace.profiles.some(profile => typeof profile !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,63}$/.test(profile))
        || new Set(marketplace.profiles).size !== marketplace.profiles.length) {
        throw new InvalidCandidateError('dsh.marketplace.profiles must contain unique valid profile names')
      }
      declaredProfiles = marketplace.profiles
    }
    for (const field of ['manualSteps', 'requiresRestart', 'requiresBuildApproval']) {
      if (marketplace[field] !== undefined && typeof marketplace[field] !== 'boolean') {
        throw new InvalidCandidateError('dsh.marketplace.' + field + ' must be a boolean')
      }
    }
    declaredManualSteps = marketplace.manualSteps
    declaredRequiresRestart = marketplace.requiresRestart
    declaredRequiresBuildApproval = marketplace.requiresBuildApproval
  }
  return {
    packageName: name,
    version,
    bundlePatch: dsh.bundle.patch,
    hasClient: client !== undefined,
    installHints: {
      declaredProfiles,
      declaredRequiresBuildApproval,
      requiresRestart: declaredRequiresRestart ?? true,
      declaredManualSteps,
      lifecycleScripts,
      runtimeEntryGroups,
    },
  }
}

/**
 * 校验 dsh-std Community v0.15 清单中市场需要的静态准入信息。
 * 这里只验证 TUI Profile 的清单与定义闭包；运行期 Host 能力和授权仍由宿主决定。
 */
export function inspectDshStdManifest(text) {
  let value
  try {
    value = JSON.parse(text)
  } catch {
    return dshStdInvalid('dsh-plugin.json is not valid JSON')
  }
  if (!plainObject(value)) return dshStdInvalid('dsh-plugin.json must contain an object')

  const allowed = new Set([
    '$schema', 'manifestVersion', 'id', 'name', 'version', 'facets', 'requires',
    'permissions', 'contributes', 'subscriptions', 'license', 'source', 'artifact',
    'compat', 'overrides',
  ])
  for (const key of Object.keys(value)) {
    if (!allowed.has(key) && !key.startsWith('x-')) return dshStdInvalid('dsh-plugin.json has unsupported property ' + key)
  }
  if (!absoluteUrl(value.$schema)) return dshStdInvalid('dsh-plugin.json $schema must be an absolute URI')
  if (value.manifestVersion !== '0.15') return dshStdInvalid('dsh-plugin.json manifestVersion must be 0.15')
  if (typeof value.id !== 'string' || !/^[a-z][a-z0-9]*(?:[.-][a-z0-9][a-z0-9-]*)+$/.test(value.id)) {
    return dshStdInvalid('dsh-plugin.json id must be a stable namespaced identifier')
  }
  if (typeof value.name !== 'string' || value.name.trim() === '') return dshStdInvalid('dsh-plugin.json name must be non-empty')
  if (typeof value.version !== 'string' || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(value.version)) {
    return dshStdInvalid('dsh-plugin.json version must be semantic version')
  }
  if (!plainObject(value.facets) || !plainObject(value.facets.host)
    || Object.keys(value.facets).some(key => key !== 'host')
    || !onlyKeys(value.facets.host, ['entry', 'apiVersion'])
    || !safeDshStdEntry(value.facets.host.entry)
    || !/^v[1-9][0-9]*(?:(?:alpha|beta)[1-9][0-9]*)?$/.test(value.facets.host.apiVersion ?? '')) {
    return dshStdInvalid('dsh-plugin.json must declare only a valid host facet')
  }
  if (value.facets.host.apiVersion !== 'v1alpha1') {
    return dshStdInvalid('dsh-plugin.json host facet apiVersion is not admitted by ' + DSH_STD_PROFILE_VERSION)
  }

  const requirements = []
  const contracts = value.requires?.contracts
  if (value.requires !== undefined && (!plainObject(value.requires)
    || !onlyKeys(value.requires, ['contracts', 'services'])
    || (contracts !== undefined && !Array.isArray(contracts))
    || (value.requires.services !== undefined && (!Array.isArray(value.requires.services) || value.requires.services.length > 0)))) {
    return dshStdInvalid('dsh-plugin.json requires must contain a contracts array when declared')
  }
  for (const contract of contracts ?? []) {
    const parsed = dshStdContract(contract)
    if (parsed === null) return dshStdInvalid('dsh-plugin.json has an invalid contract requirement')
    if (!DSH_STD_COORDINATES.has(parsed.coordinate)) {
      return dshStdInvalid('dsh-plugin.json requires a contract outside ' + DSH_STD_PROFILE_VERSION + ': ' + parsed.coordinate)
    }
    if (parsed.optional && !parsed.fallback) {
      return dshStdInvalid('optional dsh-std contract requires a TUI fallback: ' + parsed.coordinate)
    }
    requirements.push(parsed.coordinate)
  }
  if (new Set(requirements).size !== requirements.length) return dshStdInvalid('dsh-plugin.json repeats a contract requirement')

  const permissionRequests = []
  const permissionKeys = new Set()
  if (value.permissions !== undefined && !Array.isArray(value.permissions)) return dshStdInvalid('dsh-plugin.json permissions must be an array')
  for (const permission of value.permissions ?? []) {
    if (!plainObject(permission) || !onlyKeys(permission, ['name', 'scope', 'reason'])
      || typeof permission.name !== 'string' || typeof permission.scope !== 'string' || permission.scope === ''
      || (permission.reason !== undefined && (typeof permission.reason !== 'string' || permission.reason === ''))) {
      return dshStdInvalid('dsh-plugin.json has an invalid permission request')
    }
    if (!DSH_STD_PERMISSION_DEFAULTS.has(permission.name)) {
      return dshStdInvalid('dsh-plugin.json requests a permission unknown to ' + DSH_STD_PROFILE_VERSION + ': ' + permission.name)
    }
    if (!validDshStdPermissionScope(permission.name, permission.scope, value.id)) {
      return dshStdInvalid('dsh-plugin.json permission scope cannot be enforced: ' + permission.name + '@' + permission.scope)
    }
    const key = permission.name + '\0' + permission.scope
    if (permissionKeys.has(key)) return dshStdInvalid('dsh-plugin.json repeats a permission request')
    permissionKeys.add(key)
    permissionRequests.push(permission)
  }

  const subscriptions = []
  const subscriptionKeys = new Set()
  if (value.subscriptions !== undefined && !Array.isArray(value.subscriptions)) return dshStdInvalid('dsh-plugin.json subscriptions must be an array')
  for (const subscription of value.subscriptions ?? []) {
    const parsed = dshStdSubscription(subscription)
    if (parsed === null || !DSH_STD_SUBSCRIPTIONS.has(parsed.coordinate)) {
      return dshStdInvalid('dsh-plugin.json has a subscription outside ' + DSH_STD_PROFILE_VERSION)
    }
    const key = parsed.coordinate + '\0' + parsed.scope
    if (subscriptionKeys.has(key)) return dshStdInvalid('dsh-plugin.json repeats a subscription')
    subscriptionKeys.add(key)
    subscriptions.push(parsed.coordinate)
  }

  const extensionIssue = dshStdExtensionIssue(value)
  if (extensionIssue !== null) return dshStdInvalid(extensionIssue)

  const requirementSet = new Set(requirements)
  const commandIds = new Set((value.contributes?.commands ?? []).map(command => command.id))
  for (const permission of permissionRequests) {
    const capability = DSH_STD_PERMISSION_CAPABILITIES.get(permission.name)
    if (capability !== undefined && !requirementSet.has(capability)) {
      return dshStdInvalid('dsh-plugin.json permission ' + permission.name + ' requires ' + capability)
    }
    if (permission.name === 'commands.invoke' && !commandIds.has(permission.scope)) {
      return dshStdInvalid('dsh-plugin.json commands.invoke scope is not a declared command: ' + permission.scope)
    }
  }
  for (const commandId of commandIds) {
    if (!permissionRequests.some(permission => permission.name === 'commands.invoke' && permission.scope === commandId)) {
      return dshStdInvalid('dsh-plugin.json command is missing commands.invoke permission scope: ' + commandId)
    }
  }

  const permissions = [...new Set(permissionRequests.map(permission => permission.name))]

  return {
    status: 'valid',
    profile: DSH_STD_PROFILE_VERSION,
    manifestVersion: value.manifestVersion,
    pluginId: value.id,
    requirements,
    permissions,
    authorizationRequired: permissions.some(permission => DSH_STD_PERMISSION_DEFAULTS.get(permission) === 'deny'),
    subscriptions,
    checks: ['TUI-PKG-001', 'TUI-PKG-002'],
    issues: [],
  }
}

function dshStdInvalid(issue) {
  return { status: 'invalid', profile: DSH_STD_PROFILE_VERSION, issues: [issue] }
}

function dshStdContract(value) {
  if (!plainObject(value)
    || !onlyKeys(value, ['apiVersion', 'kind', 'optional', 'fallback'])
    || typeof value.apiVersion !== 'string'
    || typeof value.kind !== 'string'
    || !/^[a-z][a-z0-9.-]*\/v[1-9][0-9]*(?:(?:alpha|beta)[1-9][0-9]*)?$/.test(value.apiVersion)
    || !/^[A-Z][A-Za-z0-9]*$/.test(value.kind)
    || (value.optional !== undefined && typeof value.optional !== 'boolean')
    || (value.fallback !== undefined && (typeof value.fallback !== 'string' || value.fallback === ''))) return null
  return { coordinate: value.apiVersion + '#' + value.kind, optional: value.optional === true, fallback: value.fallback }
}

function dshStdSubscription(value) {
  if (typeof value === 'string') return { coordinate: value, scope: '' }
  if (!plainObject(value) || !onlyKeys(value, ['apiVersion', 'kind', 'scope'])
    || typeof value.apiVersion !== 'string' || typeof value.kind !== 'string'
    || (value.scope !== undefined && (typeof value.scope !== 'string' || value.scope === ''))) return null
  return { coordinate: value.apiVersion + '#' + value.kind, scope: value.scope ?? '' }
}

function dshStdExtensionIssue(value) {
  if (value.contributes !== undefined) {
    if (!plainObject(value.contributes)
      || Object.keys(value.contributes).some(key => key !== 'commands' && key !== 'panels' && !key.startsWith('x-'))
      || (value.contributes.panels !== undefined && (!Array.isArray(value.contributes.panels) || value.contributes.panels.length > 0))
      || (value.contributes.commands !== undefined && (!Array.isArray(value.contributes.commands) || !value.contributes.commands.every(dshStdCommand)))) {
      return 'dsh-plugin.json has invalid static contribution fields'
    }
    const commandIds = (value.contributes.commands ?? []).map(command => command.id)
    if (new Set(commandIds).size !== commandIds.length) return 'dsh-plugin.json repeats a command contribution'
    for (const [point, contributions] of Object.entries(value.contributes)) {
      if (!point.startsWith('x-')) continue
      if (!Array.isArray(contributions)) return 'dsh-plugin.json extension contribution point must be an array: ' + point
      const issue = dshStdContributionIssue(point, contributions)
      if (issue !== null) return issue
    }
  }
  if (value.license !== undefined && (typeof value.license !== 'string' || value.license === '')) return 'dsh-plugin.json has invalid license metadata'
  if (value.source !== undefined && (!plainObject(value.source) || !onlyKeys(value.source, ['repository', 'revision'])
    || !absoluteUrl(value.source.repository) || (value.source.revision !== undefined && (typeof value.source.revision !== 'string' || value.source.revision === '')))) return 'dsh-plugin.json has invalid source metadata'
  if (value.artifact !== undefined && (!plainObject(value.artifact) || !onlyKeys(value.artifact, ['digest', 'algorithm', 'path'])
    || !/^sha256:[a-f0-9]{64}$/.test(value.artifact.digest ?? '') || value.artifact.algorithm !== 'sha256'
    || typeof value.artifact.path !== 'string' || value.artifact.path === '')) return 'dsh-plugin.json has invalid artifact metadata'
  if (value.compat !== undefined && (!plainObject(value.compat) || !onlyKeys(value.compat, ['hosts'])
    || (value.compat.hosts !== undefined && (!Array.isArray(value.compat.hosts) || value.compat.hosts.some(host => typeof host !== 'string' || host === '')
      || new Set(value.compat.hosts).size !== value.compat.hosts.length)))) return 'dsh-plugin.json has invalid compatibility metadata'
  if (value.overrides !== undefined && (!Array.isArray(value.overrides) || !value.overrides.every(dshStdOverride))) return 'dsh-plugin.json has invalid override metadata'
  return null
}

function dshStdCommand(value) {
  return plainObject(value) && onlyKeys(value, ['id', 'title', 'description'])
    && typeof value.id === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9][a-z0-9-]*)+$/.test(value.id)
    && typeof value.title === 'string' && value.title !== ''
    && (value.description === undefined || (typeof value.description === 'string' && value.description !== ''))
}

function dshStdOverride(value) {
  return plainObject(value) && onlyKeys(value, ['target', 'kind', 'description'])
    && typeof value.target === 'string' && value.target !== ''
    && ['patch', 'native', 'build'].includes(value.kind)
    && (value.description === undefined || (typeof value.description === 'string' && value.description !== ''))
}

function validDshStdPermissionScope(permission, scope, componentId) {
  if (permission === 'storage.local.read' || permission === 'storage.local.write') return scope === componentId
  if (permission === 'commands.invoke') return /^[a-z][a-z0-9]*(?:[.-][a-z0-9][a-z0-9-]*)+$/.test(scope)
  const eventScope = DSH_STD_INTERCEPT_SCOPES.get(permission)
  if (eventScope === scope) return true
  if (permission === 'messages.observe.read' || eventScope !== undefined) return validDshStdSessionScope(scope)
  return false
}

function validDshStdSessionScope(scope) {
  return scope === 'session:*'
    || (scope.startsWith('session:')
      && scope.length > 'session:'.length
      && scope.length <= 256
      && !scope.includes('*')
      && !/[\x00-\x1f\x7f-\x9f]/.test(scope))
}

function dshStdContributionIssue(point, contributions) {
  if (point !== 'x-dsh-tui') return null
  const seen = new Set()
  for (const contribution of contributions) {
    if (!plainObject(contribution)
      || !onlyKeysWithExtensions(contribution, ['apiVersion', 'kind', 'id', 'name', 'spec'])
      || typeof contribution.apiVersion !== 'string'
      || typeof contribution.kind !== 'string'
      || typeof contribution.id !== 'string' || contribution.id === ''
      || typeof contribution.name !== 'string'
      || !Object.hasOwn(contribution, 'spec')) return 'dsh-plugin.json has a malformed x-dsh-tui contribution'
    const coordinate = contribution.apiVersion + '#' + contribution.kind
    const key = coordinate + '\0' + contribution.name
    if (seen.has(key)) return 'dsh-plugin.json repeats an x-dsh-tui contribution: ' + coordinate + '@' + contribution.name
    seen.add(key)
    if (coordinate === 'workspace.dsh/v1alpha1#WorkspaceProvider') {
      if (!/^[a-z][a-z0-9-]*$/.test(contribution.name) || !validWorkspaceProviderSpec(contribution.spec)) {
        return 'dsh-plugin.json has an invalid WorkspaceProvider contribution'
      }
    } else if (coordinate === 'tui.dsh/v1alpha1#SettingsSection') {
      if (!/^[a-z][a-z0-9_-]*$/.test(contribution.name) || !validSettingsSectionSpec(contribution.spec)) {
        return 'dsh-plugin.json has an invalid SettingsSection contribution'
      }
    } else if (coordinate === 'tui.dsh/v1alpha1#Scene') {
      if (!/^[a-z][a-z0-9_-]*$/.test(contribution.name) || !validSceneSpec(contribution.spec)) {
        return 'dsh-plugin.json has an invalid Scene contribution'
      }
    }
  }
  return null
}

function validWorkspaceProviderSpec(value) {
  if (!plainObject(value) || !onlyKeysWithExtensions(value, ['title', 'workspaceDomain', 'operations', 'locatorKinds', 'mutationConcurrency', 'limits'])
    || !nonEmptyString(value.title) || !nonEmptyString(value.workspaceDomain)
    || !uniqueNonEmptyStrings(value.operations) || !value.operations.every(operation => DSH_STD_WORKSPACE_OPERATIONS.has(operation))
    || !uniqueNonEmptyStrings(value.locatorKinds)
    || !['serialized', 'revision-checked'].includes(value.mutationConcurrency)) return false
  if (value.limits !== undefined) {
    if (!plainObject(value.limits) || !onlyKeysWithExtensions(value.limits, ['maxWorkspaces', 'maxLocatorLength', 'maxWatchBuffer'])) return false
    if (Object.values(value.limits).some(limit => !Number.isSafeInteger(limit) || limit < 1)) return false
  }
  return true
}

const DSH_STD_WORKSPACE_OPERATIONS = new Set(['list', 'get', 'resolve', 'register', 'rename', 'unregister', 'reorder', 'status', 'watch'])

function validSettingsSectionSpec(value) {
  if (!plainObject(value) || !onlyKeysWithExtensions(value, ['namespace', 'title', 'titles', 'fields'])
    || !/^[a-z][a-z0-9_-]*$/.test(value.namespace ?? '') || !nonEmptyString(value.title)
    || !validLocalizedStrings(value.titles) || !Array.isArray(value.fields)) return false
  return value.fields.every(validSettingsField)
}

function validSettingsField(value) {
  if (!plainObject(value) || !onlyKeysWithExtensions(value, ['path', 'label', 'titles', 'hint', 'hintTitles', 'kind', 'options', 'placeholder', 'secretRef'])
    || !Array.isArray(value.path) || value.path.length === 0 || value.path.some(segment => typeof segment !== 'string' || segment === '')
    || !nonEmptyString(value.label) || !validLocalizedStrings(value.titles) || !validLocalizedStrings(value.hintTitles)
    || (value.hint !== undefined && !nonEmptyString(value.hint))
    || !['text', 'number', 'boolean', 'select'].includes(value.kind)
    || (value.placeholder !== undefined && typeof value.placeholder !== 'string')
    || (value.secretRef !== undefined && !nonEmptyString(value.secretRef))) return false
  if (value.options !== undefined) {
    if (!Array.isArray(value.options)) return false
    if (!value.options.every(option => plainObject(option)
      && onlyKeysWithExtensions(option, ['value', 'label', 'titles'])
      && nonEmptyString(option.value) && nonEmptyString(option.label) && validLocalizedStrings(option.titles))) return false
  }
  return true
}

function validSceneSpec(value) {
  return plainObject(value)
    && onlyKeysWithExtensions(value, ['title', 'titles'])
    && (value.title === undefined || nonEmptyString(value.title))
    && validLocalizedStrings(value.titles)
}

function validLocalizedStrings(value) {
  return value === undefined || (plainObject(value)
    && Object.entries(value).every(([locale, text]) => locale.trim() !== '' && nonEmptyString(text)))
}

function uniqueNonEmptyStrings(value) {
  return Array.isArray(value) && value.length > 0
    && value.every(nonEmptyString) && new Set(value).size === value.length
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function onlyKeysWithExtensions(value, allowed) {
  return Object.keys(value).every(key => allowed.includes(key) || key.startsWith('x-'))
}

function onlyKeys(value, allowed) {
  return Object.keys(value).every(key => allowed.includes(key))
}

function safeDshStdEntry(value) {
  return typeof value === 'string'
    && value.length > 0
    && !value.startsWith('/')
    && !value.includes('\\')
    && !value.includes('\0')
    && !value.split('/').includes('..')
    && !/^[a-z][a-z\d+.-]*:/i.test(value)
}

function absoluteUrl(value) {
  if (typeof value !== 'string') return false
  try { return new URL(value).protocol !== '' } catch { return false }
}

/** Classify installability from independent static evidence. */
export function classifyInstall(identity, repository, treePaths, readmeText, verifiedGitHubRepositories = [repository]) {
  const hints = identity.installHints
  const files = new Set(treePaths.map(normalizeRepoPath))
  const artifactGroups = hints.runtimeEntryGroups.map(group => {
    const found = group.paths.find(candidate => files.has(normalizeRepoPath(candidate))) ?? null
    return { label: group.label, paths: group.paths, found }
  })
  const runtimeArtifactsCommitted = artifactGroups.length > 0 && artifactGroups.every(group => group.found !== null)
  const readme = readmeInstallEvidence(readmeText ?? '', identity.packageName, verifiedGitHubRepositories)
  // DSH's --profile value selects a target directory; it is not a package
  // compatibility declaration. A host-only bundle can therefore target both
  // built-in templates even when its README omits an example profile name.
  const fallbackProfiles = identity.hasClient ? ['web'] : ['headless', 'web']
  // A README placeholder means the author supports a caller-selected profile.
  // Registry v2 cannot express a wildcard without breaking older strict
  // clients, so publish the two DSH-owned profile templates. A Web client is
  // intrinsically restricted to web even when its README says <profile>.
  const anyProfileFallback = identity.hasClient ? ['web'] : ['headless', 'web']
  const readmeProfiles = readme.profiles.length > 0
    ? readme.profiles
    : readme.anyProfile
      ? anyProfileFallback
      : []
  const profiles = hints.declaredProfiles ?? (readmeProfiles.length > 0 ? readmeProfiles : fallbackProfiles)
  const profileSource = hints.declaredProfiles !== undefined
    ? 'manifest'
    : readmeProfiles.length > 0
      ? readme.anyProfile && readme.profiles.length === 0 ? 'readme-any' : 'readme'
      : identity.hasClient
        ? 'client'
        : 'unknown'
  const hasPrepare = hints.lifecycleScripts.includes('prepare')
  // Git dependencies may execute prepare while pnpm is materializing the
  // package. Every lifecycle script therefore keeps the GitHub source guided;
  // a separately verified npm tarball may still override this classification
  // because dependency installs do not execute its prepare script.
  const requiresBuildApproval = hints.lifecycleScripts.length > 0
    || !runtimeArtifactsCommitted
    || hints.declaredRequiresBuildApproval === true
  const manualSteps = requiresBuildApproval
    || (hints.declaredManualSteps ?? profiles.length === 0)
  const reviewReasons = []
  const resolvedReasons = []
  if (hints.declaredManualSteps === true) {
    reviewReasons.push('manifest-requires-manual-steps')
  }
  if (readme.directGitHub && !runtimeArtifactsCommitted) {
    reviewReasons.push('readme-documents-github-install-but-runtime-entry-artifacts-are-missing')
  }
  if (hasPrepare && runtimeArtifactsCommitted && !readme.directGitHub && hints.declaredRequiresBuildApproval === undefined) {
    reviewReasons.push('prepare-and-prebuilt-runtime-found-but-readme-does-not-confirm-github-install')
  }
  if (readme.profiles.length > 0 && hints.declaredProfiles !== undefined
    && !sameStringSet(readme.profiles, hints.declaredProfiles)) {
    reviewReasons.push('readme-profiles-conflict-with-dsh-marketplace-profiles')
  }
  if (readme.unverifiedGitHubRepositories.length > 0) {
    if (!requiresBuildApproval && profiles.length > 0) {
      resolvedReasons.push('readme-alias-is-unverified-but-exact-current-repository-install-is-self-contained')
    } else {
      reviewReasons.push('readme-github-repository-owner-does-not-resolve-to-this-candidate')
    }
  }
  const requiresManualReview = reviewReasons.length > 0
  return {
    identity: {
      ...identity,
      installHints: {
        profiles,
        requiresBuildApproval,
        requiresRestart: hints.requiresRestart,
        manualSteps: manualSteps || requiresManualReview,
      },
    },
    inspection: {
      classifierVersion: INSTALL_CLASSIFIER_VERSION,
      profileSource,
      profiles,
      lifecycleScripts: hints.lifecycleScripts,
      artifactGroups,
      runtimeArtifactsCommitted,
      readme: {
        found: readmeText !== null,
        directRemote: readme.directRemote,
        directGitHub: readme.directGitHub,
        directNpm: readme.directNpm,
        anyProfile: readme.anyProfile,
        requiresBuildApproval: readme.requiresBuildApproval,
        profiles: readme.profiles,
        specs: readme.specs,
        verifiedGitHubRepositories: [...verifiedGitHubRepositories].sort(),
        unverifiedGitHubRepositories: readme.unverifiedGitHubRepositories,
      },
      reviewReasons,
      resolvedReasons,
    },
  }
}

const jsScalarTag = {
  tag: 'tag:yaml.org,2002:js',
  resolve(value) { return String(value) },
}

/** Parse a bundle patch as data and prove that it inserts its owning package. */
export function validateBundlePatch(text, packageName) {
  const document = parseDocument(text, {
    customTags: [jsScalarTag],
    maxAliasCount: 50,
    prettyErrors: false,
    schema: 'core',
    strict: true,
    uniqueKeys: true,
  })
  const issues = [...document.errors, ...document.warnings]
  if (issues.length > 0) {
    throw new InvalidCandidateError('bundle patch is invalid YAML: ' + issues[0].message)
  }
  let root
  try {
    root = document.toJS({ maxAliasCount: 50 })
  } catch (error) {
    throw new InvalidCandidateError('bundle patch could not be materialized: ' + messageOf(error))
  }
  if (!Array.isArray(root) || root.length === 0) {
    throw new InvalidCandidateError('bundle patch must be a non-empty operation array')
  }
  let ownsEntry = false
  for (const operation of root) {
    if (!plainObject(operation)) throw new InvalidCandidateError('every bundle patch operation must be an object')
    if (operation.insert === undefined) continue
    if (!Array.isArray(operation.insert)) throw new InvalidCandidateError('bundle patch insert must be an array')
    for (const entry of operation.insert) {
      if (!plainObject(entry) || typeof entry.id !== 'string' || entry.id === '' || typeof entry.name !== 'string') {
        throw new InvalidCandidateError('every inserted loader entry needs non-empty id and name fields')
      }
      if (entry.name === packageName) ownsEntry = true
    }
  }
  if (!ownsEntry) {
    throw new InvalidCandidateError('bundle patch does not insert a loader entry owned by package ' + packageName)
  }
}

/** npm 验证只提供安装候选；维护者的人工限制始终最后合并，不能被验证结果解除。 */
export function mergeInstallOverrides(discoveredNpmOverride, installOverride) {
  return discoveredNpmOverride === undefined
    ? installOverride
    : { ...discoveredNpmOverride, ...installOverride }
}

/** Construct the public Registry row after both files passed. */
export function verifiedPlugin(candidate, commit, identity, verifiedAt, installOverride = undefined) {
  const license = plainObject(candidate.license) && typeof candidate.license.spdx_id === 'string'
    ? candidate.license.spdx_id
    : null
  const owner = plainObject(candidate.owner) && typeof candidate.owner.login === 'string'
    ? candidate.owner.login
    : candidate.full_name.split('/')[0]
  const { installHints, ...publicIdentity } = identity
  const githubSpec = 'github:' + candidate.full_name + '#' + commit
  const source = installOverride?.source ?? 'github'
  const profiles = installOverride?.profiles ?? installHints.profiles
  const requiresBuildApproval = installOverride?.requiresBuildApproval ?? installHints.requiresBuildApproval
  const manualSteps = installOverride?.manualSteps ?? installHints.manualSteps
  const requiresRestart = installOverride?.requiresRestart ?? installHints.requiresRestart
  const spec = installOverride?.spec ?? (source === 'github' ? githubSpec : '')
  const exactSource = (source === 'github' && spec.toLocaleLowerCase() === githubSpec.toLocaleLowerCase())
    || (source === 'npm' && spec === publicIdentity.packageName + '@' + publicIdentity.version)
  const automatic = exactSource
    && profiles.length > 0
    && !requiresBuildApproval
    && !manualSteps
  return {
    owner,
    repo: candidate.name,
    fullName: candidate.full_name,
    description: typeof candidate.description === 'string' ? candidate.description : null,
    stars: integer(candidate.stargazers_count),
    forks: integer(candidate.forks_count),
    openIssues: integer(candidate.open_issues_count),
    language: typeof candidate.language === 'string' ? candidate.language : null,
    license,
    updatedAt: iso(candidate.updated_at),
    defaultBranch: candidate.default_branch,
    verifiedCommit: commit,
    htmlUrl: candidate.html_url,
    topics: Array.isArray(candidate.topics) ? candidate.topics.filter(topic => typeof topic === 'string') : [],
    ...publicIdentity,
    install: {
      mode: automatic ? 'automatic' : 'guided',
      source,
      spec,
      profiles,
      requiresBuildApproval,
      requiresRestart,
      manualSteps,
      instructionsUrl: installOverride?.instructionsUrl ?? candidate.html_url + '#readme',
    },
    verifiedAt,
  }
}

/** Refresh mutable GitHub metadata without changing verified identity or commit. */
export function refreshPluginMetadata(plugin, candidate) {
  const license = plainObject(candidate.license) && typeof candidate.license.spdx_id === 'string'
    ? candidate.license.spdx_id
    : null
  const owner = plainObject(candidate.owner) && typeof candidate.owner.login === 'string'
    ? candidate.owner.login
    : candidate.full_name.split('/')[0]
  return {
    ...plugin,
    owner,
    repo: candidate.name,
    fullName: candidate.full_name,
    description: typeof candidate.description === 'string' ? candidate.description : null,
    stars: integer(candidate.stargazers_count),
    forks: integer(candidate.forks_count),
    openIssues: integer(candidate.open_issues_count),
    language: typeof candidate.language === 'string' ? candidate.language : null,
    license,
    updatedAt: iso(candidate.updated_at),
    defaultBranch: candidate.default_branch,
    htmlUrl: candidate.html_url,
    topics: Array.isArray(candidate.topics) ? candidate.topics.filter(topic => typeof topic === 'string') : [],
    install: { ...plugin.install, instructionsUrl: candidate.html_url + '#readme' },
  }
}

export function candidateFingerprint(candidate, installOverride = undefined) {
  // Repository metadata such as stars or topics can change `updated_at`
  // without changing plugin files. Code validation only needs a new push or
  // a different default branch to invalidate the previous result.
  return [
    candidate.default_branch,
    candidate.pushed_at,
    JSON.stringify(installOverride ?? null),
    'install-classifier-v' + String(INSTALL_CLASSIFIER_VERSION),
    'dsh-std-preflight-v1',
  ].join('\n')
}

export function encodeRawPath(path) {
  return path.split('/').filter(segment => segment !== '.').map(encodeURIComponent).join('/')
}

function packageRuntimeEntryGroups(manifest, hasClient) {
  const groups = []
  const exportsValue = manifest.exports
  let rootExport
  if (typeof exportsValue === 'string' || Array.isArray(exportsValue)) {
    rootExport = exportsValue
  } else if (plainObject(exportsValue)) {
    rootExport = exportsValue['.'] ?? (Object.keys(exportsValue).some(key => key.startsWith('.')) ? undefined : exportsValue)
  }
  const rootPaths = runtimePaths(rootExport)
  if (rootPaths.length === 0 && typeof manifest.main === 'string') rootPaths.push(...runtimePaths(manifest.main))
  if (rootPaths.length === 0) rootPaths.push('index.js', 'index.mjs', 'index.cjs')
  groups.push({ label: 'host', paths: unique(rootPaths) })
  if (hasClient) {
    const clientExport = plainObject(exportsValue) ? exportsValue['./client'] : undefined
    groups.push({ label: 'client', paths: unique(runtimePaths(clientExport)) })
  }
  return groups
}

function runtimePaths(value) {
  if (typeof value === 'string') {
    if (!safePatchPath(value) || value.includes('*')) return []
    const normalized = normalizeRepoPath(value)
    return normalized === '' ? [] : [normalized]
  }
  if (Array.isArray(value)) return value.flatMap(runtimePaths)
  if (!plainObject(value)) return []
  return Object.entries(value)
    .filter(([condition]) => condition !== 'types')
    .flatMap(([, target]) => runtimePaths(target))
}

export function readmeGitHubRepositories(text) {
  const repositories = []
  for (const command of readmeInstallCommands(text)) {
    const repository = githubRepositoryFromSpec(command.spec)
    if (repository !== null && !repositories.some(value => value.toLocaleLowerCase() === repository.toLocaleLowerCase())) {
      repositories.push(repository)
    }
  }
  return repositories
}

function readmeInstallEvidence(text, packageName, verifiedGitHubRepositories) {
  const profiles = new Set()
  const specs = []
  const unverifiedGitHubRepositories = new Set()
  let directRemote = false
  let directGitHub = false
  let directNpm = false
  let anyProfile = false
  const allowedRepositories = new Set(verifiedGitHubRepositories.map(value => value.toLocaleLowerCase()))
  const expectedRepositoryNames = new Set(
    verifiedGitHubRepositories.map(value => value.split('/')[1]?.toLocaleLowerCase()).filter(Boolean),
  )
  for (const { profile, anyProfile: commandAnyProfile, spec } of readmeInstallCommands(text)) {
    const github = githubRepositoryFromSpec(spec)
    if (github !== null
      && !placeholderGitHubRepository(github)
      && expectedRepositoryNames.has(github.split('/')[1]?.toLocaleLowerCase())
      && !allowedRepositories.has(github.toLocaleLowerCase())) {
      unverifiedGitHubRepositories.add(github)
    }
    const kind = matchingInstallSpec(spec, packageName, allowedRepositories)
    if (kind === null) continue
    if (commandAnyProfile) anyProfile = true
    else profiles.add(profile)
    directRemote = directRemote || kind === 'github' || kind === 'npm' || kind === 'tarball'
    directGitHub = directGitHub || kind === 'github'
    directNpm = directNpm || kind === 'npm'
    if (specs.length < 8 && !specs.includes(spec)) specs.push(spec)
  }
  return {
    profiles: [...profiles].sort(),
    specs,
    directRemote,
    directGitHub,
    directNpm,
    anyProfile,
    requiresBuildApproval: /\ballowBuilds\b|\bapprove[- ]builds?\b|\bbuild approval\b/iu.test(text),
    unverifiedGitHubRepositories: [...unverifiedGitHubRepositories].sort(),
  }
}

function readmeInstallCommands(text) {
  const commands = []
  const expression = /\bdsh\s+plugin\s+--profile(?:\s+|=)(?:"([^"]+)"|'([^']+)'|([^\s`]+))\s+add\b([^\r\n`]*)/giu
  for (const match of text.matchAll(expression)) {
    const profileToken = match[1] ?? match[2] ?? match[3] ?? ''
    const profile = normalizeReadmeProfile(profileToken)
    if (profile === null) continue
    const tokens = shellLikeTokens(match[4] ?? '')
    const spec = tokens.find(token => !token.startsWith('-'))?.replace(/[),.;]+$/, '') ?? ''
    if (spec === '') continue
    commands.push({ ...profile, spec })
  }
  return commands
}

function normalizeReadmeProfile(value) {
  if (/^<(?:your-?|my-?)?(?:profile|profile-name|name)>$/i.test(value)
    || /^(?:your-|my-)?profile(?:-name)?$/i.test(value)
    || /^\$(?:DSH_)?PROFILE$/i.test(value)
    || /^\$\{(?:DSH_)?PROFILE\}$/i.test(value)) {
    return { profile: null, anyProfile: true }
  }
  if (/^[a-z0-9][a-z0-9._-]{0,63}$/.test(value)) return { profile: value, anyProfile: false }
  return null
}

function shellLikeTokens(value) {
  const tokens = []
  const expression = /"([^"]*)"|'([^']*)'|([^\s]+)/g
  for (const match of value.matchAll(expression)) tokens.push(match[1] ?? match[2] ?? match[3] ?? '')
  return tokens
}

function matchingInstallSpec(spec, packageName, allowedRepositories) {
  const lower = spec.toLocaleLowerCase()
  const github = githubRepositoryFromSpec(spec)
  if (github !== null) return allowedRepositories.has(github.toLocaleLowerCase()) ? 'github' : null
  if (lower === packageName.toLocaleLowerCase() || lower.startsWith(packageName.toLocaleLowerCase() + '@')) return 'npm'
  if (/^https:\/\/.+\.tgz(?:[?#].*)?$/i.test(spec)) return 'tarball'
  return null
}

function githubRepositoryFromSpec(spec) {
  const github = /^(?:github:|git\+https:\/\/github\.com\/|https:\/\/github\.com\/)([^/#]+)\/([^/#&]+)(?:[&#].*)?$/i.exec(spec)
  if (github === null) return null
  return github[1] + '/' + github[2].replace(/\.git$/i, '')
}

function placeholderGitHubRepository(repository) {
  const owner = repository.split('/')[0] ?? ''
  return /[<>{}$]/.test(owner)
    || /^(?:you|owner|username|github-username|your(?:-github)?-(?:name|username)|my-(?:name|username))$/i.test(owner)
    || /(?:你的|您的).*(?:用户名|账号)/u.test(owner)
}

function normalizeRepoPath(value) {
  return String(value).replace(/^\.\//, '').replace(/\\/g, '/')
}

function unique(values) {
  return [...new Set(values)]
}

function sameStringSet(left, right) {
  return left.length === right.length && [...left].sort().every((value, index) => value === [...right].sort()[index])
}

function plainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function integer(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : 0
}

function iso(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : new Date(0).toISOString()
}

function messageOf(error) {
  return error instanceof Error ? error.message : String(error)
}
