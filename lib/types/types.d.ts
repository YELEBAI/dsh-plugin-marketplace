/** Shared JSON vocabulary crossing the marketplace Remote boundary.
 *  Both the host service and the client tab import these shapes; nothing
 *  here carries runtime identity, so both bundles may inline their own copy.
 */
/** Marketplace business failure carried inside a successful Remote transport. */
export interface MarketplaceFailure {
    code: string;
    message: string;
    details: object;
}
/** Business outcome kept separate from the Remote transport result. */
export type MarketplaceResult<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: MarketplaceFailure;
};
/** GitHub API rate-limit projection (core vs. search pool). */
export interface MarketplaceRateLimit {
    limit: number;
    remaining: number;
    /** Epoch seconds when the window resets. */
    reset: number;
    source: 'core' | 'search';
}
/** One search-result repository row. */
export type MarketplacePluginCategory = 'ui' | 'agents' | 'developer-tools' | 'models' | 'data' | 'integrations' | 'media' | 'security' | 'observability' | 'other';
export interface MarketplaceRepoSummary {
    owner: string;
    repo: string;
    fullName: string;
    description: string | null;
    stars: number;
    forks: number;
    openIssues: number;
    language: string | null;
    license: string | null;
    updatedAt: string;
    defaultBranch: string;
    /** Immutable commit that passed the central Registry validation. */
    verifiedCommit: string;
    htmlUrl: string;
    topics: string[];
    /** Scanner-generated discovery categories, ranked most relevant first. */
    categories: MarketplacePluginCategory[];
    /** Positive Star gain over the scanner's retained seven-day baseline. */
    starGrowth7d: number;
}
export type MarketplaceInstallSource = 'github' | 'npm' | 'tarball' | 'manual';
export type MarketplaceInstallMode = 'automatic' | 'guided';
/** Centrally verified instructions used by the UI and installer. */
export interface MarketplaceInstallMetadata {
    /** Automatic entries may be executed by the marketplace; guided entries only link to instructions. */
    mode: MarketplaceInstallMode;
    source: MarketplaceInstallSource;
    /** Exact pnpm package spec. Empty for manual-only installs. */
    spec: string;
    /** Profiles explicitly known to be compatible. Empty means that the target is unknown. */
    profiles: string[];
    requiresBuildApproval: boolean;
    requiresRestart: boolean;
    manualSteps: boolean;
    instructionsUrl: string;
}
/** dsh-std Community v0.15 的静态 TUI Profile 预检结果。 */
export interface MarketplaceDshStdPreflight {
    status: 'valid' | 'invalid';
    profile: 'tui-admission/0.15';
    manifestVersion?: '0.15' | undefined;
    pluginId?: string | undefined;
    requirements?: string[] | undefined;
    permissions?: string[] | undefined;
    authorizationRequired?: boolean | undefined;
    subscriptions?: string[] | undefined;
    checks?: string[] | undefined;
    issues: string[];
}
/** One centrally verified plugin published by the Registry. */
export interface MarketplaceRegistryPlugin extends MarketplaceRepoSummary {
    packageName: string;
    version: string;
    bundlePatch: string;
    hasClient: boolean;
    /** 可选的 dsh-std 静态预检，不替代运行期协商或用户授权。 */
    dshStd?: MarketplaceDshStdPreflight | undefined;
    verifiedAt: string;
    install: MarketplaceInstallMetadata;
}
/** Signed-content payload before an optional detached signature is added. */
export interface MarketplaceRegistry {
    schemaVersion: 2;
    generatedAt: string;
    plugins: MarketplaceRegistryPlugin[];
}
/** plugin.json-relevant manifest facts read from the repo at one ref. */
export interface MarketplacePluginManifest {
    name: string;
    version: string;
    description: string;
    license: string | null;
    /** dsh.bundle.patch value when declared (the plugin identity contract). */
    bundlePatch: string | null;
    hasClient: boolean;
    /** Host entry source path derived from exports['.'] / exports.default / main. */
    entry: string | null;
}
/** details() outcome: manifest + bundle patch text for pre-install review. */
export interface MarketplacePluginDetails {
    repo: string;
    /** Ref the caller asked for ('' means auto-select). */
    ref: string;
    /** Concrete ref used for the raw fetch. */
    resolvedRef: string;
    manifest: MarketplacePluginManifest | null;
    /** Bundle patch text, capped at 64 KiB, when the manifest declares one. */
    patch: string | null;
    /** Host entry source text, capped at 64 KiB, when the manifest resolves one. */
    entrySource: string | null;
    readmeUrl: string;
    rate: MarketplaceRateLimit;
}
/** One search page. */
export interface MarketplaceSearchPage {
    totalCount: number;
    items: MarketplaceRegistryPlugin[];
    rate: MarketplaceRateLimit;
}
export type MarketplaceJobKind = 'install' | 'update' | 'uninstall';
export type MarketplaceJobPhase = 'queued' | 'spawning' | 'running' | 'reconciling' | 'done' | 'failed';
/** Live projection of one install/uninstall/update job (polled). */
export interface MarketplaceJobStatus {
    jobId: string;
    kind: MarketplaceJobKind;
    packageName: string;
    phase: MarketplaceJobPhase;
    /** Incremental pnpm output, capped at 64 KiB (tail). */
    log: string;
    exitCode: number | null;
    startedAt: number;
    finishedAt: number | null;
    outcome: {
        packageName: string;
        version: string;
        requiresRestart: boolean;
    } | null;
    failure: {
        code: string;
        message: string;
    } | null;
}
/** One provider contributing to a detected conflict. */
export interface MarketplaceConflictProvider {
    bundle: string;
    packageName: string;
    id: string;
}
/** Static heuristic conflict between enabled bundles (duplicate ids / Cordis services). */
export type MarketplaceConflict = {
    kind: 'service';
    service: string;
    packages: string[];
    providers?: MarketplaceConflictProvider[];
} | {
    kind: 'duplicate-id';
    id: string;
    packages: string[];
    providers?: MarketplaceConflictProvider[];
};
/** One row of the installed() listing. */
export interface MarketplaceInstalledEntry {
    packageName: string;
    version: string;
    /** Whether the installed dependency declares a DSH bundle patch. */
    isBundle: boolean;
    /** Whether the entry is linked to the current Profile (dependency present). */
    linked: boolean;
    /** Absolute location of the plugin entity. */
    location: string;
    /** Whether the bundle currently participates in the Profile layer stack. */
    enabled: boolean;
    /** Dependency spec currently recorded in the profile package.json. */
    currentSpec: string;
    /** Package description from the local manifest, or the Registry when managed. */
    description?: string | null;
    /** Repository URL from the local manifest, or the Registry when managed. */
    repositoryUrl?: string | null;
    /** Registry repository when this installed package is centrally managed. */
    registryRepo: string | null;
    availableVersion: string | null;
    /** Where the available version was read from. Self-update uses the live repository. */
    availableVersionSource: 'registry' | 'repository' | null;
    verifiedCommit: string | null;
    updateAvailable: boolean;
    canUpdate: boolean;
    install: MarketplaceInstallMetadata | null;
}
export interface MarketplaceInstalled {
    profile: string;
    /** Absolute plugin install directory in effect. */
    installDir?: string;
    /** Whether the install directory is a custom location, not the Profile default. */
    installDirCustom?: boolean;
    /** Static conflicts among currently enabled bundles. */
    conflicts?: MarketplaceConflict[];
    entries: MarketplaceInstalledEntry[];
}
/** 已安装插件列表请求；refresh 会绕过 Registry 和自更新缓存。 */
export interface MarketplaceInstalledRequest {
    refresh: boolean;
}
/** Current plugin install location. */
export interface MarketplaceInstallLocation {
    /** 当前正在运行插件市场的 Profile。 */
    profile: string;
    /** Profile 直接声明的依赖名，用于市场首屏快速标记已安装状态。 */
    packageNames: string[];
    installDir: string;
    installDirCustom: boolean;
}
/** setInstallDir() request: empty restores the Profile default. */
export interface MarketplaceInstallDirRequest {
    installDir: string;
}
/** Dedicated filesystem Workspace used by marketplace-created Agents. */
export interface MarketplaceAgentWorkspace {
    workspaceDir: string;
    workspaceDirCustom: boolean;
}
/** setAgentWorkspaceDir() request: empty restores the isolated default. */
export interface MarketplaceAgentWorkspaceRequest {
    workspaceDir: string;
}
/** Manual conflict diagnosis outcome. */
export interface MarketplaceDiagnoseConflictsResult {
    conflicts: MarketplaceConflict[];
    scannedAt: number;
}
/** Job identity returned when an install, update, or uninstall starts. */
export interface MarketplaceJobHandle {
    jobId: string;
}
/** 一次批量更新中已进入队列的插件任务。 */
export interface MarketplaceBatchUpdateJob extends MarketplaceJobHandle {
    packageName: string;
}
/** 多个 Registry 固定来源的更新请求。 */
export interface MarketplaceBatchUpdateRequest {
    updates: MarketplaceInstallRequest[];
}
/** 已接受任务及未能加入队列的条目。 */
export interface MarketplaceBatchUpdateResult {
    jobs: MarketplaceBatchUpdateJob[];
    failures: Array<{
        repo: string;
        message: string;
    }>;
}
/** 最多 50 个已安装插件的批量操作请求。 */
export interface MarketplaceBatchPackageRequest {
    packageNames: string[];
}
/** 批量启用或停用已安装插件。 */
export interface MarketplaceBatchToggleRequest extends MarketplaceBatchPackageRequest {
    enabled: boolean;
}
/** 批量卸载进入操作队列的任务与拒绝项。 */
export interface MarketplaceBatchUninstallResult {
    jobs: MarketplaceBatchUpdateJob[];
    failures: Array<{
        packageName: string;
        message: string;
    }>;
}
/** 一次批量启用或停用的逐插件结果。 */
export interface MarketplaceBatchToggleResult {
    results: MarketplaceToggleResult[];
    failures: Array<{
        packageName: string;
        message: string;
    }>;
    requiresRestart: boolean;
}
/** Restricted command-line install request; the Host parses it without a shell. */
export interface MarketplaceManualInstallRequest {
    command: string;
}
/** Resolved identity returned when a manual GitHub install job starts. */
export interface MarketplaceManualInstallResult extends MarketplaceJobHandle {
    operation: 'install' | 'update';
    packageName: string;
    repository: string;
    verifiedCommit: string;
}
export type MarketplaceSearchOutcome = MarketplaceResult<MarketplaceSearchPage>;
export type MarketplaceDetailsOutcome = MarketplaceResult<MarketplacePluginDetails>;
export type MarketplaceInstallOutcome = MarketplaceResult<MarketplaceJobHandle>;
export type MarketplaceBatchUpdateOutcome = MarketplaceResult<MarketplaceBatchUpdateResult>;
export type MarketplaceBatchUninstallOutcome = MarketplaceResult<MarketplaceBatchUninstallResult>;
export type MarketplaceBatchToggleOutcome = MarketplaceResult<MarketplaceBatchToggleResult>;
export type MarketplaceManualInstallOutcome = MarketplaceResult<MarketplaceManualInstallResult>;
export type MarketplaceJobStatusOutcome = MarketplaceResult<MarketplaceJobStatus>;
export type MarketplaceJobsOutcome = MarketplaceResult<MarketplaceJobStatus[]>;
export type MarketplaceInstalledOutcome = MarketplaceResult<MarketplaceInstalled>;
export type MarketplaceToggleOutcome = MarketplaceResult<MarketplaceToggleResult>;
export type MarketplaceRestartOutcome = MarketplaceResult<MarketplaceRestartResult>;
export type MarketplaceInstallLocationOutcome = MarketplaceResult<MarketplaceInstallLocation>;
export type MarketplaceInstallDirOutcome = MarketplaceResult<MarketplaceInstallLocation>;
export type MarketplaceAgentWorkspaceOutcome = MarketplaceResult<MarketplaceAgentWorkspace>;
export type MarketplaceDiagnoseConflictsOutcome = MarketplaceResult<MarketplaceDiagnoseConflictsResult>;
export type MarketplaceGuidedAgentOutcome = MarketplaceResult<MarketplaceGuidedAgentTask>;
export interface MarketplaceToggleResult {
    packageName: string;
    enabled: boolean;
    requiresRestart: boolean;
}
/** Accepted restart request. The process exits only after this crosses the wire. */
export interface MarketplaceRestartResult {
    accepted: true;
    profile: string;
}
export type MarketplaceGuidedAgentOperation = 'install' | 'update';
/** Registry-bound task handed to a normal DSH Agent for a guided install. */
export interface MarketplaceGuidedAgentTask {
    repository: string;
    packageName: string;
    version: string;
    verifiedCommit: string;
    profile: string;
    /** Dedicated Workspace that must own the Agent session and all temporary artifacts. */
    workspaceDir: string;
    title: string;
    prompt: string;
    instructionsUrl: string;
    assessment: string;
    requiresBuildApproval: boolean;
    lifecycleScripts: string[];
}
export interface MarketplaceSearchRequest {
    query: string;
    page: number;
    sort: 'stars' | 'updated' | 'trending';
    category: MarketplacePluginCategory | 'all';
}
export interface MarketplaceDetailsRequest {
    /** owner/repo */
    repo: string;
    /** Exact tag, or '' for auto (latest release, then default branch). */
    ref: string;
}
export interface MarketplaceInstallRequest {
    repo: string;
    ref: string;
}
export interface MarketplaceGuidedAgentRequest extends MarketplaceInstallRequest {
    operation: MarketplaceGuidedAgentOperation;
}
export interface MarketplaceJobStatusRequest {
    jobId: string;
}
export interface MarketplaceUninstallRequest {
    packageName: string;
}
export interface MarketplaceToggleRequest {
    packageName: string;
    enabled: boolean;
}
