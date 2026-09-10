/**
 * Pick a directory across DSH client generations.
 *
 * Current DSH exposes the operation on `workspaces`; older releases provided
 * a separate `uiWorkspace` service. The legacy service is resolved lazily so
 * it never becomes a Cordis injection requirement that can hide the whole
 * marketplace tab on current runtimes.
 */
export declare function pickCompatibleDirectory(ctx: unknown): Promise<string | null>;
