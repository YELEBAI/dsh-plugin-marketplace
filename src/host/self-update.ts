/** Direct repository update metadata for the marketplace plugin itself. */

import type {
  MarketplaceInstalledEntry,
  MarketplaceInstallMetadata,
  MarketplacePluginDetails,
} from '../types.ts'

export const SELF_PACKAGE = 'dsh-plugin-marketplace'
export const SELF_REPOSITORY = 'YELEBAI/dsh-plugin-marketplace'
export const SELF_BRANCH = 'main'
const SELF_PATCH = './cordis.patch.yml'

export interface SelfUpdateTarget {
  fullName: string
  packageName: string
  version: string
  bundlePatch: string
  verifiedCommit: string
  install: MarketplaceInstallMetadata
}

/** Only an explicit refresh may put live GitHub I/O on the installed-list path. */
export function shouldRefreshSelfUpdate(explicitRefresh: boolean, installed: boolean): boolean {
  return explicitRefresh && installed
}

/** Turn one live default-branch read into an exact, immutable update target. */
export function selfUpdateTarget(details: MarketplacePluginDetails): SelfUpdateTarget {
  const manifest = details.manifest
  if (details.repo.toLocaleLowerCase() !== SELF_REPOSITORY.toLocaleLowerCase()
    || manifest === null
    || manifest.name !== SELF_PACKAGE
    || manifest.version === ''
    || manifest.bundlePatch !== SELF_PATCH
    || manifest.hasClient !== true
    || details.patch === null
    || !/^[0-9a-f]{40}$/i.test(details.resolvedRef)) {
    throw new Error('The marketplace repository no longer matches its self-update identity.')
  }
  const commit = details.resolvedRef
  return {
    fullName: SELF_REPOSITORY,
    packageName: SELF_PACKAGE,
    version: manifest.version,
    bundlePatch: SELF_PATCH,
    verifiedCommit: commit,
    install: {
      mode: 'automatic',
      source: 'github',
      spec: 'github:' + SELF_REPOSITORY + '#' + commit,
      profiles: manifest.profiles ?? ['web'],
      requiresBuildApproval: false,
      requiresRestart: true,
      manualSteps: false,
      instructionsUrl: 'https://github.com/' + SELF_REPOSITORY + '#readme',
    },
  }
}

/** Decorate the installed row, including a newer verified commit at the same version. */
export function applySelfUpdate(
  entry: MarketplaceInstalledEntry,
  target: SelfUpdateTarget,
  profile: string,
): MarketplaceInstalledEntry {
  const versionOrder = compareSemver(target.version, entry.version)
  const commitChanged = versionOrder === 0
    && isGitHubSpec(entry.currentSpec)
    && !entry.currentSpec.toLocaleLowerCase().includes(target.verifiedCommit.toLocaleLowerCase())
  return {
    ...entry,
    registryRepo: target.fullName,
    availableVersion: versionOrder > 0 ? target.version : null,
    availableVersionSource: versionOrder > 0 ? 'repository' : null,
    verifiedCommit: target.verifiedCommit,
    updateAvailable: versionOrder > 0 || commitChanged,
    canUpdate: target.install.profiles.includes(profile),
    install: target.install,
  }
}

function isGitHubSpec(value: string): boolean {
  return /^(?:github:|git\+https:\/\/github\.com\/|https:\/\/(?:github\.com|codeload\.github\.com)\/)/i.test(value)
}

/** Compare semver values without introducing a runtime dependency. */
export function compareSemver(left: string, right: string): number {
  const parse = (value: string): { core: [number, number, number]; prerelease: string[] } | null => {
    const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(value)
    if (match === null) return null
    return {
      core: [Number(match[1]), Number(match[2]), Number(match[3])],
      prerelease: match[4]?.split('.') ?? [],
    }
  }
  const a = parse(left)
  const b = parse(right)
  if (a === null || b === null) return left === right ? 0 : -1
  for (let index = 0; index < 3; index += 1) {
    const av = a.core[index]!
    const bv = b.core[index]!
    if (av !== bv) return av > bv ? 1 : -1
  }
  if (a.prerelease.length === 0 || b.prerelease.length === 0) {
    if (a.prerelease.length === b.prerelease.length) return 0
    return a.prerelease.length === 0 ? 1 : -1
  }
  const maximum = Math.max(a.prerelease.length, b.prerelease.length)
  for (let index = 0; index < maximum; index += 1) {
    const av = a.prerelease[index]
    const bv = b.prerelease[index]
    if (av === undefined || bv === undefined) return av === undefined ? -1 : 1
    if (av === bv) continue
    const an = /^\d+$/.test(av)
    const bn = /^\d+$/.test(bv)
    if (an && bn) return Number(av) > Number(bv) ? 1 : -1
    if (an !== bn) return an ? -1 : 1
    return av.localeCompare(bv) > 0 ? 1 : -1
  }
  return 0
}
