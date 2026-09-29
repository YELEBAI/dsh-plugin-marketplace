/**
 * Pick a directory across DSH client generations.
 *
 * 不同 DSH 版本分别在 `workspaces` 或 `uiWorkspace` 提供目录选择。
 * 按能力探测并延迟读取 UI 服务，避免把版本差异变成市场入口的硬依赖。
 */
export declare function pickCompatibleDirectory(ctx: unknown): Promise<string | null>;
