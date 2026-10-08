/** Regression tests for the static Registry validator. */

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  InvalidCandidateError,
  classifyInstall,
  encodeRawPath,
  inspectDshStdManifest,
  safePatchPath,
  validateBundlePatch,
  validateManifest,
  verifiedPlugin,
} from './registry-core.mjs'
import {
  classifyPluginCategories,
  starGrowth7d,
  updateStarHistory,
} from './discovery-core.mjs'

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))

const ownPackage = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
assert.deepEqual(validateManifest(JSON.stringify(ownPackage)).installHints.declaredProfiles, ['web', 'desktop'])
// 既有分类用例继续使用未声明 Profile 的 fixture，覆盖 Web/Headless 默认行为。
const { marketplace: _marketplace, ...fixtureDsh } = ownPackage.dsh
const identity = validateManifest(JSON.stringify({ ...ownPackage, dsh: fixtureDsh }))
assert.equal(identity.packageName, 'dsh-plugin-marketplace')
assert.equal(identity.bundlePatch, './cordis.patch.yml')
assert.equal(identity.hasClient, true)
assert.deepEqual(identity.installHints.lifecycleScripts, [])
assert.equal(identity.installHints.declaredProfiles, undefined)
assert.deepEqual(identity.installHints.runtimeEntryGroups.map(group => group.label), ['host', 'client'])
validateBundlePatch(await readFile(path.join(root, 'cordis.patch.yml'), 'utf8'), identity.packageName)

assert.equal(safePatchPath('./nested/plugin.yml'), true)
assert.equal(safePatchPath('../outside.yml'), false)
assert.equal(safePatchPath('C:/outside.yml'), false)
assert.equal(encodeRawPath('./nested/plugin.yml'), 'nested/plugin.yml')

assertInvalid(
  () => validateManifest('{"name":"bad","version":"1.0.0"}'),
  'manifest without dsh.bundle.patch',
)
assertInvalid(
  () => validateManifest('{"name":"bad","version":"1.0.0","dsh":{"bundle":{"patch":"./p.yml"},"marketplace":{"profiles":["Bad Profile"]}}}'),
  'manifest with malformed marketplace profiles',
)

const dshStd = inspectDshStdManifest(JSON.stringify({
  $schema: 'https://dsh.community/schemas/dsh-plugin-0.15.json',
  id: 'com.example.marketplace-fixture',
  name: 'Marketplace fixture',
  version: '1.0.0',
  manifestVersion: '0.15',
  facets: { host: { entry: 'lib/index.js', apiVersion: 'v1alpha1' } },
  requires: { contracts: [{ apiVersion: 'commands.dsh/v1alpha1', kind: 'Command' }] },
  permissions: [{ name: 'commands.invoke', scope: 'com.example.marketplace-fixture.run' }],
  contributes: { commands: [{ id: 'com.example.marketplace-fixture.run', title: 'Run' }] },
  subscriptions: [{ apiVersion: 'messages.dsh/v1alpha1', kind: 'MessageObserver', scope: 'session:fixture' }],
}))
assert.equal(dshStd.status, 'valid')
assert.deepEqual(dshStd.requirements, ['commands.dsh/v1alpha1#Command'])
assert.equal(dshStd.authorizationRequired, false)
assert.deepEqual(dshStd.subscriptions, ['messages.dsh/v1alpha1#MessageObserver'])
assert.equal(inspectDshStdManifest(JSON.stringify({
  $schema: 'https://dsh.community/schemas/dsh-plugin-0.15.json',
  id: 'com.example.invalid-optional',
  name: 'Invalid optional',
  version: '1.0.0',
  manifestVersion: '0.15',
  facets: { host: { entry: 'lib/index.js', apiVersion: 'v1alpha1' } },
  requires: { contracts: [{ apiVersion: 'messages.dsh/v1alpha1', kind: 'MessageObserver', optional: true }] },
})).status, 'invalid', '可选协议缺少 fallback 必须拒绝')

const dshStdBase = {
  $schema: 'https://dsh.community/schemas/dsh-plugin-0.15.json',
  id: 'com.example.semantic-fixture',
  name: 'Semantic fixture',
  version: '1.0.0',
  manifestVersion: '0.15',
  facets: { host: { entry: 'lib/index.js', apiVersion: 'v1alpha1' } },
  requires: { contracts: [{ apiVersion: 'commands.dsh/v1alpha1', kind: 'Command' }] },
  subscriptions: [],
}
const command = id => ({ id, title: id })

