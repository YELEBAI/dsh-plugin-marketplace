/** Regression test for persisted bundle enable/disable semantics. */

import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { reconcileBundleName, toggleBundleName } from '../src/host/bundle-state.ts'
import { ensureProfile, mergeProfileDependency } from '../src/host/profile.ts'

const fixture = mkdtempSync(join(tmpdir(), 'mkt-profile-init-'))
try {
  const profile = join(fixture, 'web')
  ensureProfile(profile, 'web')
  const manifestPath = join(profile, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  assert.deepEqual(manifest.dsh.profile.bundles, ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app'], 'web 模板必须包含 Web 入口 Bundle')
  manifest.dependencies.fixture = '1.0.0'
  const customized = JSON.stringify(manifest)
  writeFileSync(manifestPath, customized)
  ensureProfile(profile, 'web')
  assert.equal(readFileSync(manifestPath, 'utf8'), customized, '初始化不得覆盖现有 Profile')
  const headless = join(fixture, 'headless')
  ensureProfile(headless, 'headless')
  assert.deepEqual(JSON.parse(readFileSync(join(headless, 'package.json'), 'utf8')).dsh.profile.bundles,
    ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-headless'], 'headless 模板必须包含无界面入口 Bundle')
  const custom = join(fixture, 'custom')
  ensureProfile(custom, 'unknown-template')
  assert.deepEqual(JSON.parse(readFileSync(join(custom, 'package.json'), 'utf8')).dsh.profile.bundles, ['@deepseek-ai/dsh-base'])
} finally {
  rmSync(fixture, { recursive: true, force: true })
}

assert.deepEqual(
  reconcileBundleName([], 'test-bundle', true, true, true, true),
  [],
  'an existing disabled bundle must remain disabled after update',
)
assert.deepEqual(
  reconcileBundleName([], 'another-bundle', false, false, true, true),
  ['another-bundle'],
  'a newly installed bundle must join the layer stack',
)
assert.deepEqual(
  reconcileBundleName([], 'late-bundle', true, false, true, true),
  ['late-bundle'],
  'an existing plain dependency that gains a bundle declaration must join the layer stack',
)
assert.deepEqual(toggleBundleName(['another-bundle'], 'test-bundle', true), ['another-bundle', 'test-bundle'])
assert.deepEqual(toggleBundleName(['another-bundle', 'test-bundle'], 'test-bundle', false), ['another-bundle'])
assert.deepEqual(toggleBundleName(['another-bundle'], 'another-bundle', true), ['another-bundle'])
assert.deepEqual(
  reconcileBundleName(['test-bundle'], 'test-bundle', true, true, false, false),
  [],
  'uninstalling a dependency must remove its bundle layer',
)

const latest = {
  name: 'profile',
  dependencies: { existing: '2.0.0', unrelated: '1.0.0' },
  dsh: { profile: { bundles: ['unrelated'] } },
}
assert.deepEqual(
  mergeProfileDependency(latest, 'target', 'file:../plugins/target'),
  {
    name: 'profile',
    dependencies: { existing: '2.0.0', unrelated: '1.0.0', target: 'file:../plugins/target' },
    dsh: { profile: { bundles: ['unrelated'] } },
  },
  'adding a dependency must preserve the latest unrelated dependencies and bundle choices',
)
assert.deepEqual(
  mergeProfileDependency(latest, 'existing', '1.0.0'),
  {
    name: 'profile',
    dependencies: { existing: '1.0.0', unrelated: '1.0.0' },
    dsh: { profile: { bundles: ['unrelated'] } },
  },
  'restoring a dependency must not replace the rest of the current manifest',
)

console.log('Profile bundle toggle tests passed')
