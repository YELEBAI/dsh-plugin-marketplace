/** Direct repository update metadata for the marketplace plugin itself. */
import type { MarketplaceInstalledEntry, MarketplaceInstallMetadata, MarketplacePluginDetails } from "../types.js";
export declare const SELF_PACKAGE = "dsh-plugin-marketplace";
export declare const SELF_REPOSITORY = "YELEBAI/dsh-plugin-marketplace";
export declare const SELF_BRANCH = "main";
export interface SelfUpdateTarget {
    fullName: string;
    packageName: string;
    version: string;
    bundlePatch: string;
    verifiedCommit: string;
    install: MarketplaceInstallMetadata;
}
/** Only an explicit refresh may put live GitHub I/O on the installed-list path. */
export declare function shouldRefreshSelfUpdate(explicitRefresh: boolean, installed: boolean): boolean;
/** Turn one live default-branch read into an exact, immutable update target. */
export declare function selfUpdateTarget(details: MarketplacePluginDetails): SelfUpdateTarget;
/** Decorate the installed row, including a newer verified commit at the same version. */
export declare function applySelfUpdate(entry: MarketplaceInstalledEntry, target: SelfUpdateTarget, profile: string): MarketplaceInstalledEntry;
/** Compare semver values without introducing a runtime dependency. */
export declare function compareSemver(left: string, right: string): number;
