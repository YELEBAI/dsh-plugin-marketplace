import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { buildGuidedAgentTask, guidedInstallRoute } from '../src/host/guided-agent.ts'
import { INSTALL_SKILL_NAME, loadInstallSkill } from '../src/host/install-skill.ts'
import { RegistryClient } from '../src/host/registry.ts'
import { createGuidedAgentWorkspace } from '../src/client/agent-workspace.ts'

const registryUrl = pathToFileURL(path.resolve('registry/plugins.json')).href
const registry = new RegistryClient(registryUrl, registryUrl, 60_000, 10_000)
const clientSource = readFileSync('src/client/index.ts', 'utf8')
const clientScopeInject = clientSource.match(/ctx\.inject\(\[([\s\S]*?)\],\s*\(scope:/)?.[1]
assert(clientScopeInject, 'marketplace client scope inject list must be discoverable')
for (const service of ['sessions', 'workspaces', 'uiWorkspace']) {
  assert(clientScopeInject.includes(`'${service}'`), `marketplace client scope must inject ${service}`)
}
assert.doesNotMatch(clientScopeInject, /remote\.agentPresets|remote\.session/, '引导 Agent 不应依赖可选的 preset/session Remote namespace')
assert.match(clientSource, /scope\.sessions\.create\(\{ workspaceId: target\.workspaceId \}\)/, '引导 Agent 必须通过 ClientSessions 使用默认 composition')
assert.doesNotMatch(clientSource, /agentPresets\.list\(/, '引导 Agent 不应读取可选 preset roster')
// 热门第一页可能全部是一键安装条目；从完整快照选定引导型 fixture，再通过客户端读取。
const snapshot = JSON.parse(readFileSync('registry/plugins.json', 'utf8')) as {
  plugins: Array<{ fullName: string; install: { mode: string } }>
}
const guidedFixture = snapshot.plugins.find(item => item.install.mode === 'guided')
const plugin = guidedFixture === undefined ? undefined : await registry.find(guidedFixture.fullName)
assert(plugin, 'Registry needs at least one guided fixture')

const evidence = await registry.guidedEvidence(plugin.fullName)
assert(evidence, 'every bundled guided plugin must have scanner evidence')
assert.equal(evidence.verifiedCommit, plugin.verifiedCommit)
assert.equal(evidence.packageName, plugin.packageName)

const workspaceDir = path.resolve('.marketplace-agent-workspace-test')
const task = buildGuidedAgentTask(plugin, plugin.install.profiles[0] ?? 'web', 'install', workspaceDir, evidence)
assert.equal(task.verifiedCommit, plugin.verifiedCommit)
assert.equal(task.workspaceDir, workspaceDir)
assert.match(task.prompt, new RegExp(plugin.verifiedCommit))
assert.match(task.prompt, /不可信数据/)
assert.match(task.prompt, /原生审批/)
assert.match(task.prompt, /保留所有既有插件原来的启用\/停用状态/)
assert.match(task.prompt, /启动方法/)
assert.match(task.prompt, new RegExp(`skill 工具加载 ${INSTALL_SKILL_NAME}`))
assert.match(task.prompt, /不得切换、扫描或写入其他 DSH Workspace/)
assert.ok(task.prompt.includes(JSON.stringify(workspaceDir)))
assert.doesNotMatch(task.prompt, /改用 main、latest[^\n]*可以/)

let createdWorkspacePath = ''
const boundWorkspace = await createGuidedAgentWorkspace({
  create: async ({ path: requestedPath }) => {
    createdWorkspacePath = requestedPath
    return { workspaceId: 'marketplace-agent-workspace' }
  },
}, task.workspaceDir)
assert.equal(createdWorkspacePath, workspaceDir)
assert.equal(boundWorkspace.workspaceId, 'marketplace-agent-workspace')

const update = buildGuidedAgentTask(plugin, plugin.install.profiles[0] ?? 'web', 'update', workspaceDir, evidence)
assert.match(update.title, /^更新插件 /)
assert.match(update.prompt, /保留现有配置/)

const skill = loadInstallSkill()
assert.equal(skill.name, INSTALL_SKILL_NAME)
assert.equal(skill.provider, 'marketplace')
assert.match(skill.content, /exact 40-character commit/)
assert.match(skill.content, /references\/decision-matrix\.md/)
assert.match(skill.content, /never inspect or write another DSH Workspace/)

const routeCases = [
  [{ ...evidence, npmVerification: { ...evidence.npmVerification, verified: true } }, /精确 npm 版本/],
  [{
    ...evidence,
    npmVerification: { ...evidence.npmVerification, verified: false },
    current: { ...evidence.current, runtimeArtifactsCommitted: true },
  }, /已提交运行产物/],
  [{
    ...evidence,
    npmVerification: { ...evidence.npmVerification, verified: false },
    current: { ...evidence.current, runtimeArtifactsCommitted: false },
  }, /隔离源码构建/],
] as const
for (const [sample, expectedRoute] of routeCases) {
  assert.match(guidedInstallRoute(sample), expectedRoute)
}

console.log(`guided Agent task and ${INSTALL_SKILL_NAME} valid across ${routeCases.length} Registry risk paths`)
