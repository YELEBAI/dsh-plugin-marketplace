import type { ISessions, SessionReference } from '@deepseek-ai/dsh-api-session-controller/client';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { WorkspaceId } from '@deepseek-ai/dsh-workspace/types';
import type { MarketplaceGuidedAgentTask } from "../types.js";
declare module '@deepseek-ai/dsh-api-session-controller/client' {
    interface SessionReferenceSourceMap {
        pluginMarketplace: unknown;
    }
}
type GuidedSessions = Pick<ISessions, 'create' | 'binding' | 'list'> & {
    retain?: (id: SessionId, options: {
        source: 'pluginMarketplace';
    }) => SessionReference;
    open?: (id: SessionId) => void;
};
export interface GuidedAgentContext {
    sessions: GuidedSessions;
    get?: (name: string) => unknown;
}
/** 在新版显式持有会话直到提交和导航完成，失败路径同样释放引用。 */
export declare function createGuidedAgentSession(ctx: GuidedAgentContext, workspaceId: WorkspaceId, task: Pick<MarketplaceGuidedAgentTask, 'title' | 'prompt'>): Promise<void>;
export {};