assert.equal(inspectDshStdManifest(JSON.stringify({
  ...dshStdBase,
  permissions: [{ name: 'commands.invoke', scope: 'com.example.semantic-fixture.run' }],
  contributes: { commands: [command('com.example.semantic-fixture.run'), command('com.example.semantic-fixture.run')] },
})).status, 'invalid', '重复 command id 必须拒绝')

assert.equal(inspectDshStdManifest(JSON.stringify({
  ...dshStdBase,
  permissions: [{ name: 'storage.local.read', scope: 'not-the-plugin-id' }],
  contributes: { commands: [] },
})).status, 'invalid', '不可执行的 permission scope 必须拒绝')

assert.equal(inspectDshStdManifest(JSON.stringify({
  ...dshStdBase,
  permissions: [{ name: 'storage.local.read', scope: dshStdBase.id }],
  contributes: { commands: [] },
})).status, 'invalid', 'permission 缺少对应 capability 必须拒绝')

const multipleCommandPermissions = inspectDshStdManifest(JSON.stringify({
  ...dshStdBase,
  permissions: [
    { name: 'commands.invoke', scope: 'com.example.semantic-fixture.first' },
    { name: 'commands.invoke', scope: 'com.example.semantic-fixture.second' },
  ],
  contributes: { commands: [
    command('com.example.semantic-fixture.first'),
    command('com.example.semantic-fixture.second'),
  ] },
  overrides: [{ target: 'host', kind: 'patch' }],
}))
assert.equal(multipleCommandPermissions.status, 'valid', '同名 permission 的不同 scope 和可选 override.description 应合法')
assert.deepEqual(multipleCommandPermissions.permissions, ['commands.invoke'])

assert.equal(inspectDshStdManifest(JSON.stringify({
  ...dshStdBase,
  permissions: [],
  contributes: {
    commands: [],
    'x-dsh-tui': [{
      apiVersion: 'tui.dsh/v1alpha1',
      kind: 'SettingsSection',
      id: 'com.example.semantic-fixture.settings',
      name: 'settings',
      spec: { namespace: 'example', title: 'Example', fields: 'not-an-array' },
    }],
  },
})).status, 'invalid', '无效的 x-dsh-tui payload 必须拒绝')

assert.equal(inspectDshStdManifest(JSON.stringify({
  ...dshStdBase,
  permissions: [],
  contributes: {
    commands: [],
    'x-dsh-tui': [
      {
        apiVersion: 'workspace.dsh/v1alpha1',
        kind: 'WorkspaceProvider',
        id: 'com.example.semantic-fixture.workspace',
        name: 'example-workspace',
        spec: {
          title: 'Example',
          workspaceDomain: 'example.workspaces',
          operations: ['list', 'get', 'resolve'],
          locatorKinds: ['example'],
          mutationConcurrency: 'serialized',
        },
      },
      {
        apiVersion: 'tui.dsh/v1alpha1',
        kind: 'SettingsSection',
        id: 'com.example.semantic-fixture.settings',
        name: 'example_settings',
        spec: { namespace: 'example', title: 'Example', fields: [{ path: ['enabled'], label: 'Enabled', kind: 'boolean' }] },
      },
      {
        apiVersion: 'tui.dsh/v1alpha1',
        kind: 'Scene',
        id: 'com.example.semantic-fixture.scene',
        name: 'example_scene',
        spec: { title: 'Example' },
      },
    ],
  },
})).status, 'valid', '官方 TUI 扩展贡献结构必须通过')

