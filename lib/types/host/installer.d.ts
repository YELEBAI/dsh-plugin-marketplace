/** Install/uninstall/update job table and the pnpm spawn pipeline.
 *  Jobs run detached from the RPC call: installPlugin() returns a jobId and the
 *  client polls jobStatus(), so a long pnpm run never blocks the wire.
 */
import type { MarketplaceJobKind, MarketplaceJobPhase, MarketplaceJobStatus } from "../types.js";
export interface JobOutcome {
    packageName: string;
    version: string;
    requiresRestart: boolean;
}
export interface JobFailure {
    code: string;
    message: string;
}
export interface JobRecord {
    jobId: string;
    kind: MarketplaceJobKind;
    packageName: string;
    phase: MarketplaceJobPhase;
    log: string;
    exitCode: number | null;
    startedAt: number;
    finishedAt: number | null;
    outcome: JobOutcome | null;
    failure: JobFailure | null;
}
export declare class JobTable {
    private readonly jobs;
    private seq;
    create(kind: MarketplaceJobKind, packageName: string, phase?: MarketplaceJobPhase): JobRecord;
    get(jobId: string): JobRecord | undefined;
    list(): MarketplaceJobStatus[];
    hasActive(): boolean;
    atCapacity(): boolean;
    hasActivePackage(packageName: string): boolean;
    append(job: JobRecord, chunk: string): void;
    phase(job: JobRecord, value: MarketplaceJobPhase): void;
    exit(job: JobRecord, code: number | null): void;
    settle(job: JobRecord, outcome: JobOutcome): void;
    fail(job: JobRecord, failure: JobFailure): void;
    snapshot(job: JobRecord): MarketplaceJobStatus;
    /** 限制完成记录的数量与寿命，同时始终保留所有活跃任务。 */
    private pruneFinished;
}
/** Profile 写操作的先进先出串行队列；单项拒绝不会阻断后续任务。 */
export declare class MutationQueue {
    private tail;
    enqueue(work: () => Promise<void>): void;
    drain(): Promise<void>;
}
/** 跨 MarketplaceService/DSH 进程串行修改同一 Profile。 */
export declare function withProfileMutationLock<T>(dir: string, work: () => Promise<T>): Promise<T>;
export declare function removeStaleProfileLock(lockPath: string): boolean;
/**
 * Reuse the pnpm store the working directory's node_modules is already bound
 * to (read from node_modules/.modules.yaml). Passing the same store to every
 * pnpm invocation prevents ERR_PNPM_UNEXPECTED_STORE when the Profile and the
 * staging/plugin directories would otherwise resolve different stores.
 */
export declare function linkedPnpmStore(dir: string): string | null;
/**
 * Build the pnpm argument list for one job, forwarding the store the working
 * directory is bound to (or the caller-supplied Profile-linked fallback).
 * Exposed separately so the store-selection logic is unit-testable without
 * spawning a process.
 */
export declare function pnpmArgsFor(args: string[], dir: string, fallbackStoreDir: string | null): {
    args: string[];
    storeDir: string | null;
};
/**
 * Run one pnpm invocation in the working directory, streaming stdout and
 * stderr into the job log. When the directory is bound to a pnpm store (or
 * the caller supplies a Profile-linked store as fallback), the same store is
 * forwarded through --config.store-dir so staging, plugin and Profile jobs
 * never drift onto another store. Mirrors the CLI's Windows shell forwarding
 * (pnpm resolves through its .cmd shim).
 */
export declare function runPnpmJob(job: JobRecord, args: string[], dir: string, table: JobTable, fallbackStoreDir?: string | null): Promise<number | null>;
/** Profile 写入失败时做有界重试，覆盖 Windows 短暂文件占用与 lockfile 竞争。 */
export declare function runProfilePnpmJob(job: JobRecord, args: string[], dir: string, table: JobTable, fallbackStoreDir?: string | null): Promise<number | null>;
