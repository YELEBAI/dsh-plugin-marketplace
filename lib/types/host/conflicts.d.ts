/** Heuristic static diagnostics for plugin activation conflicts.
 *  Detects duplicate bundle ids and duplicate Cordis service names across the
 *  enabled bundle layer by scanning cordis.patch.yml insert rows and the Host
 *  entry source of each package. This is deliberately heuristic: it does not
 *  execute JavaScript or build a full Cordis configuration tree, so results
 *  are a pre-flight guard, not a runtime guarantee.
 */
import type { ProfileManifest } from '@deepseek-ai/dsh-app-boot';
import type { MarketplaceConflict } from "../types.js";
export declare function readSourceText(path: string, maxChars?: number): string;
/** Extract Cordis service names a plugin provides, from its entry source. */
export declare function extractServiceNames(source: string): string[];
interface PatchRow {
    id: string;
    name: string;
}
/** Pull { id, name } rows out of a bundle cordis.patch.yml (insert blocks). */
export declare function extractPatchRows(source: string): PatchRow[];
export declare function packagePatchPath(packageName: string, dir: string): string | null;
export declare function packageEntryPath(packageName: string, dir: string): string | null;
/** Detect duplicate bundle ids and service-name collisions across enabled bundles. */
export declare function computeConflicts(manifest: ProfileManifest, dir: string): MarketplaceConflict[];
/** Stable identity used to compare conflict sets before/after an operation. */
export declare function conflictIdentity(conflict: MarketplaceConflict): string;
interface StagedConflict {
    kind: 'duplicate-id' | 'service';
    message: string;
}
/** Check a candidate plugin inside a downloaded full dependency tree. */
export declare function stagedInstallConflict(packageName: string, candidateDir: string, manifest: ProfileManifest, installedDir: string): StagedConflict | null;
export {};
