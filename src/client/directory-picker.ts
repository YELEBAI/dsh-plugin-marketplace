/** Directory picker face shared by the legacy and current DSH client runtimes. */
type DirectoryPicker = {
  pickDirectory: () => Promise<string | null>
}

type CompatibleClientContext = {
  workspaces?: unknown
  get?: (name: string) => unknown
  uiWorkspace?: unknown
}

/** Bind one structural directory picker without losing its service receiver. */
function bindPicker(candidate: unknown): (() => Promise<string | null>) | undefined {
  if (typeof candidate !== 'object' || candidate === null) return undefined
  const picker = Reflect.get(candidate, 'pickDirectory')
  if (typeof picker !== 'function') return undefined
  return () => (picker as DirectoryPicker['pickDirectory']).call(candidate)
}

/**
 * Pick a directory across DSH client generations.
 *
 * 不同 DSH 版本分别在 `workspaces` 或 `uiWorkspace` 提供目录选择。
 * 按能力探测并延迟读取 UI 服务，避免把版本差异变成市场入口的硬依赖。
 */
export async function pickCompatibleDirectory(ctx: unknown): Promise<string | null> {
  const compatible = ctx as CompatibleClientContext
  const current = bindPicker(compatible.workspaces)
  if (current !== undefined) return await current()

  let legacyService: unknown
  if (typeof compatible.get === 'function') {
    legacyService = compatible.get.call(ctx, 'uiWorkspace')
  }
  legacyService ??= compatible.uiWorkspace
  const legacy = bindPicker(legacyService)
  if (legacy !== undefined) return await legacy()

  throw new Error('This DSH deployment does not provide a compatible directory picker service.')
}
