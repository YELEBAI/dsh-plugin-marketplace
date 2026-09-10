/** Marketplace host service: the `marketplace` Typert Remote namespace.
 *  Search reads the central verified Registry; details and install-time
 *  verification read GitHub. Install/update/uninstall run pnpm jobs in
 *  the profile directory and reconcile the dsh.profile.bundles layer stack
 *  exactly like `dsh plugin add/remove` does. Every method resolves to a
 *  RemoteResult union — business failures carry a typed code, unexpected
 *  throws are folded into the same shape.
 *
 *  Local fork additions on top of upstream 0.6.1:
 *  - every pnpm job reuses the Profile-linked store (linkedPnpmStore);
 *  - an optional custom install directory with Host-backed picker support;
 *  - static conflict diagnosis (duplicate bundle ids / Cordis services)
 *    with pre-install, pre-enable and manual diagnosis gates;
 *  - unlinked plugin directories are reported and kept out of Profile ops;
 *  - default-mode installs/uninstalls keep manifest + lockfile rollback.
 */
import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { MarketplaceAgentWorkspace, MarketplaceBatchUpdateRequest, MarketplaceBatchUpdateResult, MarketplaceBatchPackageRequest, MarketplaceBatchToggleRequest, MarketplaceBatchToggleResult, MarketplaceBatchUninstallResult, MarketplaceDetailsRequest, MarketplaceDiagnoseConflictsResult, MarketplaceGuidedAgentRequest, MarketplaceGuidedAgentTask, MarketplaceInstallLocation, MarketplaceInstallRequest, MarketplaceManualInstallRequest, MarketplaceManualInstallResult, MarketplaceInstalled, MarketplaceInstalledRequest, MarketplaceJobStatus, MarketplaceJobStatusRequest, MarketplacePluginDetails, MarketplaceRestartResult, MarketplaceResult, MarketplaceSearchPage, MarketplaceSearchRequest, MarketplaceUninstallRequest, MarketplaceToggleRequest, MarketplaceToggleResult } from "../types.js";
import { type RegistryConfig } from "./registry.js";
export declare class MarketplaceService extends TypertRemoteService {
    static inject: string[];
    static Config: import("zod").ZodDefault<import("zod").ZodObject<{
        registryUrl: import("zod").ZodOptional<import("zod").ZodURL>;
        registryCacheMinutes: import("zod").ZodDefault<import("zod").ZodNumber>;
        registryRequestTimeoutMs: import("zod").ZodDefault<import("zod").ZodNumber>;
        installDir: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("zod/v4/core").$strip>>;
    private readonly github;
    private readonly registry;
    private readonly jobs;
    private readonly config;
    private selfUpdateCache;
    private pendingInstallResolution;
    private restartPending;
    /** 同一 Profile 的写操作排队执行，避免批量操作并发改写锁文件。 */
    private readonly mutationQueue;
    constructor(ctx: Context, config: RegistryConfig);
    search(request: MarketplaceSearchRequest): Promise<MarketplaceResult<MarketplaceSearchPage>>;
    details(request: MarketplaceDetailsRequest): Promise<MarketplaceResult<MarketplacePluginDetails>>;
    guidedTask(request: MarketplaceGuidedAgentRequest): Promise<MarketplaceResult<MarketplaceGuidedAgentTask>>;
    installPlugin(request: MarketplaceInstallRequest): Promise<MarketplaceResult<{
        jobId: string;
    }>>;
    manualInstall(request: MarketplaceManualInstallRequest): Promise<MarketplaceResult<MarketplaceManualInstallResult>>;
    update(request: MarketplaceInstallRequest): Promise<MarketplaceResult<{
        jobId: string;
    }>>;
    updateBatch(request: MarketplaceBatchUpdateRequest): Promise<MarketplaceResult<MarketplaceBatchUpdateResult>>;
    uninstall(request: MarketplaceUninstallRequest): Promise<MarketplaceResult<{
        jobId: string;
    }>>;
    uninstallBatch(request: MarketplaceBatchPackageRequest): Promise<MarketplaceResult<MarketplaceBatchUninstallResult>>;
    setEnabled(request: MarketplaceToggleRequest): Promise<MarketplaceResult<MarketplaceToggleResult>>;
    setEnabledBatch(request: MarketplaceBatchToggleRequest): Promise<MarketplaceResult<MarketplaceBatchToggleResult>>;
    jobStatus(request: MarketplaceJobStatusRequest): Promise<MarketplaceResult<MarketplaceJobStatus>>;
    listJobs(): Promise<MarketplaceResult<MarketplaceJobStatus[]>>;
    installed(request: MarketplaceInstalledRequest): Promise<MarketplaceResult<MarketplaceInstalled>>;
    installLocation(): Promise<MarketplaceResult<MarketplaceInstallLocation>>;
    setInstallDir(request: {
        installDir: string;
    }): Promise<MarketplaceResult<MarketplaceInstallLocation>>;
    agentWorkspace(): Promise<MarketplaceResult<MarketplaceAgentWorkspace>>;
    setAgentWorkspaceDir(request: {
        workspaceDir: string;
    }): Promise<MarketplaceResult<MarketplaceAgentWorkspace>>;
    diagnoseConflicts(): Promise<MarketplaceResult<MarketplaceDiagnoseConflictsResult>>;
    restart(): Promise<MarketplaceResult<MarketplaceRestartResult>>;
    /** Pre-install conflict check against enabled bundles. Returns a fail() result, or null. */
    private installConflict;
    /** 接受任务后立即返回；GitHub 校验与 Profile 写入在后台队列中继续。 */
    private startJob;
    private runInstallJob;
    private startUninstallJob;
    private failPreparedJob;
    private profileMutationBusy;
    private enqueueMutation;
    /** Read main/package.json directly, then freeze the update to its resolved commit. */
    private liveSelfUpdate;
    /** Custom-directory install: staging download → conflict check → copy → link. */
    private driveInstall;
    /** Default mode: pnpm manages the Profile directly, with rollback. */
    private driveProfileInstall;
    /** Custom-directory uninstall: remove the Profile link, then the managed entity. */
    private driveUninstall;
    /** 已提交操作的文件清理失败只记录残留位置，不触发安装状态回滚。 */
    private cleanupPackagePath;
    /** Default mode: pnpm remove, with manifest + lockfile rollback. */
    private driveProfileUninstall;
    /** Restore only the target dependency, preserving newer unrelated Profile edits. */
    private rollbackProfileDependency;
}
export default MarketplaceService;
