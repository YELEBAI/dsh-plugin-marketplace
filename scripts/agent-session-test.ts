import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createGuidedAgentSession, type GuidedAgentContext } from '../src/client/agent-session.ts'

const task = { title: '安装插件 fixture', prompt: '只用于本地测试，不发送模型请求' }
const workspaceId = 'fixture-workspace' as Parameters<typeof createGuidedAgentSession>[1]
function fixture(options: { legacy?: boolean; fail?: 'ready' | 'rename' | 'prompt' | 'navigate' } = {}) {
  const events: string[] = []
  const accepted = { ok: true, value: {} }
  const rejected = { ok: false, error: { message: 'fixture rejected' } }
  const binding = { session: {
    rename: async (title: string) => { assert.equal(title, task.title); events.push('rename'); return options.fail === 'rename' ? rejected : accepted },
    prompt: async (parts: unknown, mode: string) => {
      assert.deepEqual(parts, [{ type: 'text', text: task.prompt }])
      assert.equal(mode, 'queue')
      events.push('prompt')
      return options.fail === 'prompt' ? rejected : accepted
    },
  } }
  const sessions = {
    create: async (input: unknown) => { assert.deepEqual(input, { workspaceId }); events.push('create'); return 'fixture-session' },
    binding: () => options.legacy ? binding : undefined,
    list: { subscribe: (_listener: () => void) => () => {} },
    ...(options.legacy ? {
      open: function (id: string) { assert.equal(this, sessions); assert.equal(id, 'fixture-session'); events.push('open') },
    } : {
      retain: function (id: string, input: unknown) {
        assert.equal(this, sessions)
        assert.equal(id, 'fixture-session')
        assert.deepEqual(input, { source: 'pluginMarketplace' })
        events.push('retain')
        return {
          ready: options.fail === 'ready' ? Promise.reject(new Error('ready failed')) : Promise.resolve(binding),
          release: () => events.push('release'),
        }
      },
    }),
  }
  const navigation = { openSession: function (id: string) {
    assert.equal(this, navigation)
    assert.equal(id, 'fixture-session')
    events.push('open')
    if (options.fail === 'navigate') throw new Error('navigation failed')
  } }
  const ctx = { sessions, get: () => options.legacy ? undefined : navigation }
  return { ctx: ctx as unknown as GuidedAgentContext, events, binding }
}

test('新版会话先持有再提交，并在导航接管后释放；不等待自动 binding', async () => {
  const { ctx, events } = fixture()
  await createGuidedAgentSession(ctx, workspaceId, task)
  assert.deepEqual(events, ['create', 'retain', 'rename', 'prompt', 'open', 'release'])
})

for (const fail of ['ready', 'rename', 'prompt', 'navigate'] as const) {
  test(`${fail} 失败会传播错误并释放会话引用`, async () => {
    const { ctx, events } = fixture({ fail })
    await assert.rejects(createGuidedAgentSession(ctx, workspaceId, task), /failed|rejected/)
    assert.equal(events.at(-1), 'release')
    assert.equal(events.filter(event => event === 'release').length, 1)
    if (fail === 'rename' || fail === 'ready') assert(!events.includes('prompt'))
    if (fail !== 'navigate') assert(!events.includes('open'))
  })
}

test('旧版自动投影和 sessions.open 保持可用，并保留方法接收者', async () => {
  const { ctx, events } = fixture({ legacy: true })
  await createGuidedAgentSession(ctx, workspaceId, task)
  assert.deepEqual(events, ['create', 'rename', 'prompt', 'open'])
})

test('缺少导航能力时不创建悬空会话或发送任务', async () => {
  const { ctx, events } = fixture()
  ctx.get = () => undefined
  await assert.rejects(createGuidedAgentSession(ctx, workspaceId, task), /session navigation/)
  assert.deepEqual(events, [])
})

test('旧版订阅同步通知时仍会退订，且不会产生十秒假超时', async () => {
  const { ctx, binding, events } = fixture({ legacy: true })
  let ready = false
  ctx.sessions.binding = () => ready ? binding as ReturnType<typeof ctx.sessions.binding> : undefined
  ctx.sessions.list.subscribe = listener => {
    ready = true
    listener()
    return () => events.push('unsubscribe')
  }
  await createGuidedAgentSession(ctx, workspaceId, task)
  assert.deepEqual(events, ['create', 'unsubscribe', 'rename', 'prompt', 'open'])
})
