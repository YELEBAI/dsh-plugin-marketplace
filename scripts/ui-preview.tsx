import { createRoot } from 'react-dom/client'
import { MarketplaceTab, type MarketplaceTabProps } from '../src/client/MarketplaceTab.tsx'
import { zh, en, type PluginMarketplaceLocaleKey } from '../src/client/locales.ts'
import type { MarketplaceInstallLocation, MarketplaceJobStatus } from '../src/types.ts'
import themeCss from '@dsh-fixture/theme.css'

const now = '2026-09-01T08:00:00.000Z'
const rate = { limit: 0, remaining: 0, reset: 0, source: 'core' as const }
const params = new URLSearchParams(window.location.search)
const scenario = params.get('scenario')

const catalog = [
  {
    owner: 'dsh-labs', repo: 'focus-panel', fullName: 'dsh-labs/focus-panel',
    description: '让工作区保持专注 · A compact focus panel for everyday sessions.', stars: 428, forks: 31, openIssues: 3,
    language: 'TypeScript', license: 'MIT', updatedAt: now, defaultBranch: 'main', verifiedCommit: 'a'.repeat(40),
    htmlUrl: 'https://github.com/dsh-labs/focus-panel', topics: ['focus'], categories: ['ui' as const], starGrowth7d: 24,
    packageName: '@dsh/focus-panel', version: '1.4.0', bundlePatch: './cordis.patch.yml', hasClient: true, verifiedAt: now,
    install: { mode: 'automatic' as const, source: 'github' as const, spec: 'github:dsh-labs/focus-panel#' + 'a'.repeat(40), profiles: ['web'], requiresBuildApproval: false, requiresRestart: true, manualSteps: false, instructionsUrl: 'https://github.com/dsh-labs/focus-panel#install' },
  },
  {
    owner: 'dsh-labs', repo: 'data-lens', fullName: 'dsh-labs/data-lens',
    description: '把项目资料整理成可检索的知识视图 · Searchable knowledge views for project data.', stars: 291, forks: 18, openIssues: 1,
    language: 'TypeScript', license: 'Apache-2.0', updatedAt: now, defaultBranch: 'main', verifiedCommit: 'b'.repeat(40),
    htmlUrl: 'https://github.com/dsh-labs/data-lens', topics: ['knowledge'], categories: ['data' as const], starGrowth7d: 11,
    packageName: '@dsh/data-lens', version: '0.8.2', bundlePatch: './cordis.patch.yml', hasClient: true, verifiedAt: now,
    install: { mode: 'automatic' as const, source: 'github' as const, spec: 'github:dsh-labs/data-lens#' + 'b'.repeat(40), profiles: ['web'], requiresBuildApproval: false, requiresRestart: true, manualSteps: false, instructionsUrl: 'https://github.com/dsh-labs/data-lens#install' },
  },
  {
    owner: 'dsh-community', repo: 'safe-agent-kit', fullName: 'dsh-community/safe-agent-kit',
    description: '为 Agent 工作流提供清晰的审批边界 · Guardrails for agent workflows.', stars: 176, forks: 12, openIssues: 2,
    language: 'TypeScript', license: 'MIT', updatedAt: now, defaultBranch: 'main', verifiedCommit: 'c'.repeat(40),
    htmlUrl: 'https://github.com/dsh-community/safe-agent-kit', topics: ['agents'], categories: ['agents' as const], starGrowth7d: 8,
    packageName: '@dsh/safe-agent-kit', version: '2.1.0', bundlePatch: './cordis.patch.yml', hasClient: false, verifiedAt: now,
    install: { mode: 'guided' as const, source: 'github' as const, spec: '', profiles: ['web'], requiresBuildApproval: true, requiresRestart: true, manualSteps: true, instructionsUrl: 'https://github.com/dsh-community/safe-agent-kit#install' },
  },
] as const

