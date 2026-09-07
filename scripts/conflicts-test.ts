/** Unit tests for the heuristic conflict diagnostics.
 *  Run: node --experimental-strip-types scripts/conflicts-test.ts
 *  Covers PR notes §14 items 10–11 (duplicate ids, service collisions,
 *  existing vs introduced conflicts, aggregate/embedded subpackages) and the
 *  patch-row / service-name extraction forms.
 */

import { strict as assert } from 'node:assert'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { ProfileManifest } from '@deepseek-ai/dsh-app-boot'
import {
  computeConflicts,
  conflictIdentity,
  extractPatchRows,
  extractServiceNames,
  packageEntryPath,
  stagedInstallConflict,
} from '../src/host/conflicts.ts'

let passed = 0
function ok(name: string, fn: () => void): void {
  fn()
  passed += 1
  console.log('ok - ' + name)
}

function makePlugin(
  root: string,
  name: string,
  opts: { id: string; services?: string[]; exports?: unknown; patch?: string },
): void {
  const dir = join(root, 'node_modules', ...name.split('/'))
  mkdirSync(join(dir, 'lib'), { recursive: true })
  writeFileSync(join(dir, 'package.json'), JSON.stringify({
    name,
    version: '1.0.0',
    description: name + ' description',
    dsh: { bundle: { patch: './cordis.patch.yml' } },
    // 常见的包导出不会包含 ./package.json；冲突扫描仍需读取清单和入口。
    exports: opts.exports ?? { '.': './lib/index.js' },
  }))
  writeFileSync(join(dir, 'cordis.patch.yml'), opts.patch ?? [
    '- insert:',
    '    - id: ' + opts.id,
    '      name: ' + name,
    '',
  ].join('\n'))
  writeFileSync(join(dir, 'lib', 'index.js'), (opts.services ?? []).map(service => `ctx.provide('${service}', 1);\n`).join(''))
}

function makeManifest(bundles: string[]): ProfileManifest {
  return { name: 'test-profile', private: true, dsh: { profile: { bundles } } } as ProfileManifest
}

