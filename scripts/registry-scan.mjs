/** Discover `dsh-plugin` topic candidates and publish the verified Registry. */

import { readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  InvalidCandidateError,
  INSTALL_CLASSIFIER_VERSION,
  MAX_MANIFEST_BYTES,
  MAX_PATCH_BYTES,
  MAX_README_BYTES,
  RetryCandidateError,
  candidateFingerprint,
  classifyInstall,
  encodeRawPath,
  readmeGitHubRepositories,
  refreshPluginMetadata,
  inspectDshStdManifest,
  mergeInstallOverrides,
  preserveManualInstallRestriction,
  validateBundlePatch,
  validateManifest,
  verifiedPlugin,
} from './registry-core.mjs'
import { verifyExactNpmRelease } from './npm-release.mjs'
import { classifyPluginCategories, starGrowth7d, updateStarHistory } from './discovery-core.mjs'

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const token = process.env.GITHUB_TOKEN?.trim()
if (token === undefined || token === '') {
  throw new Error('GITHUB_TOKEN is required for the central Registry scan')
}

const apiHeaders = {
  accept: 'application/vnd.github+json',
  authorization: 'Bearer ' + token,
  'user-agent': 'dsh-plugin-registry',
  'x-github-api-version': '2022-11-28',
}
const rawHeaders = { 'user-agent': 'dsh-plugin-registry' }
const now = new Date().toISOString()
const MAX_RATE_WAIT_MS = 90_000
let apiPausedUntil = 0

const statePath = path.join(root, 'registry', 'state.json')
const pluginsPath = path.join(root, 'registry', 'plugins.json')
const rejectedPath = path.join(root, 'registry', 'rejected.json')
const installReviewPath = path.join(root, 'registry', 'install-review.json')
const discoveryPath = path.join(root, 'registry', 'discovery.json')
const denylistPath = path.join(root, 'policy', 'denylist.json')
const installOverridesPath = path.join(root, 'policy', 'install-overrides.json')

const previousState = await readJson(statePath)
const denylistDocument = await readJson(denylistPath)
const installOverridesDocument = await readJson(installOverridesPath)
const previous = plainObject(previousState.repositories) ? previousState.repositories : {}
const denylist = new Map((Array.isArray(denylistDocument.repositories) ? denylistDocument.repositories : []).map((entry) => {
  if (typeof entry === 'string') return [entry.toLocaleLowerCase(), 'manually blocked']
  if (plainObject(entry) && typeof entry.repo === 'string') {
    return [entry.repo.toLocaleLowerCase(), typeof entry.reason === 'string' ? entry.reason : 'manually blocked']
  }
  throw new Error('policy/denylist.json contains an invalid repository entry')
}))
const installOverrides = installOverrideMap(installOverridesDocument)

console.log('discovering repositories with topic:dsh-plugin')
const candidates = await discoverAll()
console.log('discovered ' + String(candidates.length) + ' candidate repositories')

const next = {}
let validated = 0
let reused = 0
let candidateIndex = 0
const workers = Math.min(6, candidates.length)
await Promise.all(Array.from({ length: workers }, async () => {
  for (;;) {
    const index = candidateIndex
    candidateIndex += 1
    if (index >= candidates.length) return
    await processCandidate(candidates[index])
  }
}))