const installedEntries = [
  {
    packageName: '@dsh/focus-panel', version: '1.3.0', isBundle: true, linked: true, location: 'C:/Users/demo/.dsh/plugins/focus-panel', enabled: true,
    currentSpec: 'github:dsh-labs/focus-panel#' + 'a'.repeat(40), description: catalog[0].description, repositoryUrl: catalog[0].htmlUrl, registryRepo: catalog[0].fullName,
    availableVersion: '1.4.0', availableVersionSource: 'registry' as const, verifiedCommit: catalog[0].verifiedCommit, updateAvailable: true, canUpdate: true, install: catalog[0].install,
  },
  {
    packageName: '@dsh/old-theme', version: '0.9.1', isBundle: true, linked: true, location: 'C:/Users/demo/.dsh/plugins/old-theme', enabled: false,
    currentSpec: 'github:dsh-community/old-theme#stable', description: '停用的主题扩展 · A disabled theme extension.', repositoryUrl: null, registryRepo: null,
    availableVersion: null, availableVersionSource: null, verifiedCommit: null, updateAvailable: false, canUpdate: false, install: null,
  },
  {
    packageName: '@dsh/data-lens', version: '0.8.2', isBundle: true, linked: false, location: 'C:/Users/demo/.dsh/plugins/data-lens', enabled: false,
    currentSpec: 'github:dsh-labs/data-lens#' + 'b'.repeat(40), description: catalog[1].description, repositoryUrl: catalog[1].htmlUrl, registryRepo: catalog[1].fullName,
    availableVersion: '0.8.2', availableVersionSource: 'registry' as const, verifiedCommit: catalog[1].verifiedCommit, updateAvailable: false, canUpdate: false, install: catalog[1].install,
  },
] as const

// 用显式释放的 Promise 控制失败恢复和响应顺序，不依赖机器速度或固定延时。
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

const profileRetry = deferred<MarketplaceInstallLocation>()
const restoredJobs = deferred<MarketplaceJobStatus[]>()
const jobStatusGate = deferred<void>()
const agentRequest = deferred<void>()
const linkedPackages = new Set<string>(installedEntries.filter(entry => entry.linked).map(entry => entry.packageName))
let installJob: MarketplaceJobStatus | null = null

function profileLocation(): MarketplaceInstallLocation {
  return { profile: 'web', packageNames: [...linkedPackages], installDir: 'C:/Users/demo/.dsh/plugins', installDirCustom: false }
}

function finishInstall() {
  if (installJob === null) throw new Error('fixture: 尚未创建安装任务')
  const version = previewCatalog.find(item => item.packageName === installJob?.packageName)?.version ?? '1.0.0'
  installJob = {
    ...installJob, phase: 'done', finishedAt: Date.now(), exitCode: 0,
    outcome: { packageName: installJob.packageName, version, requiresRestart: true },
  }
  linkedPackages.add(installJob.packageName)
}

const fixtureState = {
  installs: 0, uninstalls: 0, searches: 0, uninstallBatches: [] as string[][],
  installRequests: [] as Array<{ repo: string; ref: string }>,
  installLocationCalls: 0, installedCalls: 0, jobsCalls: 0, jobStatusCalls: [] as string[], agentCalls: 0,
  releaseProfile: () => { profileRetry.resolve(profileLocation()) },
  releaseStaleProfile: () => { profileRetry.resolve({ ...profileLocation(), profile: 'stale', packageNames: [] }) },
  failProfile: () => { profileRetry.reject(new Error('fixture: 迟到的 Profile 错误')) },
  releaseJobs: (snapshot: 'empty' | 'stale' = 'empty') => {
    restoredJobs.resolve(snapshot === 'stale' && installJob !== null
      ? [{ ...installJob, phase: 'queued', log: '', finishedAt: null, outcome: null, failure: null }]
      : [])
  },
  releaseJobStatus: () => { jobStatusGate.resolve() },
  finishInstall,
  failAgent: () => { agentRequest.reject(new Error('fixture: Agent 创建失败')) },
}
;(window as unknown as { __marketplaceFixture?: typeof fixtureState }).__marketplaceFixture = fixtureState

// 密度回归用多行插件，避免只有三个样本时漏掉滚动距离问题。
const previewCatalog = params.has('density')
  ? Array.from({ length: 12 }, (_, index) => {
      const item = catalog[index % catalog.length]!
      const repo = `${item.repo}-${index + 1}`
      return { ...item, repo, fullName: `${item.owner}/${repo}`, packageName: `@dsh/${repo}` }
    })
  : catalog

function search(query: string, _page: number, _sort: string, category: string) {
  fixtureState.searches += 1
  const needle = query.trim().toLocaleLowerCase()
  const items = previewCatalog.filter((item) => {
    const matchQuery = needle === '' || [item.repo, item.owner, item.description, ...item.topics].some((value) => value.toLocaleLowerCase().includes(needle))
    const matchCategory = category === 'all' || item.categories.some(value => value === category)
    return matchQuery && matchCategory
  })
  return Promise.resolve({ totalCount: items.length, items, rate })
}

