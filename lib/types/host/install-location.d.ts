/** Plugin install-location resolution, persistence, and managed-dir helpers.
 *  The default location is the running Profile's node_modules, where pnpm
 *  manages everything. A custom install directory switches installs to an
 *  external entity directory: the marketplace downloads and validates the
 *  package first, copies the entity there, links required Host peer
 *  dependencies, records a file: dependency in the Profile, and keeps a
 *  junction from the Profile's node_modules to the external directory.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { ProfileManifest } from '@deepseek-ai/dsh-app-boot';
import type { RegistryConfig } from "./registry.js";
/** Resolved install location for the running Profile. */
export interface ProfileInstallLocation {
    dir: string;
    name: string;
    /** Whether plugin entities live outside the Profile default directory. */
    custom: boolean;
    /** Directory where plugin entities are installed. */
    pluginDir: string;
    /** Store the Profile's node_modules is bound to (null when unknown). */
    storeDir: string | null;
}
/** Marketplace-managed settings (install dir, etc.), persisted under DSH_HOME. */
export declare function marketplaceSettingsPath(): string;
interface MarketplaceSettings {
    installDir: string;
    pluginRoots: string[];
    agentWorkspaceDir: string;
}
export declare function readMarketplaceSettings(): MarketplaceSettings;
export declare function writeMarketplaceSettings(patch: Partial<MarketplaceSettings>): void;
export declare function defaultPluginRoot(profileDir: string): string;
/** Default workspace used only by marketplace-created install/update Agents. */
export declare function defaultAgentWorkspaceDir(): string;
/** Resolve and prepare the dedicated Agent workspace without touching user workspaces. */
export declare function agentWorkspaceLocation(): {
    workspaceDir: string;
    workspaceDirCustom: boolean;
};
/** Persist an existing custom Agent workspace; empty restores the isolated default. */
export declare function persistAgentWorkspace(requestedDir: string): {
    workspaceDir: string;
    workspaceDirCustom: boolean;
};
/** Resolve the running Profile and the directory that holds plugin entities. */
export declare function installLocation(ctx: Context, config: RegistryConfig): ProfileInstallLocation;
/** Persist a chosen install directory; empty restores the Profile default. */
export declare function persistInstallLocation(profileDir: string, requestedDir: string): {
    installDir: string;
    installDirCustom: boolean;
};
/** Folder name used for a package inside the plugin entity directory. */
export declare function pluginFolderName(packageName: string): string;
export declare function pluginTarget(profile: ProfileInstallLocation, packageName: string): string;
/**
 * Resolve where an installed plugin entity lives. file: directory specs point
 * at the entity; file: tarball specs fall back to the managed plugin folder so
 * updates never mistake the archive for the entity.
 */
export declare function installedPluginTarget(profile: ProfileInstallLocation, packageName: string, manifest: ProfileManifest): string;
/** Roots the marketplace is allowed to manage, including previously chosen ones. */
export declare function knownPluginRoots(profile: ProfileInstallLocation): string[];
/** Whether a target directory is a marketplace-managed entity of packageName. */
export declare function isManagedPluginTarget(profile: ProfileInstallLocation, packageName: string, target: string): boolean;
/** Existing marketplace-managed external entity, independent of the current setting. */
export declare function managedInstalledPluginTarget(profile: ProfileInstallLocation, packageName: string, manifest: ProfileManifest): string | null;
/**
 * External plugin directories live outside the Profile's Node resolution
 * scope, so DSH-provided peer dependencies are not found automatically.
 * Link the host-provided peers into the plugin's own node_modules to avoid a
 * successful install that crashes on the next DSH start.
 */
export declare function linkProfilePeerDependencies(target: string, profileDir: string): string[];
/** file: spec pointing from the Profile directory at an external entity. */
export declare function localDependencySpec(profileDir: string, target: string): string;
/** Runtime package entry inside the Profile's node_modules. */
export declare function profilePackagePath(profileDir: string, packageName: string): string;
export declare function removePackagePath(path: string): void;
/** Swap the Profile runtime entry for a junction to an external entity. */
export declare function createProfilePackageLink(profileDir: string, packageName: string, target: string, jobId: string): {
    linkPath: string;
    backupPath: string;
    backupCreated: boolean;
};
export {};