async function processCandidate(candidate) {
  const key = candidate.full_name.toLocaleLowerCase()
  const installOverride = installOverrides.get(key)
  const fingerprint = candidateFingerprint(candidate, installOverride)
  const old = plainObject(previous[key]) ? previous[key] : undefined
  const blockedReason = denylist.get(key)
  if (blockedReason !== undefined) {
    next[key] = stateRow(candidate, fingerprint, 'blocked', blockedReason, old)
    return
  }
  const exactReusableInspection = old !== undefined && validInspection(old.inspection)
  const migratedReusableInspection = old !== undefined
    && sameRepositoryFingerprint(old.fingerprint, fingerprint)
    && migratableAutomaticInspection(old.inspection)
  if (old !== undefined
    && (sameFingerprint(old.fingerprint, fingerprint) || migratedReusableInspection)
    && old.status === 'verified'
    && plainObject(old.plugin)
    && old.plugin.install?.mode === 'automatic'
    && old.plugin.install?.source === 'github'
    && validInstallMetadata(old.plugin.install)
    && (exactReusableInspection || migratedReusableInspection)) {
    next[key] = {
      ...stateRow(candidate, fingerprint, 'verified', null, old),
      checkedAt: old.checkedAt,
      commit: old.commit,
      plugin: refreshPluginMetadata(old.plugin, candidate),
      inspection: migratedReusableInspection
        ? { ...old.inspection, classifierVersion: INSTALL_CLASSIFIER_VERSION }
        : old.inspection,
    }
    reused += 1
    return
  }
  if (old !== undefined && sameRepositoryFingerprint(old.fingerprint, fingerprint) && old.status === 'invalid') {
    next[key] = { ...stateRow(candidate, fingerprint, 'invalid', old.reason, old), checkedAt: old.checkedAt }
    reused += 1
    return
  }
  try {
    const result = await validateCandidate(candidate, installOverride)
    next[key] = {
      ...stateRow(candidate, fingerprint, 'verified', null, old),
      commit: result.commit,
      plugin: result.plugin,
      inspection: result.inspection,
    }
  } catch (error) {
    if (error instanceof InvalidCandidateError) {
      next[key] = stateRow(candidate, fingerprint, 'invalid', error.message, old)
    } else if (error instanceof RetryCandidateError) {
      // A temporary GitHub/npm failure must never unpublish a previously
      // verified plugin. Keep its last known-good immutable commit and old
      // fingerprint so the next daily run retries the new candidate state.
      if (old !== undefined && old.status === 'verified' && plainObject(old.plugin)) {
        const retained = preserveManualInstallRestriction(old.plugin, old.inspection, installOverride)
        next[key] = {
          ...stateRow(candidate, old.fingerprint, 'verified', null, old),
          checkedAt: old.checkedAt,
          commit: old.commit,
          plugin: refreshPluginMetadata(retained.plugin, candidate),
          inspection: retained.inspection,
          lastAttemptAt: now,
          lastAttemptReason: error.message,
        }
      } else {
        next[key] = stateRow(candidate, fingerprint, 'retry', error.message, old)
      }
    } else {
      throw error
    }
  }
  validated += 1
  if (validated % 25 === 0) console.log('validated ' + String(validated) + ' changed/new candidates')
}

for (const [key, value] of Object.entries(previous)) {
  if (next[key] !== undefined || !plainObject(value)) continue
  next[key] = { ...value, status: 'removed', reason: 'topic removed, repository archived, or repository deleted', checkedAt: now }
}

const plugins = Object.values(next)
  .filter(row => plainObject(row) && row.status === 'verified' && plainObject(row.plugin))
  .map(row => row.plugin)
  .sort((left, right) => left.fullName.localeCompare(right.fullName))
const rejected = Object.values(next)
  .filter(row => plainObject(row) && row.status !== 'verified')
  .map(row => ({
    repository: row.repository,
    status: row.status,
    reason: row.reason,
    checkedAt: row.checkedAt,
  }))
  .sort((left, right) => left.repository.localeCompare(right.repository))
const installReview = installReviewRows(next)
const discovery = Object.values(next)
  .filter(row => plainObject(row) && row.status === 'verified' && plainObject(row.plugin))
  .map(row => ({
    fullName: row.plugin.fullName,
    categories: classifyPluginCategories(row.plugin),
    starGrowth7d: integer(row.starGrowth7d),
  }))
  .sort((left, right) => left.fullName.localeCompare(right.fullName))