const tmp = mkdtempSync(join(tmpdir(), 'mkt-conflicts-test-'))
try {
  // ── extractPatchRows ──────────────────────────────────────────────────
  const rows = extractPatchRows([
    '- insert:',
    '    - id: pet',
    '      name: whale-girl',
    '- insert:',
    '    - id: tools',
    '      name: @deepseek-ai/dsh-tools',
    '    - id: tools-inner',
    '',
  ].join('\n'))
  ok('extractPatchRows collects id/name pairs across insert blocks', () => {
    assert.deepEqual(rows, [
      { id: 'pet', name: 'whale-girl' },
      { id: 'tools', name: '@deepseek-ai/dsh-tools' },
      { id: 'tools-inner', name: 'tools-inner' },
    ])
  })
  ok('extractPatchRows ignores quoted scalars and trailing comments', () => {
    const quoted = extractPatchRows('- insert:\n    - id: "a-b"\n      name: \'x\' # note\n')
    assert.deepEqual(quoted, [{ id: 'a-b', name: 'x' }])
  })

  // ── extractServiceNames ───────────────────────────────────────────────
  const source = [
    "ctx.provide('svc-a', value)",
    "ctx.provide(\"svc-b\", value)",
    "super(ctx, 'svc-c')",
    "ctx['svc-d'] = value",
    'ctx.customField = value',
    'ctx.logger = value', // reserved — must not count
    'ctx.provide = value', // reserved assignment — must not count
  ].join('\n')
  ok('extractServiceNames covers the documented registration forms', () => {
    assert.deepEqual(
      [...extractServiceNames(source)].sort(),
      ['customField', 'svc-a', 'svc-b', 'svc-c', 'svc-d'],
    )
  })

  // ── computeConflicts ──────────────────────────────────────────────────
  makePlugin(tmp, 'pkg-a', { id: 'bundle-x', services: ['pet'] })
  makePlugin(tmp, 'pkg-b', { id: 'bundle-x', services: ['pet'] })
  makePlugin(tmp, 'pkg-c', { id: 'bundle-y', services: ['tools'] })

  const both = computeConflicts(makeManifest(['pkg-a', 'pkg-b']), tmp)
  ok('duplicate bundle id detected', () => {
    const dup = both.find(conflict => conflict.kind === 'duplicate-id')
    assert.ok(dup !== undefined)
    assert.equal(dup.kind === 'duplicate-id' && dup.id, 'bundle-x')
    assert.deepEqual(dup?.packages, ['pkg-a', 'pkg-b'])
  })
  ok('duplicate service detected', () => {
    const svc = both.find(conflict => conflict.kind === 'service')
    assert.ok(svc !== undefined)
    assert.equal(svc.kind === 'service' && svc.service, 'pet')
    assert.deepEqual(svc?.packages, ['pkg-a', 'pkg-b'])
  })

  const none = computeConflicts(makeManifest(['pkg-a', 'pkg-c']), tmp)
  ok('no conflicts when ids and services are disjoint', () => assert.equal(none.length, 0))

  // Existing vs introduced conflict identity.
  const beforeKeys = new Set(computeConflicts(makeManifest(['pkg-a', 'pkg-c']), tmp).map(conflictIdentity))
  const afterKeys = new Set(computeConflicts(makeManifest(['pkg-a', 'pkg-b', 'pkg-c']), tmp).map(conflictIdentity))
  const introduced = [...afterKeys].filter(key => !beforeKeys.has(key))
  ok('enable gate can isolate introduced conflicts', () => {
    assert.equal(introduced.length, 2)
    assert.ok(introduced.some(key => key.startsWith('duplicate-id:bundle-x:')))
    assert.ok(introduced.some(key => key.startsWith('service:pet:')))
  })

  // ── packageEntryPath resolution forms ─────────────────────────────────
  ok('packageEntryPath resolves exports[.].default', () => {
    const dir = join(tmp, 'node_modules', 'pkg-c')
    const entry = packageEntryPath('pkg-c', tmp)
    assert.equal(entry, join(dir, 'lib', 'index.js'))
  })
  const mainOnly = join(tmp, 'node_modules', 'pkg-main')
  mkdirSync(join(mainOnly, 'src'), { recursive: true })
  writeFileSync(join(mainOnly, 'package.json'), JSON.stringify({
    name: 'pkg-main',
    version: '1.0.0',
    main: './src/entry.js',
  }))
  writeFileSync(join(mainOnly, 'src', 'entry.js'), 'ctx.provide("m", 1);\n')
  ok('packageEntryPath falls back to main', () => {
    assert.equal(packageEntryPath('pkg-main', tmp), join(mainOnly, 'src', 'entry.js'))
  })

  // ── stagedInstallConflict (aggregate/embedded subpackages) ────────────
  const candidate = join(tmp, 'candidate')
  // The candidate's patch rows name an embedded subpackage that lives in the
  // candidate's own node_modules (aggregate-plugin pattern).
  makePlugin(candidate, 'inner-agg', {
    id: 'inner-agg-id',
    services: ['pet'],
  })
  writeFileSync(join(candidate, 'package.json'), JSON.stringify({
    name: 'agg-plugin',
    version: '1.0.0',
    dsh: { bundle: { patch: './cordis.patch.yml' } },
    exports: { '.': './lib/index.js', './package.json': './package.json' },
  }))
  mkdirSync(join(candidate, 'lib'), { recursive: true })
  writeFileSync(join(candidate, 'lib', 'index.js'), '')
  writeFileSync(join(candidate, 'cordis.patch.yml'), [
    '- insert:',
    '    - id: inner-agg-id',
    '      name: inner-agg',
    '',
  ].join('\n'))

  const blocked = stagedInstallConflict('agg-plugin', candidate, makeManifest(['pkg-a']), tmp)
  ok('staged install blocked when embedded subpackage collides with enabled bundle', () => {
    assert.ok(blocked !== null)
    assert.equal(blocked?.kind, 'service')
    assert.ok(blocked?.message.includes('pet'))
  })

  const clean = stagedInstallConflict('agg-plugin', candidate, makeManifest(['pkg-c']), tmp)
  ok('staged install allowed when no collision', () => assert.equal(clean, null))
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log('conflicts tests passed: ' + passed)