const marketplaceClassification = classifyInstall(
  identity,
  'owner/repo',
  ['lib/index.js', 'lib/client.js'],
  'dsh plugin --profile web add github:owner/repo',
)
const row = verifiedPlugin({
  full_name: 'owner/repo',
  name: 'repo',
  default_branch: 'main',
  html_url: 'https://github.com/owner/repo',
  updated_at: '2026-08-13T00:00:00Z',
  owner: { login: 'owner' },
}, 'a'.repeat(40), marketplaceClassification.identity, '2026-08-13T00:00:00Z')
assert.equal(row.install.mode, 'automatic')
assert.equal(row.install.spec, 'github:owner/repo#' + 'a'.repeat(40))
assert.deepEqual(row.install.profiles, ['web'])
assert.deepEqual(classifyPluginCategories({
  fullName: 'owner/dsh-music-vision',
  packageName: 'dsh-music-vision',
  description: 'Multimodal audio and image tools',
  topics: ['dsh-plugin', 'media'],
}), ['media'])
assert.deepEqual(classifyPluginCategories({
  fullName: 'owner/dsh-secure-dashboard',
  packageName: 'dsh-secure-dashboard',
  description: 'Security audit dashboard with usage analytics',
  topics: ['security', 'observability'],
}), ['security', 'observability', 'ui'])
const initialStarHistory = updateStarHistory(undefined, 10, '2026-08-13T02:17:00Z', 13, '2026-08-14T02:17:00Z')
assert.deepEqual(initialStarHistory, [
  { date: '2026-08-13', stars: 10 },
  { date: '2026-08-14', stars: 13 },
])
assert.equal(starGrowth7d(initialStarHistory, 13), 3)
const sameDayStarHistory = updateStarHistory(initialStarHistory, 13, '2026-08-14T02:17:00Z', 15, '2026-08-14T08:00:00Z')
assert.deepEqual(sameDayStarHistory, initialStarHistory, 'same-day scans must preserve the earliest baseline')
assert.equal(starGrowth7d(sameDayStarHistory, 15), 5)

const npmClassification = classifyInstall(
  identity,
  'owner/repo',
  ['lib/index.js', 'lib/client.js'],
  'dsh plugin --profile web add dsh-plugin-marketplace',
)
assert.equal(npmClassification.inspection.readme.directNpm, true)
const npmRow = verifiedPlugin({
  full_name: 'owner/repo',
  name: 'repo',
  default_branch: 'main',
  html_url: 'https://github.com/owner/repo',
  updated_at: '2026-08-13T00:00:00Z',
  owner: { login: 'owner' },
}, 'b'.repeat(40), npmClassification.identity, '2026-08-13T00:00:00Z', {
  source: 'npm',
  spec: 'dsh-plugin-marketplace@' + identity.version,
  profiles: ['web'],
  requiresBuildApproval: false,
  manualSteps: false,
})
assert.equal(npmRow.install.mode, 'automatic')
assert.equal(npmRow.install.source, 'npm')

const prepareManifest = validateManifest(JSON.stringify({
  name: '@dsh-external/dsh-side-panel',
  version: '0.2.0',
  main: './lib/index.js',
  exports: { '.': './lib/index.js', './client': './lib/client.js' },
  scripts: { prepare: 'npm run build' },
  dsh: { bundle: { patch: './cordis.patch.yml' }, client: { platform: 'web' } },
}))
const preparePrebuilt = classifyInstall(
  prepareManifest,
  'ccq1/dsh-side-panel',
  ['lib/index.js', 'lib/client.js', 'README.md'],
  'dsh plugin --profile web add github:dsh-external/dsh-side-panel',
  ['ccq1/dsh-side-panel', 'dsh-external/dsh-side-panel'],
)
assert.equal(preparePrebuilt.identity.installHints.requiresBuildApproval, true)
assert.equal(preparePrebuilt.identity.installHints.manualSteps, true)
assert.equal(preparePrebuilt.inspection.runtimeArtifactsCommitted, true)
assert.equal(preparePrebuilt.inspection.readme.directGitHub, true)
assert.deepEqual(preparePrebuilt.inspection.resolvedReasons, [])
const prepareGitHubRow = verifiedPlugin({
  full_name: 'ccq1/dsh-side-panel',
  name: 'dsh-side-panel',
  default_branch: 'main',
  html_url: 'https://github.com/ccq1/dsh-side-panel',
  updated_at: '2026-08-14T00:00:00Z',
  owner: { login: 'ccq1' },
}, 'c'.repeat(40), preparePrebuilt.identity, '2026-08-14T00:00:00Z')
assert.equal(prepareGitHubRow.install.mode, 'guided')
assert.equal(prepareGitHubRow.install.requiresBuildApproval, true)

