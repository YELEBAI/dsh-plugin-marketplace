/** Validate the built artifacts against the real DSH loaders.
 *  node scripts/verify.mjs
 *  1. lib/typert.js must pass @deepseek-ai/dsh-typert-loader's manifest
 *     validation (bundled straight from the checkout source).
 *  2. lib/client.js must be a __ModuleLoader__ factory whose bare
 *     requires only name platform modules.
 */
import { createRequire } from 'node:module'
import { existsSync, readdirSync, readFileSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { assertPackageContract } from './package-contract.mjs'

const require = createRequire(import.meta.url)
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const checkout = process.env.DSH_CHECKOUT ?? 'D:/DSH/deepseek-harness'
const registryOnly = process.argv.includes('--registry-only')
/** Resolve esbuild from the checkout's pnpm store (newest version wins). */
function resolveEsbuild(checkout) {
  const pnpmDir = path.join(checkout, 'node_modules', '.pnpm')
  const candidates = readdirSync(pnpmDir).filter((name) => name.startsWith('esbuild@')).sort().reverse()
  for (const name of candidates) {
    const main = path.join(pnpmDir, name, 'node_modules', 'esbuild', 'lib', 'main.js')
    if (existsSync(main)) return main
  }
  throw new Error('esbuild not found under ' + pnpmDir)
}

const esbuild = registryOnly ? undefined : require(resolveEsbuild(checkout))

const PKG = 'dsh-plugin-marketplace'

// ── 1. typert manifest validation (the exact loader code path) ────────────
if (!registryOnly) {
const manifestUrl = pathToFileURL(path.join(root, 'lib', 'typert.js')).href
const entry = `
import { validateTypertManifest } from '@deepseek-ai/dsh-typert-loader'
const mod = await import('${manifestUrl}')
const result = validateTypertManifest('${PKG}', mod.TYPERT)
console.log('typert manifest valid: ' + result.invocations.length + ' invocations, package ' + result.package)
`
const probePath = path.join(root, 'lib', 'verify.probe.mjs')
await esbuild.build({
  stdin: { contents: entry, resolveDir: path.join(checkout, 'packages', 'typert', 'loader', 'src'), sourcefile: 'verify-probe.ts' },
  bundle: true,
  // The probe is standalone and must not inherit this repository's local,
  // machine-specific tsconfig path when verification runs in CI.
  tsconfigRaw: { compilerOptions: {} },
  external: [manifestUrl],
  platform: 'node',
  format: 'esm',
  target: 'es2024',
  outfile: probePath,
})
try {
  await import(pathToFileURL(probePath).href)
} finally {
  if (existsSync(probePath)) unlinkSync(probePath)
}
}

// ── 2. client bundle shape ────────────────────────────────────────────────
const client = readFileSync(path.join(root, 'lib', 'client.js'), 'utf8')
if (!client.startsWith('window.__ModuleLoader__.load({ id: "' + PKG + '"')) {
  throw new Error('client bundle banner mismatch')
}
const requires = [...client.matchAll(/require\("([^"]+)"\)/g)].map((m) => m[1])
const allowed = new Set([
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client',
  '@deepseek-ai/cordis', '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react', '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment', '@deepseek-ai/dsh-client-schema-form',
  '@deepseek-ai/dsh-client-runtime/client',
])
for (const spec of requires) {
  if (!allowed.has(spec)) throw new Error('client bundle requires non-platform module: ' + spec)
}
console.log('client bundle shape valid: ' + requires.length + ' external require sites, all platform modules')

// ── 3. package manifest contract ──────────────────────────────────────────
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
assertPackageContract(pkg, file => {
  const target = path.join(root, file)
  return existsSync(target) ? readFileSync(target, 'utf8') : undefined
})
if (pkg.dsh?.bundle?.patch !== './cordis.patch.yml') throw new Error('dsh.bundle.patch missing')
if (pkg.dsh?.client?.platform !== 'web') throw new Error('dsh.client.platform must be web')
if (pkg.exports?.['./client'] === undefined) throw new Error('./client export missing')
if (pkg.exports?.['./typert'] === undefined) throw new Error('./typert export missing')
if (!pkg.files?.includes('skills/**')) throw new Error('packaged Skill files missing from package manifest')
const installSkill = readFileSync(path.join(root, 'skills', 'install-dsh-plugin', 'SKILL.md'), 'utf8')
if (!installSkill.startsWith('---\nname: install-dsh-plugin\n')
  || installSkill.includes('[TODO')
  || !installSkill.includes('marketplace Agent Workspace')) {
  throw new Error('install-dsh-plugin Skill contract invalid')
}
console.log('package manifest contract valid')

// Bundled central Registry contract.
const registry = JSON.parse(readFileSync(path.join(root, 'registry', 'plugins.json'), 'utf8'))
if (registry.schemaVersion !== 2 || Number.isNaN(Date.parse(registry.generatedAt)) || !Array.isArray(registry.plugins)) {
  throw new Error('bundled Registry root contract invalid')
}
const registryNames = new Set()
for (const plugin of registry.plugins) {
  if (plugin === null || typeof plugin !== 'object') throw new Error('Registry plugin row must be an object')
  const key = typeof plugin.fullName === 'string' ? plugin.fullName.toLowerCase() : ''
  if (!/^[\w.-]+\/[\w.-]+$/.test(key)) throw new Error('Registry fullName invalid')
  if (registryNames.has(key)) throw new Error('Registry repeats repository ' + plugin.fullName)
  registryNames.add(key)
  if (!/^[0-9a-f]{40}$/i.test(plugin.verifiedCommit ?? '')) throw new Error('Registry commit invalid: ' + plugin.fullName)
  if (typeof plugin.packageName !== 'string' || plugin.packageName === '') throw new Error('Registry packageName missing')
  if (typeof plugin.bundlePatch !== 'string' || plugin.bundlePatch === '') throw new Error('Registry bundlePatch missing')
  if (Number.isNaN(Date.parse(plugin.verifiedAt))) throw new Error('Registry verifiedAt invalid')
  if (plugin.install === null || typeof plugin.install !== 'object') throw new Error('Registry install metadata missing')
  if (!['automatic', 'guided'].includes(plugin.install.mode)) throw new Error('Registry install mode invalid')
  if (!Array.isArray(plugin.install.profiles)) throw new Error('Registry install profiles invalid')
  if (plugin.install.mode === 'automatic') {
    const github = 'github:' + plugin.fullName + '#' + plugin.verifiedCommit
    const npm = plugin.packageName + '@' + plugin.version
    const exact = (plugin.install.source === 'github' && plugin.install.spec.toLowerCase() === github.toLowerCase())
      || (plugin.install.source === 'npm' && plugin.install.spec === npm)
    if (!exact) {
      throw new Error('automatic Registry install is not pinned to an exact verified source: ' + plugin.fullName)
    }
  }
}
console.log('bundled Registry contract valid: ' + registry.plugins.length + ' verified plugins')

// Discovery metadata is a separate sidecar so older strict v2 clients keep
// accepting plugins.json while newer clients gain categories and trends.
const discovery = JSON.parse(readFileSync(path.join(root, 'registry', 'discovery.json'), 'utf8'))
if (
  discovery.schemaVersion !== 1 ||
  discovery.windowDays !== 7 ||
  Number.isNaN(Date.parse(discovery.generatedAt)) ||
  !Array.isArray(discovery.plugins)
) {
  throw new Error('bundled discovery metadata root contract invalid')
}
const categoryNames = new Set([
  'ui', 'agents', 'developer-tools', 'models', 'data',
  'integrations', 'media', 'security', 'observability', 'other',
])
const discoveryNames = new Set()
for (const row of discovery.plugins) {
  const key = typeof row?.fullName === 'string' ? row.fullName.toLowerCase() : ''
  if (!registryNames.has(key)) throw new Error('discovery metadata references an unpublished repository: ' + row?.fullName)
  if (discoveryNames.has(key)) throw new Error('discovery metadata repeats repository ' + row.fullName)
  discoveryNames.add(key)
  if (
    !Array.isArray(row.categories) ||
    row.categories.length < 1 ||
    row.categories.length > 3 ||
    new Set(row.categories).size !== row.categories.length ||
    row.categories.some(category => !categoryNames.has(category))
  ) {
    throw new Error('discovery categories invalid: ' + row.fullName)
  }
  if (!Number.isInteger(row.starGrowth7d) || row.starGrowth7d < 0) {
    throw new Error('discovery Star growth invalid: ' + row.fullName)
  }
}
if (discoveryNames.size !== registryNames.size) throw new Error('discovery metadata does not cover every Registry plugin')
console.log('discovery metadata valid: ' + discovery.plugins.length + ' categorized plugins')

// Install-classification audit. Ambiguous repositories stay guided until their
// evidence changes; auto-resolved rows document conservative false positives
// that the current classifier was able to prove safe to install from GitHub.
const installReview = JSON.parse(readFileSync(path.join(root, 'registry', 'install-review.json'), 'utf8'))
if (
  installReview.schemaVersion !== 1 ||
  Number.isNaN(Date.parse(installReview.generatedAt)) ||
  !Array.isArray(installReview.repositories)
) {
  throw new Error('install review root contract invalid')
}
const reviewNames = new Set()
for (const row of installReview.repositories) {
  const key = typeof row?.repository === 'string' ? row.repository.toLowerCase() : ''
  if (!registryNames.has(key)) throw new Error('install review references an unpublished repository: ' + row?.repository)
  if (reviewNames.has(key)) throw new Error('install review repeats repository ' + row.repository)
  reviewNames.add(key)
  if (!['needs-review', 'auto-resolved'].includes(row.status)) throw new Error('install review status invalid')
  if (!Array.isArray(row.reasons) || row.reasons.length === 0) throw new Error('install review reasons missing')
  if (row.status === 'needs-review' && row.mode !== 'guided') throw new Error('needs-review repository must remain guided')
  if (row.status === 'auto-resolved' && row.mode !== 'automatic') throw new Error('auto-resolved repository must be automatic')
  if (
    !Array.isArray(row.artifactGroups) ||
    typeof row.readme?.found !== 'boolean' ||
    !Array.isArray(row.readme.verifiedGitHubRepositories) ||
    !Array.isArray(row.readme.unverifiedGitHubRepositories)
  ) {
    throw new Error('install review evidence missing: ' + row.repository)
  }
}
console.log('install review contract valid: ' + installReview.repositories.length + ' audited classifications')

// Every remaining guided row must have a fresh, inspectable audit outcome.
const guidedAudit = JSON.parse(readFileSync(path.join(root, 'registry', 'guided-audit.json'), 'utf8'))
if (
  guidedAudit.schemaVersion !== 1 ||
  Number.isNaN(Date.parse(guidedAudit.generatedAt)) ||
  !Array.isArray(guidedAudit.rows) ||
  guidedAudit.total !== guidedAudit.rows.length
) {
  throw new Error('guided audit root contract invalid')
}
const guidedNames = new Set(
  registry.plugins.filter(plugin => plugin.install.mode === 'guided').map(plugin => plugin.fullName.toLowerCase()),
)
const auditedGuidedNames = new Set()
for (const row of guidedAudit.rows) {
  const key = typeof row?.repository === 'string' ? row.repository.toLowerCase() : ''
  if (!guidedNames.has(key)) throw new Error('guided audit references a non-guided repository: ' + row?.repository)
  if (auditedGuidedNames.has(key)) throw new Error('guided audit repeats repository ' + row.repository)
  auditedGuidedNames.add(key)
  if (typeof row?.npmVerification?.verified !== 'boolean' || typeof row?.npmVerification?.reason !== 'string') {
    throw new Error('guided audit npm evidence missing: ' + row.repository)
  }
  if (typeof row?.assessment?.outcome !== 'string' || row.assessment.outcome.startsWith('automatic-')) {
    throw new Error('guided audit still contains an automatic-install candidate: ' + row.repository)
  }
}
if (auditedGuidedNames.size !== guidedNames.size) throw new Error('guided audit does not cover every guided Registry row')
const groupedTotal = Object.values(guidedAudit.groups ?? {}).reduce((sum, value) => sum + value, 0)
if (groupedTotal !== guidedAudit.total) throw new Error('guided audit group totals do not match')
console.log('guided audit contract valid: ' + guidedAudit.total + ' remaining guided classifications; zero automatic candidates')

console.log('VERIFY OK')
