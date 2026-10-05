import type { ISessions, SessionBinding, SessionReference } from '@deepseek-ai/dsh-api-session-controller/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { WorkspaceId } from '@deepseek-ai/dsh-workspace/types'
import type { MarketplaceGuidedAgentTask } from '../types.ts'

declare module '@deepseek-ai/dsh-api-session-controller/client' {
  interface SessionReferenceSourceMap {
    pluginMarketplace: unknown
  }
}

type GuidedSessions = Pick<ISessions, 'create' | 'binding' | 'list'> & {
  retain?: (id: SessionId, options: { source: 'pluginMarketplace' }) => SessionReference
  open?: (id: SessionId) => void
}

export interface GuidedAgentContext {
  sessions: GuidedSessions
  get?: (name: string) => unknown
}

/** 导航服务按能力读取，避免可选 UI 服务缺失时隐藏整个市场入口。 */
function sessionNavigation(ctx: GuidedAgentContext): (id: SessionId) => void {
  const navigation = ctx.get?.('uiWorkspace')
  if (typeof navigation === 'object' && navigation !== null) {
    const open = Reflect.get(navigation, 'openSession')
    if (typeof open === 'function') return id => { open.call(navigation, id) }
  }
  if (typeof ctx.sessions.open === 'function') return id => { ctx.sessions.open!(id) }
  throw new Error('This DSH deployment does not provide compatible session navigation.')
}

/** 保留旧版的自动投影路径；订阅后再次检查，避免漏掉就绪通知。 */
async function legacyBinding(sessions: GuidedSessions, id: SessionId): Promise<SessionBinding> {
  const current = sessions.binding(id)
  if (current !== undefined) return current
  return await new Promise((resolve, reject) => {
    let settled = false
    let unsubscribe = () => {}
    const timer = setTimeout(() => {
      settled = true
      unsubscribe()
      reject(new Error('The Agent session was created, but its client binding did not become ready.'))
    }, 10_000)
    const check = () => {
      if (settled) return
      const binding = sessions.binding(id)
      if (binding === undefined) return
      settled = true
      clearTimeout(timer)
      unsubscribe()
      resolve(binding)
    }
    try {
      unsubscribe = sessions.list.subscribe(check)
      if (settled) unsubscribe()
      else check()
    } catch (error) {
      clearTimeout(timer)
      unsubscribe()
      reject(error)
    }
  })
}

/** 在新版显式持有会话直到提交和导航完成，失败路径同样释放引用。 */
export async function createGuidedAgentSession(
  ctx: GuidedAgentContext,
  workspaceId: WorkspaceId,
  task: Pick<MarketplaceGuidedAgentTask, 'title' | 'prompt'>,
): Promise<void> {
  const open = sessionNavigation(ctx)
  const id = await ctx.sessions.create({ workspaceId })
  let reference: SessionReference | undefined
  try {
    reference = ctx.sessions.retain?.(id, { source: 'pluginMarketplace' })
    const binding = reference === undefined ? await legacyBinding(ctx.sessions, id) : await reference.ready
    const renamed = await binding.session.rename(task.title)
    if (!renamed.ok) throw new Error(renamed.error.message)
    const prompted = await binding.session.prompt([{ type: 'text', text: task.prompt }], 'queue')
    if (!prompted.ok) throw new Error(prompted.error.message)
    // 导航同步接管会话的持有关系，再释放本次操作的引用。
    open(id)
  } finally {
    reference?.release()
  }
}
