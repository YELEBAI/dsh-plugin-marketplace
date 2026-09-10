/** Build the constrained prompt used by the marketplace guided-install Agent. */
import type { MarketplaceGuidedAgentOperation, MarketplaceGuidedAgentTask, MarketplaceRegistryPlugin } from "../types.js";
export interface GuidedAuditEvidence {
    repository: string;
    packageName: string;
    version: string;
    verifiedCommit: string;
    commands: Array<{
        raw: string;
        profile: string | null;
        spec: string;
        source: string;
    }>;
    targetedCommands: Array<{
        raw: string;
        profile: string | null;
        spec: string;
        source: string;
    }>;
    npmVerification: {
        verified: boolean;
        spec: string;
        reason: string;
    };
    assessment: {
        outcome: string;
        reason: string;
    };
    current: {
        profiles: string[];
        requiresBuildApproval: boolean;
        manualSteps: boolean;
        lifecycleScripts: string[];
        runtimeArtifactsCommitted: boolean;
        reviewReasons: string[];
    };
}
/** Produce a task that binds the Agent to Registry facts without trusting README prose. */
export declare function buildGuidedAgentTask(plugin: MarketplaceRegistryPlugin, profile: string, operation: MarketplaceGuidedAgentOperation, workspaceDir: string, evidence: GuidedAuditEvidence | undefined): MarketplaceGuidedAgentTask;
/** Recommend the shortest route that still respects the scanner evidence. */
export declare function guidedInstallRoute(evidence: GuidedAuditEvidence | undefined): string;
