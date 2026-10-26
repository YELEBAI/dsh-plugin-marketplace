/** Pure install-audit decisions and deterministic npm promotion helpers. */

export function assessGuidedInstall(plugin, inspection, remoteCommands, npmVerification) {
  const reviewReasons = Array.isArray(inspection?.reviewReasons) ? inspection.reviewReasons : []
  const npmBlockers = reviewReasons.filter(reason => (
    reason === 'readme-profiles-conflict-with-dsh-marketplace-profiles'
    || reason === 'manifest-requires-manual-steps'
    || reason === 'registry-install-policy-requires-manual-steps'
  ))
  if (npmVerification.verified === true && plugin.install.profiles.length > 0 && npmBlockers.length === 0) {
    return { outcome: 'automatic-npm-candidate', reason: npmVerification.reason }
  }
  if (npmVerification.verified === true && npmBlockers.length > 0) {
    return { outcome: 'guided-conflicting-evidence', reason: npmBlockers[0] }
  }
  if (npmVerification.verified === true) {
    return { outcome: 'guided-profile-unknown', reason: 'npm-release-verified-but-compatible-profile-is-unknown' }
  }
  const github = remoteCommands.some(command => command.source === 'github')
  const lifecycleScripts = inspection?.lifecycleScripts ?? []
  const hardLifecycle = lifecycleScripts.some(name => name !== 'prepare')
  const githubBlockers = reviewReasons.length > 0
    || plugin.install.requiresBuildApproval === true
    || plugin.install.manualSteps === true
  if (github
    && inspection?.runtimeArtifactsCommitted === true
    && !hardLifecycle
    && !lifecycleScripts.includes('prepare')
    && !githubBlockers) {
    return { outcome: 'automatic-github-candidate', reason: 'matching-command-and-committed-runtime' }
  }
  if (remoteCommands.some(command => command.source === 'npm')) {
    return { outcome: 'guided-npm-unverified', reason: npmVerification.reason }
  }
  if (github && (hardLifecycle || inspection?.runtimeArtifactsCommitted !== true || lifecycleScripts.includes('prepare'))) {
    return { outcome: 'guided-build-required', reason: 'github-source-requires-install-time-build-or-lifecycle-script' }
  }
  if (github && githubBlockers) {
    return { outcome: 'guided-conflicting-evidence', reason: reviewReasons[0] ?? 'author-or-policy-requires-manual-steps' }
  }
  if (remoteCommands.some(command => command.source === 'tarball')) {
    return { outcome: 'guided-tarball-unverified', reason: 'release-tarball-not-statically-verified' }
  }
  if (remoteCommands.length > 0) return { outcome: 'guided-unsupported-source', reason: 'no-verified-automatic-source' }
  return { outcome: 'guided-no-matching-remote-command', reason: 'readme-does-not-document-a-remote-install-for-this-package' }
}

/** Promote a second-pass exact npm proof so the same workflow converges. */
export function promoteExactNpm(plugin, stateRow, npmVerification) {
  if (npmVerification?.verified !== true || typeof npmVerification.spec !== 'string') {
    throw new Error('cannot promote an unverified npm release')
  }
  if (!Array.isArray(plugin.install?.profiles) || plugin.install.profiles.length === 0) {
    throw new Error('cannot promote npm release without compatible profiles')
  }
  // 晋级入口自身也校验人工限制，不能只依赖调用方过滤候选。
  const assessment = assessGuidedInstall(plugin, stateRow?.inspection, [], npmVerification)
  if (assessment.outcome !== 'automatic-npm-candidate') {
    throw new Error('cannot promote npm release with unresolved manual review: ' + assessment.reason)
  }
  const resolvedReasons = [...new Set([
    ...(Array.isArray(stateRow?.inspection?.resolvedReasons) ? stateRow.inspection.resolvedReasons : []),
    'exact-npm-tarball-verified-for-automatic-install',
    'guided-audit-second-pass-promoted-exact-npm-release',
  ])]
  const promotedPlugin = {
    ...plugin,
    install: {
      ...plugin.install,
      mode: 'automatic',
      source: 'npm',
      spec: npmVerification.spec,
      requiresBuildApproval: false,
      manualSteps: false,
    },
  }
  const promotedState = {
    ...stateRow,
    plugin: promotedPlugin,
    inspection: {
      ...stateRow.inspection,
      reviewReasons: [],
      resolvedReasons,
      npmRelease: npmVerification,
    },
  }
  return { plugin: promotedPlugin, stateRow: promotedState }
}

export function installReviewRowFromState(stateRow) {
  const inspection = stateRow.inspection
  return {
    repository: stateRow.repository,
    status: 'auto-resolved',
    mode: 'automatic',
    reasons: inspection.resolvedReasons,
    profiles: inspection.profiles,
    profileSource: inspection.profileSource,
    lifecycleScripts: inspection.lifecycleScripts,
    runtimeArtifactsCommitted: inspection.runtimeArtifactsCommitted,
    artifactGroups: inspection.artifactGroups,
    readme: inspection.readme,
    checkedAt: stateRow.checkedAt,
  }
}
