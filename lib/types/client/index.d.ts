/** Plugin marketplace, browser half: the `marketplace` settings tab.
 *  Registers into the Plugins settings section through the
 *  settings.plugins.tab slot and mounts this package's own Remote
 *  contribution, mirroring ui-settings-plugin-inventory.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type PluginMarketplaceLocaleKey } from "./locales.js";
export type { MarketplaceTabInjected, MarketplaceTabProps } from "./MarketplaceTab.js";
export type { PluginMarketplaceLocaleKey } from "./locales.js";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Plugin marketplace copy. */
        'settings.pluginMarketplace': PluginMarketplaceLocaleKey;
    }
}
/** Dictionary namespace owned by this plugin. */
export declare const NS = "settings.pluginMarketplace";
/** Service required before this plugin can mount its own Remote namespace. */
export declare const inject: string[];
/** Mount the marketplace Remote contribution, then register its Settings tab. */
export declare function apply(ctx: ClientContext): Promise<void>;
export type { MarketplaceInstallRequest, MarketplaceInstalledEntry, MarketplaceInstalled, MarketplaceJobStatus, MarketplacePluginDetails, MarketplaceRestartResult, MarketplaceSearchPage, } from "../types.js";