await atomicJson(statePath, { schemaVersion: 2, generatedAt: now, repositories: sortObject(next) })
await atomicJson(pluginsPath, { schemaVersion: 2, generatedAt: now, plugins })
await atomicJson(rejectedPath, { schemaVersion: 1, generatedAt: now, repositories: rejected })
await atomicJson(installReviewPath, { schemaVersion: 1, generatedAt: now, repositories: installReview })
await atomicJson(discoveryPath, { schemaVersion: 1, generatedAt: now, windowDays: 7, plugins: discovery })
console.log(
  'published ' + String(plugins.length) + ' verified plugins; '
  + String(rejected.length) + ' hidden; '
  + String(installReview.filter(row => row.status === 'needs-review').length) + ' install classifications need review; '
  + String(installReview.filter(row => row.status === 'auto-resolved').length) + ' guided-install false positives auto-resolved; '
  + 'reused ' + String(reused),
)

async function discoverAll() {
  const base = 'topic:dsh-plugin archived:false fork:false'
  const first = await searchPage(base, 1)
  if (first.totalCount <= 1000) return await remainingPages(base, first)
  const start = new Date(Date.UTC(2008, 0, 1))
  const end = new Date(Math.floor(Date.now() / 1000) * 1000)
  const partitions = await discoverRange(start, end)
  return dedupe(partitions.flat())
}

async function discoverRange(start, end) {
  const qualifier = ' created:' + timestamp(start) + '..' + timestamp(end)
  const query = 'topic:dsh-plugin archived:false fork:false' + qualifier
  const first = await searchPage(query, 1)
  if (first.totalCount <= 1000) return [await remainingPages(query, first)]
  const seconds = Math.floor((end.getTime() - start.getTime()) / 1000)
  if (seconds <= 0) throw new Error('More than 1,000 dsh-plugin candidates share creation second ' + timestamp(start))
  const leftSeconds = Math.floor(seconds / 2)
  const middle = new Date(start.getTime() + leftSeconds * 1000)
  const rightStart = new Date(middle.getTime() + 1000)
  const left = await discoverRange(start, middle)
  const right = await discoverRange(rightStart, end)
  return [...left, ...right]
}

async function remainingPages(query, first) {
  const pages = Math.ceil(first.totalCount / 100)
  const rows = [...first.items]
  for (let page = 2; page <= pages; page += 1) rows.push(...(await searchPage(query, page)).items)
  return dedupe(rows)
}

async function searchPage(query, page) {
  const url = new URL('https://api.github.com/search/repositories')
  url.searchParams.set('q', query)
  url.searchParams.set('sort', 'updated')
  url.searchParams.set('order', 'desc')
  url.searchParams.set('per_page', '100')
  url.searchParams.set('page', String(page))
  const response = await apiJson(url)
  const items = Array.isArray(response.items) ? response.items.filter(validCandidateSummary) : []
  return { totalCount: integer(response.total_count), items }
}

