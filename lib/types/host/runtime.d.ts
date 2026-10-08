export interface PackageManagerRuntime {
    command: string;
    args?: readonly string[];
    env?: Readonly<Record<string, string>>;
}
export interface RuntimeContext {
    get?: (name: string) => unknown;
}
export declare function activeProfileRuntime(ctx: RuntimeContext): {
    dir: string;
    name?: string;
    installAnchor?: string;
    packageManager?: PackageManagerRuntime;
} | undefined;
export declare function isDesktopHost(electron?: string | undefined, env?: NodeJS.ProcessEnv): boolean;
export declare function packageManagerFor(ctx: RuntimeContext, desktop?: boolean): PackageManagerRuntime | undefined;
/** 与桌面端官方管理器共用 package.json.lock；外层仍保留市场 FIFO 与旧 Profile 锁。 */
export declare function withDesktopProfileLock<T>(ctx: RuntimeContext, dir: string, work: () => Promise<T>, desktop?: boolean): Promise<T>;
/** 使用桌面端自身的版本契约预检；市场不能暗中创建版本豁免。 */
export declare function assertDesktopPluginCompatibility(ctx: RuntimeContext, manifest: unknown, desktop?: boolean): Promise<void>;
