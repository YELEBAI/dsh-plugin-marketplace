/** Heuristic static diagnostics for plugin activation conflicts.
 *  Detects duplicate bundle ids and duplicate Cordis service names across the
 *  enabled bundle layer by scanning cordis.patch.yml insert rows and the Host
 *  entry source of each package. This is deliberately heuristic: it does not
 *  execute JavaScript or build a full Cordis configuration tree, so results
 *  are a pre-flight guard, not a runtime guarantee.
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { ProfileManifest } from '@deepseek-ai/dsh-app-boot'
import type { MarketplaceConflict, MarketplaceConflictProvider } from '../types.ts'
import { packageManifestPath } from './profile.ts'

/** Cordis Context fields that must never count as `ctx.foo =` service provides. */
const CORDIS_CTX_RESERVED = new Set([
  'baseDir', 'collect', 'config', 'dispose', 'effect', 'extend', 'fork',
  'get', 'inject', 'isolate', 'logger', 'main', 'mix', 'name', 'off', 'on',
  'once', 'parallel', 'plugin', 'provide', 'root', 'scope', 'serial', 'set',
  'update', 'waterfall', 'internal',
])

export function readSourceText(path: string, maxChars = 262144): string {
  try {
    return readFileSync(path, 'utf8').slice(0, maxChars)
  } catch {
    return ''
  }
}

/** Extract Cordis service names a plugin provides, from its entry source. */
export function extractServiceNames(source: string): string[] {
  const names = new Set<string>()
  for (const match of source.matchAll(/ctx\.provide\(\s*["']([^"']+)["']/g)) names.add(match[1]!)
  for (const match of source.matchAll(/super\(\s*ctx\s*,\s*["']([^"']+)["']/g)) names.add(match[1]!)
  for (const match of source.matchAll(/ctx\[\s*["']([^"']+)["']\s*\]\s*=(?!=)/g)) names.add(match[1]!)
  for (const match of source.matchAll(/ctx\.(\w+)\s*=(?!=)/g)) {
    if (!CORDIS_CTX_RESERVED.has(match[1]!)) names.add(match[1]!)
  }
  return [...names]
}

function stripYamlScalar(value: string): string {
  let v = value.trim()
  const hash = v.indexOf(' #')
  if (hash >= 0) v = v.slice(0, hash).trim()
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1)
  return v.trim()
}

interface PatchRow {
  id: string
  name: string
}

/** Pull { id, name } rows out of a bundle cordis.patch.yml (insert blocks). */
export function extractPatchRows(source: string): PatchRow[] {
  const rows: PatchRow[] = []
  let currentId: string | null = null
  let currentName: string | null = null
  let insertIndent: number | null = null
  const flush = () => {
    if (currentId !== null) rows.push({ id: currentId, name: currentName ?? currentId })
    currentId = null
    currentName = null
  }
  for (const line of source.split(/\r?\n/)) {
    const insertMatch = /^(\s*)-\s+insert:\s*$/.exec(line)
    if (insertMatch !== null) {
      flush()
      insertIndent = insertMatch[1]!.length
      continue
    }
    const contentMatch = /^(\s*)\S/.exec(line)
    if (insertIndent !== null && contentMatch !== null && contentMatch[1]!.length <= insertIndent) {
      flush()
      insertIndent = null
    }
    if (insertIndent === null) continue
    const idMatch = /^\s*-\s+id:\s*(.+?)\s*$/.exec(line)
    if (idMatch !== null) {
      flush()
      currentId = stripYamlScalar(idMatch[1]!)
      continue
    }
    const nameMatch = /^\s*name:\s*(.+?)\s*$/.exec(line)
    if (nameMatch !== null && currentId !== null) currentName = stripYamlScalar(nameMatch[1]!)
  }
  flush()
  return rows.filter(row => row.id !== '')
}

export function packagePatchPath(packageName: string, dir: string): string | null {
  const manifestPath = packageManifestPath(packageName, dir)
  if (manifestPath === null) return null
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { dsh?: { bundle?: { patch?: unknown } } }
    const patch = manifest.dsh?.bundle?.patch
    if (typeof patch !== 'string' || patch === '') return null
    return join(dirname(manifestPath), patch)
  } catch {
    return null
  }
}

export function packageEntryPath(packageName: string, dir: string): string | null {
  const manifestPath = packageManifestPath(packageName, dir)
  if (manifestPath === null) return null
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      exports?: unknown
      main?: unknown
    }
    const root = manifest.exports
    let entry: string | null = null
    if (typeof root === 'string') entry = root
    else if (root !== null && typeof root === 'object') {
      const dot = (root as Record<string, unknown>)['.']
      if (typeof dot === 'string') entry = dot
      else if (dot !== null && typeof dot === 'object' && typeof (dot as Record<string, unknown>).default === 'string') entry = (dot as Record<string, unknown>).default as string
      else if (typeof (root as Record<string, unknown>).default === 'string') entry = (root as Record<string, unknown>).default as string
    }
    if (entry === null && typeof manifest.main === 'string' && manifest.main !== '') entry = manifest.main
    if (entry === null) return null
    return join(dirname(manifestPath), entry)
  } catch {
    return null
  }
}