async function validateCandidate(candidate, installOverride) {
  const commitResponse = await apiJson(new URL(
    'https://api.github.com/repos/' + candidate.full_name + '/commits/' + encodeURIComponent(candidate.default_branch),
  ), true)
  const commit = commitResponse.sha
  if (typeof commit !== 'string' || !/^[0-9a-f]{40}$/i.test(commit)) {
    throw new RetryCandidateError('GitHub did not return the default-branch commit SHA')
  }
  const rawBase = 'https://raw.githubusercontent.com/' + candidate.full_name + '/' + commit + '/'
  const manifestText = await rawText(new URL(rawBase + 'package.json'), MAX_MANIFEST_BYTES, 'package.json')
  const identity = validateManifest(manifestText)
  const treeResponse = await apiJson(new URL(
    'https://api.github.com/repos/' + candidate.full_name + '/git/trees/' + commit + '?recursive=1',
  ), true)
  const treePaths = Array.isArray(treeResponse.tree)
    ? treeResponse.tree
      .filter(entry => plainObject(entry) && entry.type === 'blob' && typeof entry.path === 'string')
      .map(entry => entry.path)
    : []
  if (treeResponse.truncated === true) {
    const known = new Set(treePaths)
    for (const group of identity.installHints.runtimeEntryGroups) {
      for (const entryPath of group.paths) {
        if (!known.has(entryPath) && await rawExists(new URL(rawBase + encodeRawPath(entryPath)))) {
          treePaths.push(entryPath)
          known.add(entryPath)
        }
      }
    }
  }
  const readmePath = preferredReadme(treePaths)
  const readmeText = readmePath === null
    ? null
    : await optionalRawText(new URL(rawBase + encodeRawPath(readmePath)), MAX_README_BYTES, readmePath)
  let dshStd
  if (treePaths.includes('dsh-plugin.json')) {
    try {
      dshStd = inspectDshStdManifest(await rawText(new URL(rawBase + 'dsh-plugin.json'), MAX_MANIFEST_BYTES, 'dsh-plugin.json'))
    } catch (error) {
      if (error instanceof RetryCandidateError) throw error
      dshStd = {
        status: 'invalid',
        profile: 'tui-admission/0.15',
        issues: [messageOf(error)],
      }
    }
  }
  const verifiedGitHubRepositories = await verifiedReadmeRepositories(candidate, readmeText)
  const classification = classifyInstall(
    identity,
    candidate.full_name,
    treePaths,
    readmeText,
    verifiedGitHubRepositories,
  )
  if (dshStd !== undefined) classification.identity.dshStd = dshStd
  const patchText = await rawText(
    new URL(rawBase + encodeRawPath(classification.identity.bundlePatch)),
    MAX_PATCH_BYTES,
    classification.identity.bundlePatch,
  )
  validateBundlePatch(patchText, classification.identity.packageName)
  const githubPlugin = verifiedPlugin(candidate, commit, classification.identity, now)
  let npmRelease = null
  let discoveredNpmOverride
  let npmReviewReasons = []
  const policyReviewReasons = installOverride?.manualSteps === true
    ? ['registry-install-policy-requires-manual-steps']
    : []
  if (installOverride?.source === 'npm'
    || (installOverride?.source !== 'manual' && githubPlugin.install.mode === 'guided')) {
    npmRelease = await verifyExactNpmRelease(classification.identity)
    if (npmRelease.verified) {
      const profiles = classification.identity.installHints.profiles
      npmReviewReasons = relevantNpmReviewReasons(classification.inspection.reviewReasons)
      npmReviewReasons.push(...policyReviewReasons)
      if (profiles.length === 0) npmReviewReasons.push('npm-release-verified-but-compatible-profile-is-unknown')
      discoveredNpmOverride = {
        source: 'npm',
        spec: npmRelease.spec,
        profiles,
        requiresBuildApproval: false,
        manualSteps: npmReviewReasons.length > 0,
      }
    }
  }
  const effectiveOverride = mergeInstallOverrides(discoveredNpmOverride, installOverride)
  const npmResolved = npmRelease?.verified === true
    && npmReviewReasons.length === 0
  return {
    commit,
    plugin: verifiedPlugin(candidate, commit, classification.identity, now, effectiveOverride),
    inspection: {
      ...classification.inspection,
      readme: { ...classification.inspection.readme, path: readmePath },
      reviewReasons: npmRelease?.verified === true
        ? [...new Set(npmReviewReasons)]
        : [...new Set([...classification.inspection.reviewReasons, ...policyReviewReasons])],
      resolvedReasons: npmResolved
        ? [...classification.inspection.resolvedReasons, 'exact-npm-tarball-verified-for-automatic-install']
        : classification.inspection.resolvedReasons,
      npmRelease,
      treeTruncated: treeResponse.truncated === true,
    },
  }
}

function relevantNpmReviewReasons(reasons) {
  return reasons.filter(reason => reason === 'readme-profiles-conflict-with-dsh-marketplace-profiles'
    || reason === 'manifest-requires-manual-steps')
}

