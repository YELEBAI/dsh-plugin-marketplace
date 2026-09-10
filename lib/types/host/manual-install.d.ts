/** Strict parser for the manual install field. Input is data, never shell code. */
export interface ManualGitHubInstall {
    repo: string;
    ref: string;
}
/**
 * Accept a bare github: spec or the exact documented DSH command shape.
 * Shell operators, extra flags, multiple commands, and cross-Profile writes
 * are rejected before any process can be spawned.
 */
export declare function parseManualInstall(command: string, activeProfile: string): ManualGitHubInstall;
