/** Profile-directory resolution and bundle-layer reconciliation.
 *  Mirrors `dsh plugin` semantics (apps/cli/src/plugin.ts): pnpm manages
 *  the profile directory, and a dependency that declares dsh.bundle.patch
 *  joins the dsh.profile.bundles layer stack after every install/update.
 */
import type { Context } from '@deepseek-ai/cordis';
import { type ProfileManifest } from '@deepseek-ai/dsh-app-boot';
import type { MarketplaceInstalledEntry } from "../types.js";
export interface ProfileLocation {
    dir: string;
    name: string;
}
/**
 * The profile this plugin runs inside. The Loader's baseUrl is the config
 * tree directory — for a `dsh --profile <name>` launch that IS the profile
 * directory (the same anchor client-modules and typert-loader use). It may
 * arrive as a file:// URL string or a URL object, never as a bare path.
 * A file anchor pointing at cordis.yml resolves to its directory; anything
 * else falls back to the standard `web` profile location.
 */
export declare function profileLocation(ctx: Context): ProfileLocation;
/** Initialize the profile directory when it does not exist yet. */
export declare function ensureProfile(dir: string, name: string): void;
/** Resolve an installed dependency's package.json from the profile directory. */
export declare function packageManifestPath(packageName: string, dir: string): string | null;
/** Whether an installed dependency declares dsh.bundle.patch (i.e. is a bundle). */
export declare function exportsPatch(packageName: string, dir: string): boolean;
/** Installed version of one dependency, or null when unresolvable. */
export declare function installedVersion(packageName: string, dir: string): string | null;
/** Local description/repository facts of one installed package. */
export declare function installedPackageSummary(packageName: string, dir: string): {
    description: string | null;
    repositoryUrl: string | null;
};
/**
 * Reconcile one package's bundle layer after a marketplace mutation. New
 * bundles and dependencies that gain a bundle declaration join the stack;
 * an installed bundle already omitted from the stack remains disabled.
 */
export declare function reconcileBundle(before: ProfileManifest, beforeDeclaresBundle: boolean, packageName: string, dir: string): ProfileManifest;
/** Return a manifest with only one dependency changed and every current bundle choice preserved. */
export declare function mergeProfileDependency(manifest: ProfileManifest, packageName: string, spec: string | undefined): ProfileManifest;
/** Merge one dependency into the latest on-disk manifest instead of rewriting a stale snapshot. */
export declare function writeProfileDependency(packageName: string, spec: string | undefined, dir: string): void;
/** Persist whether one installed bundle participates in the Profile layer stack. */
export declare function setBundleEnabled(packageName: string, enabled: boolean, dir: string): boolean;
/**
 * Installed dependency rows with versions and bundle-layer membership, plus
 * bundle-declaring directories that exist in the plugin directory but are not
 * linked to the Profile. Scoped folders (@scope/pkg) are scanned one level
 * deeper so marketplace-managed scoped packages are still discovered.
 */
export declare function installedEntries(manifest: ProfileManifest, dir: string, pluginDir: string, scanUnlinkedDirectories?: boolean): MarketplaceInstalledEntry[];