async function apiJson(url, candidateRequest = false) {
  for (let rateAttempt = 0; rateAttempt < 4; rateAttempt += 1) {
    try {
      await waitForApiWindow()
    } catch (error) {
      if (candidateRequest) throw new RetryCandidateError(messageOf(error))
      throw error
    }
    let response
    try {
      response = await fetchWithRetry(url, { headers: apiHeaders }, 3)
    } catch (error) {
      if (candidateRequest) throw new RetryCandidateError('GitHub API request failed: ' + messageOf(error))
      throw error
    }
    if (response.status === 401) throw new Error('GitHub rejected GITHUB_TOKEN')
    rememberApiWindow(response)
    if (response.status === 403 || response.status === 429) {
      const reset = response.headers.get('x-ratelimit-reset')
      const message = 'GitHub API rate limit reached' + (reset === null ? '' : '; reset epoch ' + reset)
      await response.body?.cancel()
      if (apiPausedUntil > Date.now() && apiPausedUntil - Date.now() <= MAX_RATE_WAIT_MS && rateAttempt < 3) {
        console.log(message + '; waiting before retry')
        continue
      }
      if (candidateRequest) throw new RetryCandidateError(message)
      throw new Error(message)
    }
    if (response.status === 404 && candidateRequest) throw new InvalidCandidateError('default branch has no readable commit')
    if (!response.ok) {
      const message = 'GitHub API returned HTTP ' + String(response.status)
      if (candidateRequest && response.status >= 500) throw new RetryCandidateError(message)
      if (candidateRequest) throw new InvalidCandidateError(message)
      throw new Error(message)
    }
    return await response.json()
  }
  throw new Error('GitHub API rate limit retry budget exhausted')
}

function rememberApiWindow(response) {
  const remaining = Number(response.headers.get('x-ratelimit-remaining'))
  const reset = Number(response.headers.get('x-ratelimit-reset'))
  if (remaining !== 0 || !Number.isFinite(reset)) return
  apiPausedUntil = Math.max(apiPausedUntil, reset * 1000 + 1_000)
}

async function waitForApiWindow() {
  const delay = apiPausedUntil - Date.now()
  if (delay <= 0) return
  if (delay > MAX_RATE_WAIT_MS) throw new Error('GitHub API rate-limit reset is too far in the future')
  await new Promise(resolve => setTimeout(resolve, delay))
}

async function rawText(url, maximum, label) {
  let response
  try {
    response = await fetchWithRetry(url, { headers: rawHeaders }, 2)
  } catch (error) {
    throw new RetryCandidateError('could not read ' + label + ': ' + messageOf(error))
  }
  if (response.status === 403 || response.status === 429) {
    throw new RetryCandidateError(label + ' was rate-limited by GitHub')
  }
  if (response.status === 404) throw new InvalidCandidateError(label + ' does not exist at the verified commit')
  if (response.status >= 500) throw new RetryCandidateError(label + ' returned HTTP ' + String(response.status))
  if (!response.ok) throw new InvalidCandidateError(label + ' returned HTTP ' + String(response.status))
  const declared = Number(response.headers.get('content-length') ?? '0')
  if (declared > maximum) throw new InvalidCandidateError(label + ' exceeds ' + String(maximum) + ' bytes')
  if (response.body === null) throw new RetryCandidateError(label + ' returned no response body')
  const reader = response.body.getReader()
  const chunks = []
  let length = 0
  for (;;) {
    const part = await reader.read()
    if (part.done) break
    length += part.value.byteLength
    if (length > maximum) {
      await reader.cancel()
      throw new InvalidCandidateError(label + ' exceeds ' + String(maximum) + ' bytes')
    }
    chunks.push(part.value)
  }
  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new InvalidCandidateError(label + ' is not valid UTF-8')
  }
}

async function optionalRawText(url, maximum, label) {
  try {
    return await rawText(url, maximum, label)
  } catch (error) {
    if (error instanceof InvalidCandidateError) return null
    throw error
  }
}

async function rawExists(url) {
  let response
  try {
    response = await fetchWithRetry(url, { headers: { ...rawHeaders, range: 'bytes=0-0' } }, 2)
  } catch (error) {
    throw new RetryCandidateError('could not probe runtime entry: ' + messageOf(error))
  }
  if (response.status === 404) return false
  if (response.status === 403 || response.status === 429 || response.status >= 500) {
    throw new RetryCandidateError('runtime entry probe returned HTTP ' + String(response.status))
  }
  await response.body?.cancel()
  return response.ok
}

