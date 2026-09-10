/** Bind a guided Agent to the exact Workspace selected by the marketplace Host. */
export interface AgentWorkspaceCreator<T> {
    create(input: {
        path: string;
    }): Promise<T>;
}
export declare function createGuidedAgentWorkspace<T>(workspaces: AgentWorkspaceCreator<T>, workspaceDir: string): Promise<T>;