const sameNameDifferentRepository = classifyInstall(
  prepareManifest,
  'ccq1/dsh-side-panel',
  ['lib/index.js', 'lib/client.js'],
  'dsh plugin --profile web add github:unverified-owner/dsh-side-panel',
)
assert.equal(sameNameDifferentRepository.inspection.readme.directGitHub, false)
assert.equal(sameNameDifferentRepository.identity.installHints.requiresBuildApproval, true)
assert.deepEqual(sameNameDifferentRepository.inspection.readme.unverifiedGitHubRepositories, [
  'unverified-owner/dsh-side-panel',
])
assert.ok(sameNameDifferentRepository.inspection.reviewReasons.includes(
  'readme-github-repository-owner-does-not-resolve-to-this-candidate',
))

const unverifiedOwnerOnly = classifyInstall(
  identity,
  'owner/repo',
  ['lib/index.js', 'lib/client.js'],
  'dsh plugin --profile web add github:unverified-owner/repo',
)
assert.equal(unverifiedOwnerOnly.identity.installHints.requiresBuildApproval, false)
assert.equal(unverifiedOwnerOnly.identity.installHints.manualSteps, false)
assert.deepEqual(unverifiedOwnerOnly.inspection.resolvedReasons, [
  'readme-alias-is-unverified-but-exact-current-repository-install-is-self-contained',
])

const anyProfile = classifyInstall(
  validateManifest(JSON.stringify({
    name: 'any-profile-plugin',
    version: '1.0.0',
    main: './index.js',
    dsh: { bundle: { patch: './cordis.patch.yml' } },
  })),
  'owner/any-profile-plugin',
  ['index.js'],
  'dsh plugin --profile <profile> add github:owner/any-profile-plugin',
)
assert.equal(anyProfile.inspection.readme.anyProfile, true)
assert.deepEqual(anyProfile.identity.installHints.profiles, ['headless', 'web'])
assert.equal(anyProfile.identity.installHints.manualSteps, false)

const explicitDesktop = classifyInstall(identity, 'owner/repo', ['lib/index.js', 'lib/client.js'],
  'dsh plugin --profile desktop add github:owner/repo')
assert.deepEqual(explicitDesktop.identity.installHints.profiles, ['desktop'], '明确安装命令才收录 desktop')
const vagueDesktop = classifyInstall(identity, 'owner/repo', ['lib/index.js', 'lib/client.js'], '支持桌面端 / supports desktop')
assert.equal(vagueDesktop.identity.installHints.profiles.includes('desktop'), false, '不把普通宣传文本推断为 Profile 支持')

const prosePlaceholder = classifyInstall(
  validateManifest(JSON.stringify({
    name: 'prose-placeholder-plugin',
    version: '1.0.0',
    main: './index.js',
    dsh: { bundle: { patch: './cordis.patch.yml' } },
  })),
  'owner/prose-placeholder-plugin',
  ['index.js'],
  'dsh plugin --profile your-profile add prose-placeholder-plugin',
)
assert.equal(prosePlaceholder.inspection.readme.anyProfile, true)
assert.deepEqual(prosePlaceholder.identity.installHints.profiles, ['headless', 'web'])

const hostWithoutProfileDocs = classifyInstall(
  validateManifest(JSON.stringify({
    name: 'host-without-profile-docs',
    version: '1.0.0',
    main: './index.js',
    dsh: { bundle: { patch: './cordis.patch.yml' } },
  })),
  'owner/host-without-profile-docs',
  ['index.js'],
  null,
)
assert.deepEqual(hostWithoutProfileDocs.identity.installHints.profiles, ['headless', 'web'])
assert.equal(hostWithoutProfileDocs.identity.installHints.manualSteps, false)

const workspaceRootOption = classifyInstall(
  identity,
  'owner/repo',
  ['lib/index.js', 'lib/client.js'],
  'dsh plugin --profile web add -w github:owner/repo#<reviewed-commit>',
)
assert.equal(workspaceRootOption.inspection.readme.directGitHub, true)
assert.deepEqual(workspaceRootOption.identity.installHints.profiles, ['web'])
assert.equal(workspaceRootOption.identity.installHints.manualSteps, false)

const missingRequiredProfile = classifyInstall(
  identity,
  'owner/repo',
  ['lib/index.js', 'lib/client.js'],
  'dsh plugin add github:owner/repo',
)
assert.equal(missingRequiredProfile.inspection.readme.directGitHub, false)
assert.equal(missingRequiredProfile.identity.installHints.manualSteps, false)
assert.deepEqual(missingRequiredProfile.identity.installHints.profiles, ['web'])