async function verifiedReadmeRepositories(candidate, readmeText) {
  const verified = [candidate.full_name]
  if (readmeText === null) return verified
  const current = candidate.full_name.toLocaleLowerCase()
  const currentName = candidate.name.toLocaleLowerCase()
  for (const repository of readmeGitHubRepositories(readmeText)) {
    const normalized = repository.toLocaleLowerCase()
    if (normalized === current || repository.split('/')[1]?.toLocaleLowerCase() !== currentName) continue
    let response
    try {
      response = await fetchWithRetry(
        new URL('https://api.github.com/repos/' + repository),
        { headers: apiHeaders },
        2,
      )
    } catch (error) {
      throw new RetryCandidateError('could not verify README GitHub repository alias: ' + messageOf(error))
    }
    if (response.status === 404) continue
    if (response.status === 403 || response.status === 429 || response.status >= 500) {
      throw new RetryCandidateError('README GitHub repository alias returned HTTP ' + String(response.status))
    }
    if (!response.ok) continue
    const resolved = await response.json()
    if (plainObject(resolved) && resolved.id === candidate.id) verified.push(repository)
  }
  return verified
}

async function fetchWithRetry(url, options, attempts) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20_000) })
      if (response.status < 500 || attempt === attempts) return response
      await response.body?.cancel()
    } catch (error) {
      lastError = error
    }
    if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, 250 * (2 ** (attempt - 1))))
  }
  throw lastError
}

function stateRow(candidate, fingerprint, status, reason, old) {
  const stars = integer(candidate.stargazers_count)
  const starHistory = updateStarHistory(
    old?.starHistory,
    old?.plugin?.stars,
    previousState.generatedAt,
    stars,
    now,
  )
  return {
    repository: candidate.full_name,
    fingerprint,
    status,
    reason,
    checkedAt: now,
    starHistory,
    starGrowth7d: starGrowth7d(starHistory, stars),
  }
}

function validCandidateSummary(value) {
  return plainObject(value)
    && typeof value.full_name === 'string'
    && /^[\w.-]+\/[\w.-]+$/.test(value.full_name)
    && typeof value.name === 'string'
    && typeof value.default_branch === 'string'
    && value.default_branch !== ''
    && typeof value.html_url === 'string'
    && typeof value.pushed_at === 'string'
    && typeof value.updated_at === 'string'
}

function dedupe(rows) {
  return [...new Map(rows.map(row => [row.full_name.toLocaleLowerCase(), row])).values()]
    .sort((left, right) => left.full_name.localeCompare(right.full_name))
}

/** Accept the legacy two-line fingerprint once when no install override exists. */
function sameFingerprint(previousFingerprint, currentFingerprint) {
  if (typeof previousFingerprint !== 'string') return false
  const previousParts = previousFingerprint.split('\n')
  const currentParts = currentFingerprint.split('\n')
  if (previousParts.length === 2 && currentParts[2] === 'null') {
    return previousFingerprint === currentParts.slice(0, 2).join('\n')
  }
  return previousFingerprint === currentFingerprint
}

function sameRepositoryFingerprint(previousFingerprint, currentFingerprint) {
  if (typeof previousFingerprint !== 'string') return false
  return previousFingerprint.split('\n').slice(0, 3).join('\n') === currentFingerprint.split('\n').slice(0, 3).join('\n')
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

async function atomicJson(file, value) {
  const temporary = file + '.tmp'
  await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', 'utf8')
  await rename(temporary, file)
}

function sortObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)))
}

function timestamp(value) {
  return value.toISOString().replace('.000Z', 'Z')
}

function integer(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : 0
}

function plainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function validInstallMetadata(value) {
  return plainObject(value)
    && (value.mode === 'automatic' || value.mode === 'guided')
    && typeof value.spec === 'string'
    && Array.isArray(value.profiles)
    && typeof value.instructionsUrl === 'string'
}

function validInspection(value) {
  return plainObject(value)
    && value.classifierVersion === INSTALL_CLASSIFIER_VERSION
    && Array.isArray(value.profiles)
    && Array.isArray(value.artifactGroups)
    && Array.isArray(value.reviewReasons)
    && Array.isArray(value.resolvedReasons)
    && plainObject(value.readme)
}

