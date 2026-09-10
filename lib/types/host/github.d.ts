/** GitHub REST access for install-time manifest details and ref resolution.
 */
import type { MarketplacePluginDetails } from "../types.js";
export type GitHubFailureCode = 'network' | 'rate-limited' | 'bad-token' | 'not-found' | 'ref-not-found' | 'bad-repo' | 'bad-manifest';
/** Typed failure that surfaces through the Remote error branch. */
export declare class GitHubError extends Error {
    readonly code: GitHubFailureCode;
    readonly details: Record<string, unknown>;
    constructor(code: GitHubFailureCode, message: string, details?: Record<string, unknown>);
}
/** Parse and validate an owner/repo specifier. */
export declare function parseRepo(spec: string): {
    owner: string;
    repo: string;
};
export declare class GitHubClient {
    private readonly token;
    private readonly cache;
    private readonly timeoutMs;
    constructor(timeoutMs?: number);
    /** One conditional GET against the API; 304 serves the cached body. */
    private api;
    private rateLimitError;
    private rate;
    /** Raw CDN 不可用时回退到已认证的 Contents API。 */
    private textFile;
    /**
     * Resolve the concrete commit for a repo: an explicit tag, branch, or SHA;
     * otherwise the latest release tag, then the default branch.
     */
    private resolveRef;
    /** Read the plugin manifest and bundle patch at one ref, for review before install. */
    details(repoSpec: string, ref: string): Promise<MarketplacePluginDetails>;
}
