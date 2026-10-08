/** Regression tests for direct repository self-update metadata. */

import assert from 'node:assert/strict'
import { TYPERT } from '../src/wire.ts'
import type { MarketplaceInstalledEntry, MarketplacePluginDetails } from '../src/types.ts'
import {
  SELF_PACKAGE,
  SELF_REPOSITORY,
  applySelfUpdate,
  compareSemver,
  selfUpdateTarget,
  shouldRefreshSelfUpdate,
} from '../src/host/self-update.ts'

const commit = 'a'.repeat(40)
const details: MarketplacePluginDetails = {
  repo: SELF_REPOSITORY,
  ref: 'main',
  resolvedRef: commit,
  manifest: {
    name: SELF_PACKAGE,
    version: '0.5.0',
    description: '',
    license: 'MIT',
    bundlePatch: './cordis.patch.yml',
    hasClient: true,
  },
  patch: 'plugins:\n  marketplace: {}\n',
  readmeUrl: 'https://github.com/' + SELF_REPOSITORY + '#readme',
  rate: { limit: 5000, remaining: 4999, reset: 0, source: 'core' },
}
const installed: MarketplaceInstalledEntry = {
  packageName: SELF_PACKAGE,
  version: '0.4.0',
  isBundle: true,
  enabled: true,
  currentSpec: 'github:YELEBAI/dsh-plugin-marketplace#v0.4.0',
  registryRepo: null,
  availableVersion: null,
  availableVersionSource: null,
  verifiedCommit: null,
  updateAvailable: false,
  canUpdate: false,
  install: null,
}

const target = selfUpdateTarget(details)
const desktopTarget = selfUpdateTarget({ ...details, manifest: { ...details.manifest!, profiles: ['web', 'desktop'] } })
const detailsCodec = TYPERT.invocations.find(item => item.method === 'details')!.result.create()
const wireDetails = detailsCodec.parse({ ok: true, value: { ...details, manifest: { ...details.manifest, profiles: ['web', 'desktop'] } } }) as { value: { manifest: { profiles: string[] } } }
assert.deepEqual(wireDetails.value.manifest.profiles, ['web', 'desktop'], 'Profile 声明必须经过 Remote codec 完整传输')
assert.equal(applySelfUpdate(installed, desktopTarget, 'desktop').canUpdate, true)
assert.equal(applySelfUpdate(installed, target, 'desktop').canUpdate, false, '旧版自更新来源不能凭空声明桌面端支持')
assert.equal(target.install.spec, 'github:' + SELF_REPOSITORY + '#' + commit)
assert.equal(target.version, '0.5.0')
assert.deepEqual(applySelfUpdate(installed, target, 'web'), {
  ...installed,
  registryRepo: SELF_REPOSITORY,
  availableVersion: '0.5.0',
  availableVersionSource: 'repository',
  verifiedCommit: commit,
  updateAvailable: true,
  canUpdate: true,
  install: target.install,
})
const staleCurrentVersion = applySelfUpdate({ ...installed, version: '0.5.0' }, target, 'web')
assert.equal(staleCurrentVersion.updateAvailable, true)
assert.equal(staleCurrentVersion.availableVersion, null)
assert.equal(staleCurrentVersion.availableVersionSource, null)
const currentVersion = applySelfUpdate({
  ...installed,
  version: '0.5.0',
  currentSpec: 'github:' + SELF_REPOSITORY + '#' + commit,
}, target, 'web')
assert.equal(currentVersion.updateAvailable, false)
assert.equal(currentVersion.availableVersion, null)
assert.equal(currentVersion.availableVersionSource, null)
const currentArchive = applySelfUpdate({
  ...installed,
  version: '0.5.0',
  currentSpec: 'https://codeload.github.com/YELEBAI/dsh-plugin-marketplace/tar.gz/' + commit,
}, target, 'web')
assert.equal(currentArchive.updateAvailable, false)
const newerInstalledVersion = applySelfUpdate({ ...installed, version: '0.6.0' }, target, 'web')
assert.equal(newerInstalledVersion.updateAvailable, false)
assert.equal(newerInstalledVersion.availableVersion, null)
assert.equal(newerInstalledVersion.availableVersionSource, null)
assert.equal(applySelfUpdate(installed, target, 'headless').canUpdate, false)
assert.equal(compareSemver('1.0.0', '1.0.0-rc.1'), 1)
assert.equal(shouldRefreshSelfUpdate(false, true), false)
assert.equal(shouldRefreshSelfUpdate(true, false), false)
assert.equal(shouldRefreshSelfUpdate(true, true), true)
assert.throws(() => selfUpdateTarget({ ...details, resolvedRef: 'main' }))
assert.throws(() => selfUpdateTarget({ ...details, manifest: { ...details.manifest!, name: 'impostor' } }))

console.log('Direct repository self-update tests passed')