/** Detect duplicate bundle ids and service-name collisions across enabled bundles. */
export function computeConflicts(manifest: ProfileManifest, dir: string): MarketplaceConflict[] {
  const bundles = manifest.dsh?.profile?.bundles ?? []
  const idOwners = new Map<string, MarketplaceConflictProvider[]>()
  const serviceOwners = new Map<string, MarketplaceConflictProvider[]>()
  for (const bundle of bundles) {
    const patchPath = packagePatchPath(bundle, dir)
    if (patchPath === null) continue
    const rows = extractPatchRows(readSourceText(patchPath))
    for (const row of rows) {
      const pkg = row.name !== '' ? row.name : bundle
      const owners = idOwners.get(row.id) ?? []
      owners.push({ bundle, packageName: pkg, id: row.id })
      idOwners.set(row.id, owners)
      const entryPath = packageEntryPath(pkg, dir)
      if (entryPath === null) continue
      for (const service of extractServiceNames(readSourceText(entryPath))) {
        const list = serviceOwners.get(service) ?? []
        list.push({ bundle, packageName: pkg, id: row.id })
        serviceOwners.set(service, list)
      }
    }
  }
  const conflicts: MarketplaceConflict[] = []
  for (const [id, owners] of idOwners) {
    const packages = [...new Set(owners.map(owner => owner.packageName))]
    if (owners.length > 1) conflicts.push({ kind: 'duplicate-id', id, packages, providers: owners })
  }
  for (const [service, owners] of serviceOwners) {
    const packages = [...new Set(owners.map(owner => owner.packageName))]
    if (packages.length > 1) {
      conflicts.push({
        kind: 'service',
        service,
        packages,
        providers: owners.map(owner => ({ bundle: owner.bundle, packageName: owner.packageName, id: owner.id })),
      })
    }
  }
  return conflicts
}

/** Stable identity used to compare conflict sets before/after an operation. */
export function conflictIdentity(conflict: MarketplaceConflict): string {
  const subject = conflict.kind === 'service' ? conflict.service : conflict.id
  const providers = (conflict.providers ?? [])
    .map(provider => provider.bundle + '|' + provider.packageName + '|' + provider.id)
    .sort()
    .join(',')
  return conflict.kind + ':' + subject + ':' + providers
}

interface StagedConflict {
  kind: 'duplicate-id' | 'service'
  message: string
}

/** Check a candidate plugin inside a downloaded full dependency tree. */
export function stagedInstallConflict(
  packageName: string,
  candidateDir: string,
  manifest: ProfileManifest,
  installedDir: string,
): StagedConflict | null {
  const existingManifest: ProfileManifest = {
    ...manifest,
    dsh: {
      ...manifest.dsh,
      profile: {
        ...manifest.dsh?.profile,
        bundles: (manifest.dsh?.profile?.bundles ?? []).filter(bundle => bundle !== packageName),
      },
    },
  }
  const existingIds = new Map<string, string[]>()
  const existingServices = new Map<string, string[]>()
  for (const conflictBundle of existingManifest.dsh?.profile?.bundles ?? []) {
    const patchPath = packagePatchPath(conflictBundle, installedDir)
    if (patchPath === null) continue
    for (const row of extractPatchRows(readSourceText(patchPath))) {
      const pkg = row.name !== '' ? row.name : conflictBundle
      const ids = existingIds.get(row.id) ?? []
      ids.push(pkg)
      existingIds.set(row.id, ids)
      const entryPath = packageEntryPath(pkg, installedDir)
      if (entryPath === null) continue
      for (const service of extractServiceNames(readSourceText(entryPath))) {
        const owners = existingServices.get(service) ?? []
        owners.push(pkg)
        existingServices.set(service, owners)
      }
    }
  }
  const patchPath = packagePatchPath(packageName, candidateDir)
  if (patchPath === null) return null
  const candidateIds = new Map<string, string[]>()
  const candidateServices = new Map<string, string[]>()
  for (const row of extractPatchRows(readSourceText(patchPath))) {
    const pkg = row.name !== '' ? row.name : packageName
    const idOwners = candidateIds.get(row.id) ?? []
    idOwners.push(pkg)
    candidateIds.set(row.id, idOwners)
    const entryPath = packageEntryPath(pkg, candidateDir)
    if (entryPath === null) continue
    for (const service of extractServiceNames(readSourceText(entryPath))) {
      const owners = candidateServices.get(service) ?? []
      owners.push(pkg)
      candidateServices.set(service, owners)
    }
  }
  for (const [id, owners] of candidateIds) {
    const existing = existingIds.get(id) ?? []
    if (owners.length > 1 || existing.length > 0) {
      return {
        kind: 'duplicate-id',
        message: "Install blocked: bundle id '" + id + "' would be registered more than once by " + [...new Set([...existing, ...owners])].join(', ') + '.',
      }
    }
  }
  for (const [service, owners] of candidateServices) {
    const existing = existingServices.get(service) ?? []
    const all = [...new Set([...existing, ...owners])]
    if (owners.length > 1 || existing.length > 0) {
      return {
        kind: 'service',
        message: "Install blocked: service '" + service + "' would be provided more than once by " + all.join(', ') + '. Enabling both plugins would crash DSH at startup.',
      }
    }
  }
  return null
}