/**
 * Classifier v11 only changes lifecycle handling. An unchanged automatic
 * GitHub row with no lifecycle scripts can be upgraded in place, avoiding a
 * full Registry re-fetch; rows containing prepare/install hooks are rechecked.
 */
function migratableAutomaticInspection(value) {
  return plainObject(value)
    && value.classifierVersion === 10
    && Array.isArray(value.lifecycleScripts)
    && value.lifecycleScripts.length === 0
    && Array.isArray(value.profiles)
    && Array.isArray(value.artifactGroups)
    && Array.isArray(value.reviewReasons)
    && Array.isArray(value.resolvedReasons)
    && plainObject(value.readme)
}

function preferredReadme(paths) {
  const roots = paths.filter(value => typeof value === 'string' && !value.includes('/') && /^readme(?:\.[\w-]+)*$/i.test(value))
  roots.sort((left, right) => {
    const rank = value => /^readme\.md$/i.test(value) ? 0 : /\.md$/i.test(value) ? 1 : 2
    return rank(left) - rank(right) || left.localeCompare(right)
  })
  return roots[0] ?? null
}

function installReviewRows(state) {
  const rows = []
  for (const row of Object.values(state)) {
    if (!plainObject(row) || row.status !== 'verified' || !plainObject(row.plugin) || !validInspection(row.inspection)) continue
    const inspection = row.inspection
    if (inspection.reviewReasons.length > 0) {
      rows.push(reviewRow(row, 'needs-review', inspection.reviewReasons))
    } else if (row.plugin.install.mode === 'automatic' && inspection.resolvedReasons.length > 0) {
      rows.push(reviewRow(row, 'auto-resolved', inspection.resolvedReasons))
    }
  }
  return rows.sort((left, right) => left.repository.localeCompare(right.repository))
}

function reviewRow(row, status, reasons) {
  return {
    repository: row.repository,
    status,
    mode: row.plugin.install.mode,
    reasons,
    profiles: row.inspection.profiles,
    profileSource: row.inspection.profileSource,
    lifecycleScripts: row.inspection.lifecycleScripts,
    runtimeArtifactsCommitted: row.inspection.runtimeArtifactsCommitted,
    artifactGroups: row.inspection.artifactGroups,
    readme: row.inspection.readme,
    checkedAt: row.checkedAt,
  }
}

function installOverrideMap(document) {
  if (!plainObject(document) || document.schemaVersion !== 1 || !plainObject(document.repositories)) {
    throw new Error('policy/install-overrides.json has an invalid root object')
  }
  const result = new Map()
  for (const [repo, value] of Object.entries(document.repositories)) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo) || !plainObject(value)) {
      throw new Error('invalid install override for ' + repo)
    }
    const allowed = new Set(['source', 'spec', 'profiles', 'requiresBuildApproval', 'requiresRestart', 'manualSteps', 'instructionsUrl'])
    if (Object.keys(value).some(key => !allowed.has(key))) throw new Error('unknown install override field for ' + repo)
    if (value.source !== undefined && !['github', 'npm', 'tarball', 'manual'].includes(value.source)) throw new Error('invalid install source for ' + repo)
    if (value.spec !== undefined && typeof value.spec !== 'string') throw new Error('invalid install spec for ' + repo)
    if (value.profiles !== undefined && (!Array.isArray(value.profiles) || value.profiles.some(profile => typeof profile !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,63}$/.test(profile)))) {
      throw new Error('invalid install profiles for ' + repo)
    }
    for (const field of ['requiresBuildApproval', 'requiresRestart', 'manualSteps']) {
      if (value[field] !== undefined && typeof value[field] !== 'boolean') throw new Error('invalid ' + field + ' for ' + repo)
    }
    if (value.instructionsUrl !== undefined) {
      if (typeof value.instructionsUrl !== 'string' || new URL(value.instructionsUrl).protocol !== 'https:') throw new Error('invalid instructionsUrl for ' + repo)
    }
    result.set(repo.toLocaleLowerCase(), value)
  }
  return result
}

function messageOf(error) {
  return error instanceof Error ? error.message : String(error)
}
