import { type ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { MarketplaceAgentWorkspace, MarketplaceBatchUpdateResult, MarketplaceBatchToggleResult, MarketplaceBatchUninstallResult, MarketplaceDiagnoseConflictsResult, MarketplaceInstalled, MarketplaceInstallLocation, MarketplaceJobStatus, MarketplaceManualInstallResult, MarketplacePluginDetails, MarketplacePluginCategory, MarketplaceSearchPage, MarketplaceRestartResult, MarketplaceToggleResult } from "../types.js";
/** Registration-side Remote face used by the section. */
export interface MarketplaceTabInjected {
    search: (query: string, page: number, sort: 'stars' | 'updated' | 'trending', category: MarketplacePluginCategory | 'all') => Promise<MarketplaceSearchPage>;
    details: (repo: string, ref: string) => Promise<MarketplacePluginDetails>;
    guidedAgent: (repo: string, ref: string, operation: 'install' | 'update') => Promise<void>;
    install: (repo: string, ref: string) => Promise<string>;
    manualInstall: (command: string) => Promise<MarketplaceManualInstallResult>;
    update: (repo: string, ref: string) => Promise<string>;
    updateBatch: (updates: Array<{
        repo: string;
        ref: string;
    }>) => Promise<MarketplaceBatchUpdateResult>;
    uninstall: (packageName: string) => Promise<string>;
    uninstallBatch: (packageNames: string[]) => Promise<MarketplaceBatchUninstallResult>;
    setEnabled: (packageName: string, enabled: boolean) => Promise<MarketplaceToggleResult>;
    setEnabledBatch: (packageNames: string[], enabled: boolean) => Promise<MarketplaceBatchToggleResult>;
    installLocation: () => Promise<MarketplaceInstallLocation>;
    setInstallDir: (installDir: string) => Promise<MarketplaceInstallLocation>;
    chooseInstallDir: () => Promise<string | null>;
    agentWorkspace: () => Promise<MarketplaceAgentWorkspace>;
    setAgentWorkspaceDir: (workspaceDir: string) => Promise<MarketplaceAgentWorkspace>;
    chooseAgentWorkspaceDir: () => Promise<string | null>;
    diagnoseConflicts: () => Promise<MarketplaceDiagnoseConflictsResult>;
    jobStatus: (jobId: string) => Promise<MarketplaceJobStatus>;
    jobs: () => Promise<MarketplaceJobStatus[]>;
    installed: (refresh?: boolean) => Promise<MarketplaceInstalled>;
    restart: () => Promise<MarketplaceRestartResult>;
}
/** Full component props assembled by the Settings slot renderer. */
export type MarketplaceTabProps = PropsRuntime<'settings.plugins.tab'> & PropsLocale<'settings.pluginMarketplace'> & InjectFace<MarketplaceTabInjected>;
/** Render the marketplace: search, cards, install jobs, pagination. */
export declare function MarketplaceTab({ search, details, guidedAgent, install, manualInstall, update, updateBatch, uninstall, uninstallBatch, setEnabled, setEnabledBatch, installLocation, setInstallDir, chooseInstallDir, agentWorkspace, setAgentWorkspaceDir, chooseAgentWorkspaceDir, diagnoseConflicts, jobStatus, jobs: loadJobs, installed, restart, t }: MarketplaceTabProps): ReactNode;
