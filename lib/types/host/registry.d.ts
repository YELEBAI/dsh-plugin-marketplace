/** Central verified-plugin Registry reader and local search index. */
import { z } from 'zod';
import type { MarketplaceRegistryPlugin, MarketplacePluginCategory, MarketplaceSearchPage } from "../types.js";
import type { GuidedAuditEvidence } from "./guided-agent.js";
/** Loader schema for Registry access policy. */
export declare const RegistryConfigSchema: z.ZodDefault<z.ZodObject<{
    registryUrl: z.ZodOptional<z.ZodURL>;
    registryCacheMinutes: z.ZodDefault<z.ZodNumber>;
    registryRequestTimeoutMs: z.ZodDefault<z.ZodNumber>;
    installDir: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
/** Validated configuration for fetching the central Registry. */
export type RegistryConfig = z.output<typeof RegistryConfigSchema>;
/** Registry read or validation failure surfaced as a marketplace business error. */
export declare class RegistryError extends Error {
    readonly code = "registry-unavailable";
    readonly details: Record<string, unknown>;
    constructor(message: string, details?: Record<string, unknown>);
}
/** Read, cache, validate, and search one central Registry document. */
export declare class RegistryClient {
    private cache;
    private loading;
    private backgroundRefresh;
    private refreshing;
    private bootstrapped;
    private readonly repositories;
    private readonly packages;
    private readonly source;
    private readonly bundledSource;
    private readonly cacheMs;
    private readonly timeoutMs;
    private readonly preferBundledFirst;
    constructor(source: string, bundledSource: string, cacheMs: number, timeoutMs: number, preferBundledFirst?: boolean);
    /** Search only centrally verified entries. */
    search(query: string, page: number, sort: 'stars' | 'updated' | 'trending', category: MarketplacePluginCategory | 'all'): Promise<MarketplaceSearchPage>;
    /** Find one currently verified repository, case-insensitively. */
    find(repo: string): Promise<MarketplaceRegistryPlugin | undefined>;
    /** Find the Registry owner of one installed npm package name. */
    findByPackage(packageName: string): Promise<MarketplaceRegistryPlugin | undefined>;
    /** 批量命中已安装包；Registry 只加载一次，每项查找为 O(1)。 */
    findByPackages(packageNames: Iterable<string>): Promise<Map<string, MarketplaceRegistryPlugin>>;
    /** 显式检查更新时绕过 TTL，重新读取远程 Registry 与发现数据。 */
    refresh(): Promise<void>;
    private refreshUncached;
    /** Read the scanner's evidence for one still-guided repository, when available. */
    guidedEvidence(repo: string): Promise<GuidedAuditEvidence | undefined>;
    private load;
    /** Perform one Registry refresh shared by every concurrent caller. */
    private loadUncached;
    private loadSource;
    /** 同时替换快照和查找索引，避免不同入口看到不同的发现数据。 */
    private storeRegistry;
    /** Discovery metadata is optional so custom and legacy registries still load. */
    private loadDiscovery;
    /** Read one Registry companion JSON document with the configured timeout. */
    private readJson;
}