const mockInjected = {
  search,
  details: (repo: string, ref: string) => Promise.resolve({ repo, ref, resolvedRef: ref, manifest: { name: repo, version: '1.0.0', description: '', license: 'MIT', bundlePatch: './cordis.patch.yml', hasClient: true, entry: 'src/index.ts' }, patch: 'bundle: fixture', entrySource: 'export default {}', readmeUrl: 'https://github.com/', rate }),
  guidedAgent: async () => {
    fixtureState.agentCalls += 1
    if (scenario === 'agent-failure') await agentRequest.promise
  },
  install: async (repo: string, ref: string) => {
    fixtureState.installs += 1
    fixtureState.installRequests.push({ repo, ref })
    installJob = {
      jobId: 'fixture-install', kind: 'install', packageName: previewCatalog.find(item => item.fullName === repo)?.packageName ?? repo,
      phase: 'running', log: '', exitCode: null, startedAt: Date.now(), finishedAt: null, outcome: null, failure: null,
    }
    return installJob.jobId
  },
  manualInstall: async () => ({ jobId: 'fixture-manual', operation: 'install' as const, packageName: '@dsh/manual', repository: 'dsh/manual', verifiedCommit: 'd'.repeat(40) }),
  update: async () => 'fixture-update',
  updateBatch: async () => ({ jobs: [], failures: [] }),
  uninstall: async () => { fixtureState.uninstalls += 1; return 'fixture-uninstall' },
  uninstallBatch: async (names: string[]) => { fixtureState.uninstallBatches.push(names); return { jobs: [], failures: [] } },
  setEnabled: async (packageName: string, enabled: boolean) => ({ packageName, enabled, requiresRestart: false }),
  setEnabledBatch: async () => ({ results: [], failures: [], requiresRestart: false }),
  installLocation: async () => {
    fixtureState.installLocationCalls += 1
    if (scenario === 'profile-late') return profileRetry.promise
    if (scenario === 'profile-retry') {
      if (fixtureState.installLocationCalls === 1) throw new Error('fixture: Profile 暂时不可用')
      return profileRetry.promise
    }
    return profileLocation()
  },
  setInstallDir: async (installDir: string) => ({ profile: 'web', packageNames: ['@dsh/focus-panel', '@dsh/old-theme'], installDir, installDirCustom: installDir !== '' }),
  chooseInstallDir: async () => null,
  agentWorkspace: async () => ({ workspaceDir: 'C:/Users/demo/.dsh/marketplace-agent', workspaceDirCustom: false }),
  setAgentWorkspaceDir: async (workspaceDir: string) => ({ workspaceDir, workspaceDirCustom: workspaceDir !== '' }),
  chooseAgentWorkspaceDir: async () => null,
  diagnoseConflicts: async () => ({ conflicts: [], scannedAt: Date.now() }),
  jobStatus: async (jobId: string): Promise<MarketplaceJobStatus> => {
    fixtureState.jobStatusCalls.push(jobId)
    if (scenario === 'jobs-race') await jobStatusGate.promise
    if (installJob !== null && installJob.jobId === jobId) {
      if (scenario !== 'jobs-race' && installJob.finishedAt === null) finishInstall()
      return { ...installJob }
    }
    return { jobId, kind: 'install', packageName: '@dsh/focus-panel', phase: 'done', log: '', exitCode: 0, startedAt: Date.now(), finishedAt: Date.now(), outcome: { packageName: '@dsh/focus-panel', version: '1.4.0', requiresRestart: true }, failure: null }
  },
  jobs: async () => {
    fixtureState.jobsCalls += 1
    return scenario === 'jobs-race' ? restoredJobs.promise : []
  },
  installed: async () => {
    fixtureState.installedCalls += 1
    return { ...profileLocation(), conflicts: [], entries: installedEntries.map(entry => ({ ...entry, linked: linkedPackages.has(entry.packageName) })) }
  },
  restart: async () => ({ accepted: true as const, profile: 'web' }),
}

function Preview() {
  const lang = params.get('lang') === 'en' ? 'en' : 'zh'
  const locale = lang === 'en' ? en : zh
  const t = (key: PluginMarketplaceLocaleKey) => locale[key]
  // 独立页面只提供组件实际消费的 Remote 和翻译，不创建宿主 Slot runtime。
  const props = { ...mockInjected, t } as unknown as MarketplaceTabProps
  return (
    <>
      <style>{themeCss}</style>
      <main className='fixture-shell'>
        <MarketplaceTab {...props} />
      </main>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