const placeholderOwner = classifyInstall(
  identity,
  'owner/repo',
  ['lib/index.js', 'lib/client.js'],
  'dsh plugin --profile <profile> add github:you/repo',
)
assert.equal(placeholderOwner.inspection.readme.directGitHub, false)
assert.equal(placeholderOwner.identity.installHints.manualSteps, false)
assert.deepEqual(placeholderOwner.inspection.readme.unverifiedGitHubRepositories, [])

const documentedBuildApproval = classifyInstall(
  prepareManifest,
  'ccq1/dsh-side-panel',
  ['lib/index.js', 'lib/client.js'],
  'dsh plugin --profile web add github:ccq1/dsh-side-panel\nAdd it to allowBuilds before installing.',
)
assert.equal(documentedBuildApproval.identity.installHints.requiresBuildApproval, true)
assert.equal(documentedBuildApproval.identity.installHints.manualSteps, true)

const prepareUndocumented = classifyInstall(
  prepareManifest,
  'ccq1/dsh-side-panel',
  ['lib/index.js', 'lib/client.js'],
  null,
)
assert.equal(prepareUndocumented.identity.installHints.requiresBuildApproval, true)
assert.equal(prepareUndocumented.inspection.reviewReasons.length, 1)

const prepareMissing = classifyInstall(
  prepareManifest,
  'ccq1/dsh-side-panel',
  ['README.md'],
  'dsh plugin --profile web add github:dsh-external/dsh-side-panel',
  ['ccq1/dsh-side-panel', 'dsh-external/dsh-side-panel'],
)
assert.equal(prepareMissing.identity.installHints.requiresBuildApproval, true)
assert.equal(prepareMissing.inspection.reviewReasons[0], 'readme-documents-github-install-but-runtime-entry-artifacts-are-missing')

const hardLifecycle = validateManifest(JSON.stringify({
  name: 'hard-lifecycle',
  version: '1.0.0',
  main: './index.js',
  scripts: { postinstall: 'node setup.js' },
  dsh: { bundle: { patch: './cordis.patch.yml' }, marketplace: { profiles: ['web'] } },
}))
const hardClassification = classifyInstall(
  hardLifecycle,
  'owner/hard-lifecycle',
  ['index.js'],
  'dsh plugin --profile web add github:owner/hard-lifecycle',
)
assert.equal(hardClassification.identity.installHints.requiresBuildApproval, true)
assertInvalid(
  () => validateBundlePatch('- insert:\n    - id: wrong\n      name: another-package\n', identity.packageName),
  'patch without an owning loader entry',
)

globalThis.__DSH_REGISTRY_EXECUTED__ = false
validateBundlePatch(
  '- insert:\n'
  + '    - id: safe-static-data\n'
  + '      name: dsh-plugin-marketplace\n'
  + '      config: !!js globalThis.__DSH_REGISTRY_EXECUTED__ = true\n',
  identity.packageName,
)
assert.equal(globalThis.__DSH_REGISTRY_EXECUTED__, false, 'YAML !!js content must never execute during validation')
delete globalThis.__DSH_REGISTRY_EXECUTED__

// Experimental verification reports must never rewrite the public install
// classification. This also guards the one-time rollback of the old gate.
const stableState = JSON.parse(await readFile(path.join(root, 'registry', 'state.json'), 'utf8'))
const stableRegistry = JSON.parse(await readFile(path.join(root, 'registry', 'plugins.json'), 'utf8'))
const publishedByName = new Map(stableRegistry.plugins.map(plugin => [plugin.fullName.toLocaleLowerCase(), plugin]))
for (const [key, row] of Object.entries(stableState.repositories)) {
  if (row?.status !== 'verified' || row.plugin === undefined) continue
  assert.equal(row.inspection?.securityBaseInstall, undefined, key + ' retained an experimental install override')
  assert.equal(
    row.inspection?.reviewReasons?.some(reason => typeof reason === 'string' && reason.startsWith('security-scan-')),
    false,
    key + ' retained an experimental review reason',
  )
  assert.deepEqual(publishedByName.get(key)?.install, row.plugin.install, key + ' public install mode differs from stable state')
}

console.log('Registry validator tests passed')

function assertInvalid(callback, label) {
  assert.throws(callback, error => error instanceof InvalidCandidateError, label)
}
