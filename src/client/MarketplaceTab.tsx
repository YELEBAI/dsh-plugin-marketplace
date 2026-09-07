import { useCallback, useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import {
  Button as PrimitiveButton,
  IconChevronDownOutline14,
  IconSearchOutline16,
  Input,
  Pill as PrimitivePill,
  RiskConfirmation,
  StateDot,
  type StateDotState,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {
  MarketplaceAgentWorkspace,
  MarketplaceBatchUpdateResult,
  MarketplaceBatchToggleResult,
  MarketplaceBatchUninstallResult,
  MarketplaceConflict,
  MarketplaceDiagnoseConflictsResult,
  MarketplaceInstalled,
  MarketplaceInstalledEntry,
  MarketplaceInstallLocation,
  MarketplaceJobKind,
  MarketplaceJobStatus,
  MarketplaceManualInstallResult,
  MarketplacePluginDetails,
  MarketplacePluginCategory,
  MarketplaceRegistryPlugin,
  MarketplaceSearchPage,
  MarketplaceRestartResult,
  MarketplaceToggleResult,
} from '../types.ts'
import type { PluginMarketplaceLocaleKey } from './locales.ts'
import { marketplaceStyles } from './marketplace-styles.ts'

/** 保留平台按钮行为，只统一市场内的外观与危险操作标识。 */
function Button({ tone, className = '', ...props }: ComponentProps<typeof PrimitiveButton> & { tone?: 'danger' }): ReactNode {
  return <PrimitiveButton {...props} className={'mkt-button ' + className} data-tone={tone} />
}

function Pill({ active = false, ...props }: ComponentProps<typeof PrimitivePill>): ReactNode {
  return <PrimitivePill {...props} active={active} aria-pressed={active} className='mkt-pill' />
}

function PluginIcon(): ReactNode {
  return <span className='mkt-card-icon' aria-hidden='true'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'><rect x='3' y='3' width='7' height='7' rx='2' /><rect x='14' y='3' width='7' height='7' rx='2' /><rect x='3' y='14' width='7' height='7' rx='2' /><path d='M17.5 14v7M14 17.5h7' /></svg></span>
}

/** Registration-side Remote face used by the section. */
export interface MarketplaceTabInjected {
  search: (
    query: string,
    page: number,
    sort: 'stars' | 'updated' | 'trending',
    category: MarketplacePluginCategory | 'all',
  ) => Promise<MarketplaceSearchPage>
  details: (repo: string, ref: string) => Promise<MarketplacePluginDetails>
  guidedAgent: (repo: string, ref: string, operation: 'install' | 'update') => Promise<void>
  install: (repo: string, ref: string) => Promise<string>
  manualInstall: (command: string) => Promise<MarketplaceManualInstallResult>
  update: (repo: string, ref: string) => Promise<string>
  updateBatch: (updates: Array<{ repo: string; ref: string }>) => Promise<MarketplaceBatchUpdateResult>
  uninstall: (packageName: string) => Promise<string>
  uninstallBatch: (packageNames: string[]) => Promise<MarketplaceBatchUninstallResult>
  setEnabled: (packageName: string, enabled: boolean) => Promise<MarketplaceToggleResult>
  setEnabledBatch: (packageNames: string[], enabled: boolean) => Promise<MarketplaceBatchToggleResult>
  installLocation: () => Promise<MarketplaceInstallLocation>
  setInstallDir: (installDir: string) => Promise<MarketplaceInstallLocation>
  chooseInstallDir: () => Promise<string | null>
  agentWorkspace: () => Promise<MarketplaceAgentWorkspace>
  setAgentWorkspaceDir: (workspaceDir: string) => Promise<MarketplaceAgentWorkspace>
  chooseAgentWorkspaceDir: () => Promise<string | null>
  diagnoseConflicts: () => Promise<MarketplaceDiagnoseConflictsResult>
  jobStatus: (jobId: string) => Promise<MarketplaceJobStatus>
  jobs: () => Promise<MarketplaceJobStatus[]>
  installed: (refresh?: boolean) => Promise<MarketplaceInstalled>
  restart: () => Promise<MarketplaceRestartResult>
}

/** Full component props assembled by the Settings slot renderer. */
export type MarketplaceTabProps =
  PropsRuntime<'settings.plugins.tab'>
  & PropsLocale<'settings.pluginMarketplace'>
  & InjectFace<MarketplaceTabInjected>

type ViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; page: MarketplaceSearchPage }

type ConfirmRequest = {
  mode: 'install' | 'manual-install' | 'update' | 'batch-update' | 'uninstall' | 'batch-uninstall' | 'batch-enable' | 'batch-disable' | 'restart'
  repo: string
  ref: string
  packageName: string
  command: string
  updates?: MarketplaceInstalledEntry[]
}

type Subpage = 'catalog' | 'installed' | 'management'
type InstalledFilter = 'all' | 'updates' | 'enabled' | 'disabled'
type RestartState = 'idle' | 'requesting' | 'restarting'

type Notice = { id: number; message: string; tone: 'error' | 'info' }

const POLL_MS = 700
const DEBOUNCE_MS = 400
const RESULT_PAGE_SIZE = 30
const SELF_PACKAGE = 'dsh-plugin-marketplace'
const CATEGORY_OPTIONS: MarketplacePluginCategory[] = [
  'ui',
  'agents',
  'developer-tools',
  'models',
  'data',
  'integrations',
  'media',
  'security',
  'observability',
  'other',
]

const s = {
  subnavMeta: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' } as React.CSSProperties,
  rateRow: { display: 'flex', justifyContent: 'flex-end', minHeight: 20, marginTop: -8 } as React.CSSProperties,
  muted: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 13, lineHeight: '20px', margin: 0 } as React.CSSProperties,
  failure: { display: 'flex', alignItems: 'center', gap: 10, color: 'var(--dsw-alias-state-error-primary)', fontSize: 13 } as React.CSSProperties,
  banner: {
    border: '1px solid var(--dsw-alias-state-success-primary)',
    background: 'color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent)',
    color: 'var(--dsw-alias-label-primary)',
    borderRadius: 8, padding: '8px 12px', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  } as React.CSSProperties,
  bannerText: { minWidth: 0, flex: 1 } as React.CSSProperties,
  title: { fontSize: 14, fontWeight: 600, lineHeight: '22px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', minWidth: 0 } as React.CSSProperties,
  authorLine: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 11, lineHeight: '17px', margin: '-4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as React.CSSProperties,
  verifiedBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 5, flex: 'none',
    color: 'var(--dsw-alias-state-success-primary)',
    background: 'color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent)',
    border: '1px solid color-mix(in srgb, var(--dsw-alias-state-success-primary) 28%, transparent)',
    borderRadius: 999, padding: '2px 7px', fontSize: 10, lineHeight: '16px',
  } as React.CSSProperties,
  verifiedDot: { width: 5, height: 5, borderRadius: '50%', background: 'var(--dsw-alias-state-success-primary)', flex: 'none' } as React.CSSProperties,
  description: { ...({ color: 'var(--dsw-alias-label-tertiary)', fontSize: 13, lineHeight: '20px', margin: 0 } as React.CSSProperties), display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', minHeight: 40 } as React.CSSProperties,
  statsRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, minHeight: 20, marginTop: 'auto' } as React.CSSProperties,
  statGroup: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 } as React.CSSProperties,
  stat: { color: 'var(--dsw-alias-label-secondary)', fontSize: 12, lineHeight: '18px', whiteSpace: 'nowrap' } as React.CSSProperties,
  growth: { color: 'var(--dsw-alias-state-success-primary)', fontSize: 11, lineHeight: '18px', whiteSpace: 'nowrap' } as React.CSSProperties,
  updatedCompact: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 11, lineHeight: '18px', whiteSpace: 'nowrap' } as React.CSSProperties,
  chipRow: { display: 'flex', alignItems: 'center', gap: 6, minHeight: 22, overflow: 'hidden' } as React.CSSProperties,
  chip: {
    display: 'inline-flex', alignItems: 'center', flex: 'none', maxWidth: 112,
    border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 999,
    background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-secondary)',
    padding: '2px 8px', fontSize: 10, lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  } as React.CSSProperties,
  meta: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 12, lineHeight: '18px', whiteSpace: 'nowrap' } as React.CSSProperties,
  actionLinks: { minWidth: 0, marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14 } as React.CSSProperties,
  details: { borderTop: '1px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-module-platform)', padding: '10px 14px 12px', display: 'flex', flexDirection: 'column', gap: 8 } as React.CSSProperties,
  kv: { display: 'grid', gridTemplateColumns: '76px minmax(0, 1fr)', gap: '4px 10px', margin: 0 } as React.CSSProperties,
  kvDt: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 11, lineHeight: '17px' } as React.CSSProperties,
  kvDd: { overflowWrap: 'anywhere', minWidth: 0, color: 'var(--dsw-alias-label-secondary)', margin: 0, fontSize: 12, lineHeight: '17px' } as React.CSSProperties,
  patch: { overflowWrap: 'anywhere', fontFamily: 'var(--ds-font-family-code)', fontSize: 12, lineHeight: '18px', whiteSpace: 'pre-wrap', background: 'var(--dsw-alias-bg-layer-1)', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 6, padding: 8, maxHeight: 180, overflow: 'auto' } as React.CSSProperties,
  jobPanel: { border: '1px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-1)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 } as React.CSSProperties,
  jobHead: { display: 'flex', alignItems: 'center', gap: 8 } as React.CSSProperties,
  jobLog: { overflowWrap: 'anywhere', fontFamily: 'var(--ds-font-family-code)', fontSize: 11, lineHeight: '16px', whiteSpace: 'pre-wrap', maxHeight: 160, overflow: 'auto', margin: 0, color: 'var(--dsw-alias-label-secondary)' } as React.CSSProperties,
  link: { color: 'var(--dsw-alias-state-business-primary)', fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } as React.CSSProperties,
  chevron: { flex: 'none' } as React.CSSProperties,
  tag: { color: 'var(--dsw-alias-state-success-primary)', fontSize: 11, lineHeight: '16px', flex: 'none' } as React.CSSProperties,
  installedList: { display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0, listStyle: 'none' } as React.CSSProperties,
  queuePanel: { display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-2)', borderRadius: 10, padding: '12px 14px' } as React.CSSProperties,
  queueHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' } as React.CSSProperties,
  queueList: { display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' } as React.CSSProperties,
  installedDescription: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 13, lineHeight: '20px', minHeight: 40, margin: '2px 0 0', overflowWrap: 'anywhere', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 } as React.CSSProperties,
  installedMetaRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 2 } as React.CSSProperties,
  installedStatusRow: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' } as React.CSSProperties,
  installedStatusChip: { display: 'inline-flex', alignItems: 'center', minHeight: 22, border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 999, padding: '1px 8px', color: 'var(--dsw-alias-label-tertiary)', background: 'var(--dsw-alias-bg-layer-2)', fontSize: 11, lineHeight: '18px' } as React.CSSProperties,
  installedStatusChipActive: { borderColor: 'color-mix(in srgb, var(--dsw-alias-state-success-primary) 45%, var(--dsw-alias-border-l2))', color: 'var(--dsw-alias-state-success-primary)' } as React.CSSProperties,
  installedActionButton: { justifyContent: 'center', whiteSpace: 'nowrap' } as React.CSSProperties,
  installedActionLink: { display: 'inline-flex', minHeight: 34, alignItems: 'center', justifyContent: 'center', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 9, padding: '0 12px' } as React.CSSProperties,
  directoryPath: { width: '100%', boxSizing: 'border-box', border: '1px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)', borderRadius: 8, padding: '9px 11px', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: 13 } as React.CSSProperties,
  toast: { position: 'fixed', top: 16, right: 16, zIndex: 99999, maxWidth: 'min(460px, calc(100vw - 32px))', minWidth: 'min(260px, calc(100vw - 32px))', display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 10, padding: '12px 14px', fontSize: 13, lineHeight: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.28)', border: '1px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-3)', color: 'var(--dsw-alias-label-primary)' } as React.CSSProperties,
  toastError: { borderColor: 'var(--dsw-alias-state-error-primary)' } as React.CSSProperties,
  toastInfo: { borderColor: 'var(--dsw-alias-state-success-primary)' } as React.CSSProperties,
  toastText: { flex: 1, minWidth: 0, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' } as React.CSSProperties,
  toastClose: { background: 'none', border: 0, color: 'var(--dsw-alias-label-tertiary)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 } as React.CSSProperties,
  field: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: 10 } as React.CSSProperties,
  fieldLabel: { color: 'var(--dsw-alias-label-secondary)', fontSize: 13, lineHeight: '20px' } as React.CSSProperties,
  fieldMeta: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 12, lineHeight: '18px', margin: 0 } as React.CSSProperties,
  fieldActions: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' } as React.CSSProperties,
  conflictList: { display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' } as React.CSSProperties,
  conflictItem: { border: '1px solid var(--dsw-alias-state-error-primary)', background: 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent)', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 } as React.CSSProperties,
  conflictTitle: { color: 'var(--dsw-alias-state-error-primary)', fontSize: 13, fontWeight: 600, lineHeight: '20px' } as React.CSSProperties,
  conflictBody: { color: 'var(--dsw-alias-label-secondary)', fontSize: 12, lineHeight: '18px', margin: 0, overflowWrap: 'anywhere' } as React.CSSProperties,
  conflictHealthy: { color: 'var(--dsw-alias-state-success-primary)', fontSize: 13, fontWeight: 600, lineHeight: '20px' } as React.CSSProperties,
}

/** Interpolate the {placeholders} used by a few locale keys. */
function fmt(t: (key: PluginMarketplaceLocaleKey) => string, key: PluginMarketplaceLocaleKey, vars: Record<string, string | number>): string {
  let text = t(key)
  for (const [name, value] of Object.entries(vars)) {
    text = text.replace('{' + name + '}', String(value))
  }
  return text
}

function phaseDot(phase: string): StateDotState {
  if (phase === 'done') return 'done'
  if (phase === 'failed') return 'error'
  return 'ongoing'
}

function jobKindLabel(kind: string, t: MarketplaceTabProps['t']): string {
  if (kind === 'uninstall') return t('jobUninstall')
  if (kind === 'update') return t('jobUpdate')
  return t('jobInstall')
}

function jobPhaseLabel(phase: string, t: MarketplaceTabProps['t']): string {
  if (phase === 'done') return t('jobDone')
  if (phase === 'failed') return t('jobFailed')
  if (phase === 'queued') return t('jobQueued')
  if (phase === 'reconciling') return t('jobReconciling')
  return t('jobRunning')
}

function categoryLabel(category: MarketplacePluginCategory, t: MarketplaceTabProps['t']): string {
  if (category === 'ui') return t('categoryUi')
  if (category === 'agents') return t('categoryAgents')
  if (category === 'developer-tools') return t('categoryDeveloperTools')
  if (category === 'models') return t('categoryModels')
  if (category === 'data') return t('categoryData')
  if (category === 'integrations') return t('categoryIntegrations')
  if (category === 'media') return t('categoryMedia')
  if (category === 'security') return t('categorySecurity')
  if (category === 'observability') return t('categoryObservability')
  return t('categoryOther')
}

/** Keep dates useful without letting a full locale date dominate a compact card. */
function compactDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const options: Intl.DateTimeFormatOptions = date.getFullYear() === new Date().getFullYear()
    ? { month: 'short', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' }
  return date.toLocaleDateString(undefined, options)
}

/** 用本地化摘要提示失败，技术细节保留在可展开的队列日志中。 */
function jobFailureNotice(job: MarketplaceJobStatus, t: MarketplaceTabProps['t']): string {
  return fmt(t, 'jobFailureNotice', { package: friendlyPackageName(job.packageName) })
}

function latestJobForPackage(jobs: Map<string, MarketplaceJobStatus>, packageName: string): MarketplaceJobStatus | undefined {
  return [...jobs.values()]
    .filter(job => job.packageName === packageName)
    .sort((left, right) => right.startedAt - left.startedAt)[0]
}

/** 活跃任务全部保留；完成历史只保留最近 12 项，防止长会话无限增长。 */
function boundedJobHistory(jobs: Map<string, MarketplaceJobStatus>): Map<string, MarketplaceJobStatus> {
  const active = [...jobs.values()].filter(job => job.finishedAt === null)
  const finished = [...jobs.values()].filter(job => job.finishedAt !== null)
    .sort((left, right) => right.startedAt - left.startedAt).slice(0, 12)
  return new Map([...active, ...finished].map(job => [job.jobId, job]))
}

function activeJobLabel(job: { kind: string }, t: MarketplaceTabProps['t']): string {
  if (job.kind === 'uninstall') return t('uninstallingAction')
  if (job.kind === 'update') return t('updatingAction')
  return t('installingAction')
}

function friendlyPackageName(packageName: string): string {
  const slash = packageName.lastIndexOf('/')
  return slash >= 0 ? packageName.slice(slash + 1) : packageName
}

/** 中文界面将双语简介中的中文片段提前，同时保留完整原文用于悬浮提示。 */
function preferredDescription(value: string | null | undefined, t: MarketplaceTabProps['t']): string | null {
  const description = value?.trim()
  if (description === undefined || description === '') return null
  if (!/[\u3400-\u9fff]/.test(t('tab')) || !/[\u3400-\u9fff]/.test(description)) return description
  const parts = description.split(/\s*(?:[|｜·]|\s[-—–]\s)\s*|(?<=[.!?])\s+(?=[\u3400-\u9fff])|(?<=[。！？])\s+(?=[A-Za-z])/).filter(Boolean)
  const chinese = parts.filter(part => /[\u3400-\u9fff]/.test(part))
  const other = parts.filter(part => !/[\u3400-\u9fff]/.test(part))
  return [...chinese, ...other].join(' · ')
}

/** Render the marketplace: search, cards, install jobs, pagination. */
export function MarketplaceTab({ search, details, guidedAgent, install, manualInstall, update, updateBatch, uninstall, uninstallBatch, setEnabled, setEnabledBatch, installLocation, setInstallDir, chooseInstallDir, agentWorkspace, setAgentWorkspaceDir, chooseAgentWorkspaceDir, diagnoseConflicts, jobStatus, jobs: loadJobs, installed, restart, t }: MarketplaceTabProps): ReactNode {

  const [view, setView] = useState<ViewState>({ status: 'loading' })
  const [subpage, setSubpage] = useState<Subpage>('catalog')
  const [query, setQuery] = useState('')
  const [installedQuery, setInstalledQuery] = useState('')
  const [installedFilter, setInstalledFilter] = useState<InstalledFilter>('all')
  const [selectedUpdates, setSelectedUpdates] = useState<Set<string>>(new Set())
  const [manualCommand, setManualCommand] = useState('')
  const [manualBusy, setManualBusy] = useState(false)
  const [manualJobId, setManualJobId] = useState<string | null>(null)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [sort, setSort] = useState<'stars' | 'updated' | 'trending'>('stars')
  const [category, setCategory] = useState<MarketplacePluginCategory | 'all'>('all')
  const [page, setPage] = useState(1)
  const [seq, setSeq] = useState(0)
  const [installedMap, setInstalledMap] = useState<Map<string, MarketplaceInstalledEntry>>(new Map())
  const [installedPackages, setInstalledPackages] = useState<Set<string>>(new Set())
  const [installedProfile, setInstalledProfile] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [installedLoading, setInstalledLoading] = useState(true)
  const [installedError, setInstalledError] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Map<string, MarketplaceJobStatus>>(new Map())
  const [startingActions, setStartingActions] = useState<Map<string, MarketplaceJobKind>>(new Map())
  const [batchBusy, setBatchBusy] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [detailsMap, setDetailsMap] = useState<Map<string, MarketplacePluginDetails>>(new Map())
  const [detailErrors, setDetailErrors] = useState<Map<string, string>>(new Map())
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null)
  const [acknowledged, setAcknowledged] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [installDir, setInstallDirState] = useState('')
  const [installDirCustom, setInstallDirCustom] = useState(false)
  const [conflicts, setConflicts] = useState<MarketplaceConflict[]>([])
  const [installDirBusy, setInstallDirBusy] = useState(false)
  const [agentWorkspaceDir, setAgentWorkspaceDirState] = useState('')
  const [agentWorkspaceCustom, setAgentWorkspaceCustom] = useState(false)
  const [agentWorkspaceBusy, setAgentWorkspaceBusy] = useState(false)
  const [diagnosisBusy, setDiagnosisBusy] = useState(false)
  const [diagnosedAt, setDiagnosedAt] = useState<number | null>(null)
  const [toggleBusy, setToggleBusy] = useState<string | null>(null)
  const [restartState, setRestartState] = useState<RestartState>('idle')
  const [agentBusy, setAgentBusy] = useState<string | null>(null)
  const notifiedJobs = useRef<Set<string>>(new Set())
  const installedLoaded = useRef(false)
  const installedRequest = useRef<Promise<MarketplaceInstalled> | null>(null)
  const installedRefreshQueued = useRef(false)
  const installedRefreshForce = useRef(false)
  const updateScrollY = useRef<number | null>(null)

  const notify = useCallback((message: string, tone: 'error' | 'info' = 'error') => {
    setNotice({ id: Date.now(), message, tone })
  }, [])

  // 所有右上角通知都自动消失，避免旧错误长期遮挡后续操作。
  useEffect(() => {
    if (notice === null) return undefined
    const handle = window.setTimeout(() => { setNotice(null) }, 8_000)
    return () => { window.clearTimeout(handle) }
  }, [notice])

  // Debounce the free-text query.
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedQuery(query.trim())
      setPage(1)
    }, DEBOUNCE_MS)
    return () => { window.clearTimeout(handle) }
  }, [query])

  // Run the search.
  useEffect(() => {
    if (subpage !== 'catalog') return undefined
    let current = true
    setView({ status: 'loading' })
    void search(debouncedQuery, page, sort, category).then(
      (result) => { if (current) setView({ status: 'ready', page: result }) },
      (error: unknown) => {
        if (current) setView({ status: 'error', message: error instanceof Error ? error.message : String(error) })
      },
    )
    return () => { current = false }
  }, [debouncedQuery, sort, category, page, seq, search, subpage])

  const refreshInstalled = useCallback((force = false) => {
    if (installedRequest.current !== null) {
      installedRefreshQueued.current = true
      installedRefreshForce.current = installedRefreshForce.current || force
      return
    }
    const start = (requestedForce: boolean): void => {
      setInstalledLoading(true)
      const request = installed(requestedForce)
      installedRequest.current = request
      void request.then(
        (result) => {
          setInstalledMap(new Map(result.entries.map((entry) => [entry.packageName, entry])))
          setInstalledPackages(new Set(result.entries.filter(entry => entry.linked).map(entry => entry.packageName)))
          setInstalledProfile(result.profile)
          if (typeof result.installDir === 'string' && result.installDir !== '') {
            setInstallDirState(result.installDir)
            setInstallDirCustom(Boolean(result.installDirCustom))
          }
          setConflicts(result.conflicts ?? [])
          setSelectedUpdates((current) => new Set(
            [...current].filter((packageName) => result.entries.some((entry) => entry.packageName === packageName && entry.isBundle && entry.linked)),
          ))
          installedLoaded.current = true
          setInstalledError(null)
          setInstalledLoading(false)
        },
        (error: unknown) => {
          setInstalledError(error instanceof Error ? error.message : String(error))
          setInstalledLoading(false)
        },
      ).finally(() => {
        if (installedRequest.current !== request) return
        installedRequest.current = null
        if (!installedRefreshQueued.current) return
        const nextForce = installedRefreshForce.current
        installedRefreshQueued.current = false
        installedRefreshForce.current = false
        start(nextForce)
      })
    }
    start(force)
  }, [installed])

  useEffect(() => {
    if (subpage === 'catalog' || installedLoaded.current) return
    refreshInstalled()
  }, [refreshInstalled, subpage])

  // Keep the install directory in sync even before the first installed() call.
  useEffect(() => {
    let current = true
    void installLocation().then((result) => {
      if (!current) return
      setInstallDirState(result.installDir)
      setInstallDirCustom(Boolean(result.installDirCustom))
      setInstalledProfile(result.profile)
      setInstalledPackages(new Set(result.packageNames))
      setProfileLoading(false)
    }, (error: unknown) => {
      if (current) {
        setProfileLoading(false)
        notify(error instanceof Error ? error.message : String(error))
      }
    })
    return () => { current = false }
  }, [installLocation, notify])

  useEffect(() => {
    let current = true
    void agentWorkspace().then((result) => {
      if (!current) return
      setAgentWorkspaceDirState(result.workspaceDir)
      setAgentWorkspaceCustom(result.workspaceDirCustom)
    }, (error: unknown) => {
      if (current) notify(error instanceof Error ? error.message : String(error))
    })
    return () => { current = false }
  }, [agentWorkspace, notify])

  const loadDetails = useCallback((repo: string, verifiedCommit: string): Promise<MarketplacePluginDetails> => {
    const cached = detailsMap.get(repo)
    if (cached !== undefined) return Promise.resolve(cached)
    return details(repo, verifiedCommit).then((result) => {
      setDetailsMap((current) => new Map(current).set(repo, result))
      setDetailErrors((current) => {
        const next = new Map(current)
        next.delete(repo)
        return next
      })
      return result
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error)
      setDetailErrors((current) => new Map(current).set(repo, message))
      throw error
    })
  }, [details, detailsMap])

  const trackJob = useCallback((jobId: string, kind: MarketplaceJobKind, packageName: string) => {
    setJobs((current) => {
      const next = new Map(current)
      next.set(jobId, {
        jobId,
        kind,
        packageName,
        phase: 'spawning',
        log: '',
        exitCode: null,
        startedAt: Date.now(),
        finishedAt: null,
        outcome: null,
        failure: null,
      })
      return boundedJobHistory(next)
    })
  }, [])

  const markStarting = useCallback((packageName: string, kind: MarketplaceJobKind | null) => {
    setStartingActions((current) => {
      const next = new Map(current)
      if (kind === null) next.delete(packageName)
      else next.set(packageName, kind)
      return next
    })
  }, [])

  const markManyStarting = useCallback((entries: MarketplaceInstalledEntry[], kind: MarketplaceJobKind | null) => {
    setStartingActions((current) => {
      const next = new Map(current)
      for (const entry of entries) {
        if (kind === null) next.delete(entry.packageName)
        else next.set(entry.packageName, kind)
      }
      return next
    })
  }, [])

  // 从 Host 只恢复仍在执行的任务；完成历史不会在重新打开页面后累积。
  useEffect(() => {
    let current = true
    void loadJobs().then((statuses) => {
      if (!current) return
      setJobs(new Map(statuses.map(status => [status.jobId, status])))
      if (statuses.some(status => status.kind === 'update' && status.finishedAt === null)) {
        setSubpage('installed')
      }
    }, () => {
      // 旧版 Host 没有队列接口时，当前页面仍可跟踪本次会话创建的任务。
    })
    return () => { current = false }
  }, [loadJobs])

  // Poll every unfinished job until it settles.
  useEffect(() => {
    const pending = [...jobs.values()].filter((job) => job.finishedAt === null)
    if (pending.length === 0) return undefined
    const handle = window.setInterval(() => {
      for (const job of pending) {
        void jobStatus(job.jobId).then(
          (status) => {
            setJobs((current) => boundedJobHistory(new Map(current).set(status.jobId, status)))
            if (status.finishedAt !== null) {
              setInstalledPackages((current) => {
                const next = new Set(current)
                if (status.kind === 'uninstall') next.delete(status.packageName)
                else if (status.outcome !== null) next.add(status.outcome.packageName)
                return next
              })
              if (installedLoaded.current || subpage !== 'catalog') refreshInstalled()
              if (status.failure !== null && !notifiedJobs.current.has(status.jobId)) {
                notifiedJobs.current.add(status.jobId)
                notify(jobFailureNotice(status, t))
              }
              if (status.outcome !== null && status.outcome.requiresRestart) {
                setBanner(t('restartBanner'))
              }
            }
          },
          () => { /* keep polling; transient wire failures are common */ },
        )
      }
    }, POLL_MS)
    return () => { window.clearInterval(handle) }
  }, [jobs, jobStatus, notify, refreshInstalled, subpage, t])

  // Once the host accepts a restart, wait for it to go offline and come back.
  // The elapsed-time fallback covers a restart that is faster than one probe.
  useEffect(() => {
    if (restartState !== 'restarting') return undefined
    let disposed = false
    let sawOffline = false
    const startedAt = Date.now()
    const probe = async (): Promise<void> => {
      try {
        const url = new URL(window.location.href)
        url.searchParams.set('_dsh_restart_probe', String(Date.now()))
        await window.fetch(url, { cache: 'no-store', credentials: 'same-origin' })
        if (!disposed && (sawOffline || Date.now() - startedAt >= 8_000)) {
          const reloadUrl = new URL(window.location.href)
          reloadUrl.searchParams.set('_dsh_restarted', String(Date.now()))
          window.location.replace(reloadUrl.toString())
        }
      } catch {
        if (!disposed) sawOffline = true
      }
    }
    const first = window.setTimeout(() => { void probe() }, 750)
    const interval = window.setInterval(() => { void probe() }, 500)
    const fallback = window.setTimeout(() => {
      const reloadUrl = new URL(window.location.href)
      reloadUrl.searchParams.set('_dsh_restarted', String(Date.now()))
      window.location.replace(reloadUrl.toString())
    }, 30_000)
    return () => {
      disposed = true
      window.clearTimeout(first)
      window.clearInterval(interval)
      window.clearTimeout(fallback)
    }
  }, [restartState])

  const openConfirm = (mode: ConfirmRequest['mode'], repo: string, ref: string, packageName: string, command = ''): void => {
    updateScrollY.current = window.scrollY
    setAcknowledged(false)
    setConfirm({ mode, repo, ref, packageName, command })
  }

  /** 记录更新操作前的位置，避免列表刷新后回到设置页顶部。 */
  const restoreUpdateScroll = (): void => {
    const scrollY = updateScrollY.current
    updateScrollY.current = null
    if (scrollY !== null) window.requestAnimationFrame(() => { window.scrollTo({ top: scrollY }) })
  }

  const openBatchOperation = (mode: 'batch-update' | 'batch-uninstall' | 'batch-enable' | 'batch-disable', entries: MarketplaceInstalledEntry[]): void => {
    if (entries.length === 0) return
    const accepted = entries.slice(0, 50)
    if (entries.length > accepted.length) notify(t('batchLimitNotice'), 'info')
    updateScrollY.current = window.scrollY
    setAcknowledged(false)
    setConfirm({ mode, repo: '', ref: '', packageName: '', command: '', updates: accepted })
  }

  const runConfirm = (): void => {
    if (confirm === null) return
    setConfirm(null)
    setAcknowledged(false)
    const request = confirm
    if (request.mode === 'restart') {
      setRestartState('requesting')
      setBanner(t('restarting'))
      void restart().then(() => {
        setRestartState('restarting')
      }).catch((error: unknown) => {
        setRestartState('idle')
        notify(error instanceof Error ? error.message : String(error))
      })
      return
    }
    if (request.mode === 'manual-install') {
      setManualBusy(true)
      void manualInstall(request.command).then((result) => {
        setManualJobId(result.jobId)
        setManualCommand('')
        trackJob(result.jobId, result.operation, result.packageName)
      }).catch((error: unknown) => {
        notify(error instanceof Error ? error.message : String(error))
      }).finally(() => { setManualBusy(false) })
      return
    }
    if (request.mode === 'batch-update') {
      setSubpage('installed')
      const entries = request.updates ?? []
      const updates = entries.flatMap((entry) => entry.registryRepo !== null && entry.verifiedCommit !== null
        ? [{ repo: entry.registryRepo, ref: entry.verifiedCommit }]
        : [])
      setBatchBusy(true)
      markManyStarting(entries, 'update')
      void updateBatch(updates).then((result) => {
        for (const job of result.jobs) trackJob(job.jobId, 'update', job.packageName)
        setSelectedUpdates(new Set())
        if (result.failures.length > 0) {
          notify(result.failures.map((failure) => failure.repo + '：' + t('queueRejected')).join('\n'))
        }
        restoreUpdateScroll()
      }).catch((error: unknown) => {
        restoreUpdateScroll()
        notify(error instanceof Error ? error.message : String(error))
      }).finally(() => { setBatchBusy(false); markManyStarting(entries, null) })
      return
    }
    if (request.mode === 'batch-uninstall') {
      const entries = request.updates ?? []
      setBatchBusy(true)
      markManyStarting(entries, 'uninstall')
      void uninstallBatch(entries.map(entry => entry.packageName)).then((result) => {
        for (const job of result.jobs) trackJob(job.jobId, 'uninstall', job.packageName)
        setSelectedUpdates(new Set())
        if (result.failures.length > 0) {
          notify(result.failures.map(failure => failure.packageName + '：' + t('queueRejected')).join('\n'))
        }
        restoreUpdateScroll()
      }).catch((error: unknown) => {
        restoreUpdateScroll()
        notify(error instanceof Error ? error.message : String(error))
      }).finally(() => { setBatchBusy(false); markManyStarting(entries, null) })
      return
    }
    if (request.mode === 'batch-enable' || request.mode === 'batch-disable') {
      const entries = request.updates ?? []
      const enabled = request.mode === 'batch-enable'
      setBatchBusy(true)
      void setEnabledBatch(entries.map(entry => entry.packageName), enabled).then((result) => {
        setInstalledMap((current) => {
          const next = new Map(current)
          for (const changed of result.results) {
            const entry = next.get(changed.packageName)
            if (entry !== undefined) next.set(changed.packageName, { ...entry, enabled: changed.enabled })
          }
          return next
        })
        setSelectedUpdates(new Set())
        if (result.failures.length > 0) {
          notify(result.failures.map(failure => failure.packageName + '：' + t('batchActionRejected')).join('\n'))
        }
        if (result.requiresRestart) setBanner(t('toggleRestartBanner'))
        refreshInstalled()
        restoreUpdateScroll()
      }).catch((error: unknown) => {
        restoreUpdateScroll()
        notify(error instanceof Error ? error.message : String(error))
      }).finally(() => { setBatchBusy(false) })
      return
    }
    const jobKind = request.mode
    if (jobKind === 'update') setSubpage('installed')
    const start = jobKind === 'uninstall'
      ? uninstall(request.packageName)
      : jobKind === 'update'
        ? update(request.repo, request.ref)
        : install(request.repo, request.ref)
    markStarting(request.packageName, jobKind)
    void start.then((jobId) => {
      markStarting(request.packageName, null)
      trackJob(jobId, jobKind, request.packageName)
      restoreUpdateScroll()
    }).catch((error: unknown) => {
      markStarting(request.packageName, null)
      restoreUpdateScroll()
      notify(error instanceof Error ? error.message : String(error))
    })
  }

  const onInstall = (item: MarketplaceRegistryPlugin): void => {
    if (installedMap.has(item.packageName)) {
      notify(t('alreadyInstalled'), 'info')
      return
    }
    openConfirm(
      'install',
      item.fullName === '' ? item.owner + '/' + item.repo : item.fullName,
      item.verifiedCommit,
      item.packageName,
    )
  }

  const onGuidedAgent = (repo: string, ref: string, packageName: string, operation: 'install' | 'update'): void => {
    setAgentBusy(repo)
    setBanner(t('agentStarting'))
    void guidedAgent(repo, ref, operation).then(() => {
      setBanner(fmt(t, 'agentStarted', { package: packageName }))
    }).catch((error: unknown) => {
      notify(error instanceof Error ? error.message : String(error))
    }).finally(() => { setAgentBusy(null) })
  }

  const onSetEnabled = (entry: MarketplaceInstalledEntry): void => {
    const enabled = !entry.enabled
    setToggleBusy(entry.packageName)
    void setEnabled(entry.packageName, enabled).then((result) => {
      setInstalledMap((current) => {
        const next = new Map(current)
        const value = next.get(result.packageName)
        if (value !== undefined) next.set(result.packageName, { ...value, enabled: result.enabled })
        return next
      })
      if (result.requiresRestart) setBanner(t('toggleRestartBanner'))
      refreshInstalled()
    }).catch((error: unknown) => {
      notify(error instanceof Error ? error.message : String(error))
    }).finally(() => { setToggleBusy(null) })
  }

  const retry = (): void => { setSeq((value) => value + 1) }
  const openRestartConfirm = (): void => { openConfirm('restart', '', '', '') }

  const applyInstallDir = (value: string, noticeKey: PluginMarketplaceLocaleKey): void => {
    setInstallDirBusy(true)
    setInstallDir(value).then((result) => {
      setInstallDirState(result.installDir)
      setInstallDirCustom(Boolean(result.installDirCustom))
      setInstalledProfile(result.profile)
      setInstalledPackages(new Set(result.packageNames))
      notify(t(noticeKey), 'info')
      refreshInstalled()
    }).catch((error: unknown) => {
      notify(error instanceof Error ? error.message : String(error))
    }).finally(() => {
      setInstallDirBusy(false)
    })
  }

  const chooseInstallLocation = (): void => {
    setInstallDirBusy(true)
    void chooseInstallDir().then((value) => {
      if (value === null || value.trim() === '') {
        setInstallDirBusy(false)
        return
      }
      if (value === installDir) {
        notify(t('installDirUnchanged'), 'info')
        setInstallDirBusy(false)
        return
      }
      applyInstallDir(value, 'installDirSaved')
    }).catch((error: unknown) => {
      notify(error instanceof Error ? error.message : String(error))
      setInstallDirBusy(false)
    })
  }

  const resetInstallLocation = (): void => {
    applyInstallDir('', 'installDirReset')
  }

  const applyAgentWorkspace = (value: string, noticeKey: PluginMarketplaceLocaleKey): void => {
    setAgentWorkspaceBusy(true)
    void setAgentWorkspaceDir(value).then((result) => {
      setAgentWorkspaceDirState(result.workspaceDir)
      setAgentWorkspaceCustom(result.workspaceDirCustom)
      notify(t(noticeKey), 'info')
    }).catch((error: unknown) => {
      notify(error instanceof Error ? error.message : String(error))
    }).finally(() => { setAgentWorkspaceBusy(false) })
  }

  const chooseAgentWorkspace = (): void => {
    setAgentWorkspaceBusy(true)
    void chooseAgentWorkspaceDir().then((value) => {
      if (value === null || value.trim() === '') {
        setAgentWorkspaceBusy(false)
        return
      }
      if (value === agentWorkspaceDir) {
        notify(t('agentWorkspaceUnchanged'), 'info')
        setAgentWorkspaceBusy(false)
        return
      }
      applyAgentWorkspace(value, 'agentWorkspaceSaved')
    }).catch((error: unknown) => {
      notify(error instanceof Error ? error.message : String(error))
      setAgentWorkspaceBusy(false)
    })
  }

  const resetAgentWorkspace = (): void => {
    applyAgentWorkspace('', 'agentWorkspaceReset')
  }

  const runDiagnosis = (): void => {
    setDiagnosisBusy(true)
    void diagnoseConflicts().then((result) => {
      setConflicts(result.conflicts)
      setDiagnosedAt(result.scannedAt)
      notify(
        result.conflicts.length === 0 ? t('diagnosisClean') : fmt(t, 'diagnosisFound', { count: result.conflicts.length }),
        result.conflicts.length === 0 ? 'info' : 'error',
      )
    }).catch((error: unknown) => {
      notify(error instanceof Error ? error.message : String(error))
    }).finally(() => {
      setDiagnosisBusy(false)
    })
  }

  const ready = view.status === 'ready' ? view.page : null
  const rate = ready?.rate ?? null
  const hasActiveJobs = [...jobs.values()].some((job) => job.finishedAt === null)
  const restartDisabled = restartState !== 'idle' || hasActiveJobs || batchBusy || startingActions.size > 0
  const isSelfUpdate = confirm?.mode === 'update' && confirm.packageName === SELF_PACKAGE
  const isManualInstall = confirm?.mode === 'manual-install'
  const isBatchUpdate = confirm?.mode === 'batch-update'
  const isBatchUninstall = confirm?.mode === 'batch-uninstall'
  const isBatchEnable = confirm?.mode === 'batch-enable'
  const isBatchDisable = confirm?.mode === 'batch-disable'
  const manualJob = manualJobId === null ? undefined : jobs.get(manualJobId)
  const installedEntries = [...installedMap.values()].filter(entry => entry.isBundle)
  const installedNeedle = installedQuery.trim().toLocaleLowerCase()
  const enabledInstalledCount = installedEntries.filter((entry) => entry.linked && entry.enabled).length
  const disabledInstalledCount = installedEntries.filter((entry) => entry.linked && !entry.enabled).length
  const updateAvailableCount = installedEntries.filter((entry) => entry.linked && entry.updateAvailable).length
  const visibleInstalledEntries = installedEntries.filter((entry) => {
    if (installedFilter === 'updates' && (!entry.linked || !entry.updateAvailable)) return false
    if (installedFilter === 'enabled' && (!entry.linked || !entry.enabled)) return false
    if (installedFilter === 'disabled' && (!entry.linked || entry.enabled)) return false
    return installedNeedle === '' || [
      entry.packageName,
      entry.description ?? '',
      entry.registryRepo ?? '',
      entry.version,
    ].some(value => value.toLocaleLowerCase().includes(installedNeedle))
  })
  const visibleUpdateableEntries = visibleInstalledEntries.filter((entry) => entry.updateAvailable && entry.canUpdate && entry.registryRepo !== null && entry.verifiedCommit !== null)
  const selectedEntries = installedEntries.filter(entry => entry.linked && selectedUpdates.has(entry.packageName))
  const selectedUpdateEntries = selectedEntries.filter((entry) => entry.updateAvailable && entry.canUpdate && entry.registryRepo !== null && entry.verifiedCommit !== null)
  const selectedEnabledEntries = selectedEntries.filter(entry => entry.enabled)
  const selectedDisabledEntries = selectedEntries.filter(entry => !entry.enabled)
  const operationQueue = [...jobs.values()].sort((left, right) => left.startedAt - right.startedAt)
  const installedEmptyMessage = installedNeedle !== ''
    ? t('emptyInstalledSearch')
    : installedFilter === 'enabled'
      ? t('emptyEnabledInstalled')
      : installedFilter === 'disabled'
        ? t('emptyDisabledInstalled')
        : installedFilter === 'updates'
          ? t('emptyUpdateInstalled')
          : t('emptyInstalled')
  const confirmCount = confirm?.updates?.length ?? 0
  const confirmationTitle = confirm?.mode === 'restart' ? t('confirmRestartTitle')
    : confirm?.mode === 'uninstall' ? t('confirmUninstallTitle')
      : isBatchUninstall ? t('confirmBatchUninstallTitle')
        : isBatchEnable ? t('confirmBatchEnableTitle')
          : isBatchDisable ? t('confirmBatchDisableTitle')
            : isBatchUpdate ? t('confirmBatchUpdateTitle')
              : isManualInstall ? t('confirmManualInstallTitle')
                : isSelfUpdate ? t('confirmSelfUpdateTitle')
                  : confirm?.mode === 'update' ? t('confirmUpdateTitle') : t('confirmTitle')
  const confirmationDescription = confirm?.mode === 'restart' ? t('confirmRestartDescription')
    : confirm?.mode === 'uninstall' ? t('confirmUninstallDescription')
      : isBatchUninstall ? fmt(t, 'confirmBatchUninstallDescription', { count: confirmCount })
        : isBatchEnable ? fmt(t, 'confirmBatchEnableDescription', { count: confirmCount })
          : isBatchDisable ? fmt(t, 'confirmBatchDisableDescription', { count: confirmCount })
            : isBatchUpdate ? fmt(t, 'confirmBatchUpdateDescription', { count: confirmCount })
              : isManualInstall ? t('confirmManualInstallDescription')
                : isSelfUpdate ? t('confirmSelfUpdateDescription')
                  : confirm?.mode === 'update' ? t('confirmUpdateDescription') : t('confirmDescription')
  const confirmationLabel = confirm?.mode === 'restart' ? t('confirmRestart')
    : confirm?.mode === 'uninstall' ? t('confirmUninstall')
      : isBatchUninstall ? t('confirmBatchUninstall')
        : isBatchEnable ? t('confirmBatchEnable')
          : isBatchDisable ? t('confirmBatchDisable')
            : isBatchUpdate ? t('confirmBatchUpdate')
              : isManualInstall ? t('confirmManualInstall')
                : isSelfUpdate ? t('selfUpdate')
                  : confirm?.mode === 'update' ? t('confirmUpdate') : t('confirm')

  return (
    <div className='dsh-marketplace' aria-busy={(subpage === 'catalog' && view.status === 'loading') || restartState !== 'idle' || batchBusy}>
      <style>{marketplaceStyles}</style>
      <header className='mkt-heading'>
        <h2>{t(subpage === 'catalog' ? 'catalog' : subpage === 'installed' ? 'installedPage' : 'managementPage')}</h2>
        <p>{t(subpage === 'catalog' ? 'catalogHint' : subpage === 'installed' ? 'installedHint' : 'managementHint')}</p>
      </header>
      {banner !== null ? (
        <div style={s.banner} role={banner === t('restartBanner') || restartState !== 'idle' ? 'status' : 'alert'}>
          <span style={s.bannerText}>{banner}</span>
          {banner === t('restartBanner') ? (
            <Button variant='outline' size='sm' disabled={restartDisabled} onClick={openRestartConfirm}>{t('restart')}</Button>
          ) : null}
        </div>
      ) : null}
      <div className='mkt-subnav'>
        <div className='mkt-subnav-group' role='group' aria-label={t('marketplaceNavigation')}>
          <Pill active={subpage === 'catalog'} onClick={() => { setSubpage('catalog') }}>{t('catalog')}</Pill>
          <Pill active={subpage === 'installed'} onClick={() => { setSubpage('installed') }}>{t('installedPage')}</Pill>
          <Pill active={subpage === 'management'} onClick={() => { setSubpage('management') }}>{t('managementPage')}</Pill>
        </div>
        <div style={s.subnavMeta}>
          {installedProfile !== '' ? <span className='mkt-profile'>{fmt(t, 'currentProfile', { profile: installedProfile })}</span> : null}
          {subpage !== 'catalog' ? (
            <Button variant='outline' size='sm' disabled={restartDisabled} onClick={openRestartConfirm}>
              {restartState === 'idle' ? t('restart') : t('restarting')}
            </Button>
          ) : null}
        </div>
      </div>
      {subpage === 'installed' && operationQueue.length > 0 ? (
        <OperationQueuePanel
          jobs={operationQueue}
          t={t}
          onClearFinished={() => { setJobs(current => new Map([...current].filter(([, job]) => job.finishedAt === null))) }}
        />
      ) : null}
      {subpage === 'catalog' ? (
        <>
          <div className='mkt-toolbar'>
            <div className='mkt-search'>
              <Input
                type='search'
                icon={<IconSearchOutline16 aria-hidden='true' />}
                value={query}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                onChange={(event) => { setQuery(event.currentTarget.value) }}
              />
            </div>
            <div className='mkt-sort-group'>
              <select
                className='mkt-select'
                value={category}
                aria-label={t('category')}
                onChange={(event) => {
                  setCategory(event.currentTarget.value as MarketplacePluginCategory | 'all')
                  setPage(1)
                }}
              >
                <option value='all'>{t('categoryAll')}</option>
                {CATEGORY_OPTIONS.map((value) => <option key={value} value={value}>{categoryLabel(value, t)}</option>)}
              </select>
              <Pill active={sort === 'stars'} onClick={() => { setSort('stars'); setPage(1) }}>{t('sortStars')}</Pill>
              <Pill active={sort === 'trending'} onClick={() => { setSort('trending'); setPage(1) }}>{t('sortTrending')}</Pill>
              <Pill active={sort === 'updated'} onClick={() => { setSort('updated'); setPage(1) }}>{t('sortUpdated')}</Pill>
            </div>
          </div>
          <div className='mkt-results'>
            <span role='status'>{ready !== null ? fmt(t, 'resultCount', { count: ready.totalCount }) : view.status === 'loading' ? t('loading') : ''}</span>
            {query !== '' || category !== 'all' || sort !== 'stars' ? (
              <Button variant='ghost' size='sm' onClick={() => { setQuery(''); setDebouncedQuery(''); setCategory('all'); setSort('stars'); setPage(1) }}>{t('resetFilters')}</Button>
            ) : null}
          </div>
          {rate !== null && rate.limit > 0 ? (
            <div style={s.rateRow}>
              <span style={s.muted}>
                {fmt(t, 'rateLimit', { remaining: rate.remaining, reset: rate.reset > 0 ? Math.max(0, rate.reset - Math.floor(Date.now() / 1000)) + 's' : '—' })}
              </span>
            </div>
          ) : null}
          {view.status === 'loading' ? <div className='mkt-empty' role='status'><IconSearchOutline16 aria-hidden='true' /><p>{t('loading')}</p></div> : null}
          {view.status === 'error' ? (
            <div style={s.failure}>
              <p role='alert' style={s.muted}>{t('error')} {view.message}</p>
              <Button variant='outline' size='sm' onClick={retry}>{t('retry')}</Button>
            </div>
          ) : null}
          {ready !== null && ready.items.length === 0 ? <div className='mkt-empty' role='status'><IconSearchOutline16 aria-hidden='true' /><p>{debouncedQuery === '' && category === 'all' ? t('empty') : t('emptySearch')}</p></div> : null}
          {ready !== null && ready.items.length > 0 ? (
            <ul className='mkt-cards'>
              {ready.items.map((item) => (
                <CardRow
                  key={item.fullName}
                  item={item}
                  t={t}
                  currentProfile={installedProfile}
                  profileLoading={profileLoading}
                  profileAvailable={installedError === null && installedProfile !== ''}
                  isInstalled={installedPackages.has(item.packageName)}
                  job={latestJobForPackage(jobs, item.packageName)}
                  startingKind={startingActions.get(item.packageName) ?? null}
                  expanded={expanded === item.fullName}
                  detail={detailsMap.get(item.fullName)}
                  detailError={detailErrors.get(item.fullName)}
                  onToggle={() => {
                    if (expanded === item.fullName) { setExpanded(null); return }
                    setExpanded(item.fullName)
                    void loadDetails(item.fullName, item.verifiedCommit).catch(() => { /* the error renders in the card */ })
                  }}
                  onInstall={() => { onInstall(item) }}
                  onGuidedAgent={() => { onGuidedAgent(item.fullName, item.verifiedCommit, item.packageName, 'install') }}
                  agentBusy={agentBusy === item.fullName}
                />
              ))}
            </ul>
          ) : null}
          {ready !== null ? (
            <div className='mkt-pager'>
              <Button variant='outline' size='sm' disabled={page <= 1} onClick={() => { setPage((value) => Math.max(1, value - 1)) }}>{t('pagePrev')}</Button>
              <span style={s.muted}>{fmt(t, 'pageOf', { page })} · {fmt(t, 'total', { total: ready.totalCount })}</span>
              <Button variant='outline' size='sm' disabled={page * RESULT_PAGE_SIZE >= ready.totalCount} onClick={() => { setPage((value) => value + 1) }}>{t('pageNext')}</Button>
            </div>
          ) : null}
        </>
      ) : subpage === 'installed' ? (
        <>
          <div className='mkt-toolbar'>
            <div className='mkt-search'>
              <Input
                type='search'
                icon={<IconSearchOutline16 aria-hidden='true' />}
                value={installedQuery}
                placeholder={t('installedSearchPlaceholder')}
                aria-label={t('installedSearchPlaceholder')}
                onChange={(event) => { setInstalledQuery(event.currentTarget.value) }}
              />
            </div>
            <Pill active={installedFilter === 'all'} onClick={() => { setInstalledFilter('all') }}>
              {fmt(t, 'allInstalled', { count: installedEntries.length })}
            </Pill>
            <Pill active={installedFilter === 'updates'} onClick={() => { setInstalledFilter('updates') }}>
              {fmt(t, 'updatesInstalled', { count: updateAvailableCount })}
            </Pill>
            <Pill active={installedFilter === 'enabled'} onClick={() => { setInstalledFilter('enabled') }}>
              {fmt(t, 'enabledInstalled', { count: enabledInstalledCount })}
            </Pill>
            <Pill active={installedFilter === 'disabled'} onClick={() => { setInstalledFilter('disabled') }}>
              {fmt(t, 'disabledInstalled', { count: disabledInstalledCount })}
            </Pill>
            <Button variant='outline' size='sm' disabled={installedLoading} onClick={() => { refreshInstalled(true) }}>
              {installedLoading ? t('checkingUpdates') : t('checkUpdates')}
            </Button>
          </div>
          {installedQuery !== '' || installedFilter !== 'all' ? (
            <div className='mkt-results'>
              <span role='status'>{fmt(t, 'resultCount', { count: visibleInstalledEntries.length })}</span>
              <Button variant='ghost' size='sm' onClick={() => { setInstalledQuery(''); setInstalledFilter('all') }}>{t('resetFilters')}</Button>
            </div>
          ) : null}
          <InstalledList
            entries={visibleInstalledEntries}
            selection={selectedEntries}
            currentProfile={installedProfile}
            loading={installedLoading}
            error={installedError}
            emptyMessage={installedEmptyMessage}
            t={t}
            onRetry={refreshInstalled}
            onUpdate={(entry) => {
              if (entry.registryRepo !== null && entry.verifiedCommit !== null) {
                openConfirm('update', entry.registryRepo, entry.verifiedCommit, entry.packageName)
              }
            }}
            selectedUpdates={selectedUpdates}
            onToggleSelected={(entry) => {
              setSelectedUpdates((current) => {
                const next = new Set(current)
                if (next.has(entry.packageName)) next.delete(entry.packageName)
                else next.add(entry.packageName)
                return next
              })
            }}
            onSelectVisible={() => {
              setSelectedUpdates((current) => {
                const next = new Set(current)
                const visibleLinked = visibleInstalledEntries.filter(entry => entry.linked)
                const allSelected = visibleLinked.every(entry => next.has(entry.packageName))
                for (const entry of visibleLinked) {
                  if (allSelected) next.delete(entry.packageName)
                  else next.add(entry.packageName)
                }
                return next
              })
            }}
            onClearSelection={() => { setSelectedUpdates(new Set()) }}
            onUpdateSelected={() => { openBatchOperation('batch-update', selectedUpdateEntries) }}
            onUpdateAll={() => { openBatchOperation('batch-update', visibleUpdateableEntries) }}
            onEnableSelected={() => { openBatchOperation('batch-enable', selectedDisabledEntries) }}
            onDisableSelected={() => { openBatchOperation('batch-disable', selectedEnabledEntries) }}
            onUninstallSelected={() => { openBatchOperation('batch-uninstall', selectedEntries) }}
            onUninstall={(entry) => { openConfirm('uninstall', '', '', entry.packageName) }}
            onSetEnabled={onSetEnabled}
            onAgentUpdate={(entry) => {
              if (entry.registryRepo === null || entry.verifiedCommit === null || entry.install === null) return
              onGuidedAgent(entry.registryRepo, entry.verifiedCommit, entry.packageName, 'update')
            }}
            agentBusy={agentBusy}
            toggleBusy={toggleBusy}
            jobs={jobs}
            startingActions={startingActions}
            batchBusy={batchBusy}
          />
        </>
      ) : (
        <>
          <div className='mkt-management'>
          <ManualInstallPanel
            command={manualCommand}
            profile={installedProfile}
            busy={manualBusy || (manualJob !== undefined && manualJob.finishedAt === null)}
            job={manualJob}
            onCommandChange={setManualCommand}
            onInstall={() => { openConfirm('manual-install', '', '', '', manualCommand.trim()) }}
            t={t}
          />
          <InstallDirField
            installDir={installDir}
            installDirCustom={installDirCustom}
            onChoose={chooseInstallLocation}
            onReset={resetInstallLocation}
            busy={installDirBusy}
            t={t}
          />
          <AgentWorkspaceField
            workspaceDir={agentWorkspaceDir}
            workspaceDirCustom={agentWorkspaceCustom}
            onChoose={chooseAgentWorkspace}
            onReset={resetAgentWorkspace}
            busy={agentWorkspaceBusy}
            t={t}
          />
          <ConflictPanel
            conflicts={conflicts}
            diagnosedAt={diagnosedAt}
            busy={diagnosisBusy}
            onDiagnose={runDiagnosis}
            t={t}
          />
          </div>
        </>
      )}
      <RiskConfirmation
        open={confirm !== null}
        title={confirmationTitle}
        description={confirmationDescription}
        acknowledgeLabel={confirm?.mode === 'restart' ? t('acknowledgeRestart') : confirm?.mode === 'uninstall' || isBatchUninstall ? t('acknowledgeUninstall') : isManualInstall ? t('acknowledgeManualInstall') : t('acknowledge')}
        cancelLabel={t('cancel')}
        closeLabel={t('dismiss')}
        confirmLabel={confirmationLabel}
        acknowledged={acknowledged}
        onAcknowledgedChange={setAcknowledged}
        onCancel={() => { updateScrollY.current = null; setConfirm(null); setAcknowledged(false) }}
        onConfirm={runConfirm}
      />
      {notice !== null ? (
        <div
          style={notice.tone === 'error' ? { ...s.toast, ...s.toastError } : { ...s.toast, ...s.toastInfo }}
          role='alert'
        >
          <span style={s.toastText}>{notice.message}</span>
          <button type='button' style={s.toastClose} aria-label={t('dismiss')} onClick={() => { setNotice(null) }}>×</button>
        </div>
      ) : null}
    </div>
  )
}

interface CardRowProps {
  item: MarketplaceRegistryPlugin
  t: MarketplaceTabProps['t']
  currentProfile: string
  profileLoading: boolean
  profileAvailable: boolean
  isInstalled: boolean
  job: MarketplaceJobStatus | undefined
  startingKind: MarketplaceJobKind | null
  expanded: boolean
  detail: MarketplacePluginDetails | undefined
  detailError: string | undefined
  onToggle: () => void
  onInstall: () => void
  onGuidedAgent: () => void
  agentBusy: boolean
}

function CardRow({ item, t, currentProfile, profileLoading, profileAvailable, isInstalled, job, startingKind, expanded, detail, detailError, onToggle, onInstall, onGuidedAgent, agentBusy }: CardRowProps): ReactNode {
  const canInstall = item.install.mode === 'automatic'
    && (item.install.source === 'github' || item.install.source === 'npm')
    && currentProfile !== ''
    && item.install.profiles.includes(currentProfile)
  const canUseAgent = item.install.mode === 'guided'
    && currentProfile !== ''
    && (item.install.profiles.length === 0 || item.install.profiles.includes(currentProfile))
  const jobActive = job !== undefined && job.finishedAt === null
  const operationActive = startingKind !== null || jobActive
  const description = preferredDescription(item.description, t)
  return (
    <li className='mkt-card'>
      <div className='mkt-card-body'>
        <div className='mkt-card-head'>
          <PluginIcon />
          <div className='mkt-card-name'>
            <strong style={s.title} title={item.fullName}>{item.repo}</strong>
            <p style={s.authorLine} title={item.owner}>{item.owner}</p>
          </div>
          <span style={s.verifiedBadge}><span style={s.verifiedDot} aria-hidden='true' />{t('verified')}</span>
        </div>
        <p style={s.description} title={item.description ?? undefined}>{description ?? '\u00A0'}</p>
        <div style={s.statsRow}>
          <div style={s.statGroup}>
            <span style={s.stat} title={t('stars')}>★ {item.stars}</span>
            {item.starGrowth7d > 0 ? <span style={s.growth}>{fmt(t, 'starGrowth7d', { stars: item.starGrowth7d })}</span> : null}
          </div>
          {item.updatedAt !== '' ? <span style={s.updatedCompact} title={t('updated') + ' ' + new Date(item.updatedAt).toLocaleDateString()}>{compactDate(item.updatedAt)}</span> : null}
        </div>
        <div style={s.chipRow}>
          {item.categories.slice(0, 2).map((category) => <span key={category} style={s.chip}>{categoryLabel(category, t)}</span>)}
        </div>
        <div className='mkt-card-actions'>
          {operationActive ? (
            <Button variant='primary' size='sm' disabled>{activeJobLabel({ kind: job?.kind ?? startingKind ?? 'install' }, t)}</Button>
          ) : isInstalled ? (
            <Button variant='outline' size='sm' disabled>{t('installedTag')}</Button>
          ) : profileLoading ? (
            <Button variant='outline' size='sm' disabled>{t('checkingInstall')}</Button>
          ) : !profileAvailable ? (
            <Button variant='outline' size='sm' disabled>{t('installUnavailable')}</Button>
          ) : canInstall ? (
            <Button variant='primary' size='sm' onClick={onInstall}>{t('install')}</Button>
          ) : canUseAgent ? (
            <Button variant='primary' size='sm' disabled={agentBusy} onClick={onGuidedAgent}>
              {agentBusy ? t('agentBusy') : t('agentInstall')}
            </Button>
          ) : (
            <a style={s.link} href={item.install.instructionsUrl} target='_blank' rel='noreferrer'>{t('installGuide')}</a>
          )}
          <div style={s.actionLinks}>
            <a style={s.link} href={item.htmlUrl} target='_blank' rel='noreferrer' title={item.fullName}>{t('openInGithub')}</a>
            <button type='button' className='mkt-detail-toggle' aria-expanded={expanded} onClick={onToggle}>
              {t('details')}
              <span style={{ ...s.chevron, display: 'inline-flex', transform: expanded ? 'rotate(180deg)' : undefined }}>
                <IconChevronDownOutline14 size={12} aria-hidden='true' />
              </span>
            </button>
          </div>
        </div>
      </div>
      {expanded ? (
        <div style={s.details}>
          {detailError !== undefined ? <p style={s.failure} role='alert'>{detailError}</p> : null}
          {detail === undefined && detailError === undefined ? <p style={s.muted}>{t('loading')}</p> : null}
          {detail !== undefined && detail.manifest === null ? <p style={s.muted}>{t('noManifest')}</p> : null}
          {detail !== undefined && detail.manifest !== null ? (
            <dl style={s.kv}>
              <dt style={s.kvDt}>{t('manifest')}</dt>
              <dd style={s.kvDd}>{detail.manifest.name + '@' + detail.manifest.version}</dd>
              <dt style={s.kvDt}>{t('license')}</dt>
              <dd style={s.kvDd}>{detail.manifest.license ?? t('none')}</dd>
              <dt style={s.kvDt}>{t('language')}</dt>
              <dd style={s.kvDd}>{item.language ?? t('none')}</dd>
              <dt style={s.kvDt}>{t('category')}</dt>
              <dd style={s.kvDd}>{item.categories.map((category) => categoryLabel(category, t)).join(', ')}</dd>
              {detail.manifest.hasClient ? (
                <>
                  <dt style={s.kvDt}>{t('hasClient')}</dt>
                  <dd style={s.kvDd}>web</dd>
                </>
              ) : null}
              <dt style={s.kvDt}>{t('verifiedCommit')}</dt>
              <dd style={s.kvDd}>{detail.resolvedRef}</dd>
              <dt style={s.kvDt}>{t('installSource')}</dt>
              <dd style={s.kvDd}>{item.install.source} · {item.install.mode === 'automatic' ? t('automaticInstall') : t('guidedInstall')}</dd>
              <dt style={s.kvDt}>{t('profiles')}</dt>
              <dd style={s.kvDd}>{item.install.profiles.length > 0 ? item.install.profiles.join(', ') : t('profileUnknown')}</dd>
              {item.dshStd !== undefined ? (
                <>
                  <dt style={s.kvDt}>{t('dshStd')}</dt>
                  <dd style={s.kvDd}>{item.dshStd.status === 'valid'
                    ? t('dshStdValid')
                    : t('dshStdInvalid', { issue: item.dshStd.issues[0] ?? t('none') })}</dd>
                  {item.dshStd.status === 'valid' ? (
                    <>
                      <dt style={s.kvDt}>{t('dshStdContracts')}</dt>
                      <dd style={s.kvDd}>{item.dshStd.requirements?.length ? item.dshStd.requirements.join(', ') : t('none')}</dd>
                      <dt style={s.kvDt}>{t('dshStdAuthorization')}</dt>
                      <dd style={s.kvDd}>{item.dshStd.authorizationRequired ? t('dshStdAuthorizationRequired') : t('dshStdAuthorizationNotRequired')}</dd>
                    </>
                  ) : null}
                </>
              ) : null}
            </dl>
          ) : null}
          {detail?.patch !== null && detail?.patch !== undefined ? (
            <pre style={s.patch}>{detail.patch}</pre>
          ) : null}
        </div>
      ) : null}
      {job !== undefined ? <JobPanel job={job} t={t} /> : null}
    </li>
  )
}

interface InstalledListProps {
  selection: MarketplaceInstalledEntry[]
  entries: MarketplaceInstalledEntry[]
  currentProfile: string
  loading: boolean
  error: string | null
  emptyMessage: string
  t: MarketplaceTabProps['t']
  onRetry: () => void
  onUpdate: (entry: MarketplaceInstalledEntry) => void
  selectedUpdates: Set<string>
  onToggleSelected: (entry: MarketplaceInstalledEntry) => void
  onSelectVisible: () => void
  onClearSelection: () => void
  onUpdateSelected: () => void
  onUpdateAll: () => void
  onEnableSelected: () => void
  onDisableSelected: () => void
  onUninstallSelected: () => void
  onUninstall: (entry: MarketplaceInstalledEntry) => void
  onSetEnabled: (entry: MarketplaceInstalledEntry) => void
  onAgentUpdate: (entry: MarketplaceInstalledEntry) => void
  agentBusy: string | null
  toggleBusy: string | null
  jobs: Map<string, MarketplaceJobStatus>
  startingActions: Map<string, MarketplaceJobKind>
  batchBusy: boolean
}

function OperationQueuePanel({ jobs, t, onClearFinished }: {
  jobs: MarketplaceJobStatus[]
  t: MarketplaceTabProps['t']
  onClearFinished: () => void
}): ReactNode {
  const active = jobs.filter(job => job.finishedAt === null).length
  const failed = jobs.filter(job => job.failure !== null).length
  const finished = jobs.length - active
  return (
    <section style={s.queuePanel} aria-label={t('operationQueueTitle')}>
      <div style={s.queueHead}>
        <strong style={s.title}>{t('operationQueueTitle')}</strong>
        <span style={s.muted}>{fmt(t, 'operationQueueSummary', { active, total: jobs.length, failed })}</span>
        {finished > 0 ? <Button variant='outline' size='sm' onClick={onClearFinished}>{t('clearFinishedJobs')}</Button> : null}
      </div>
      <ol style={s.queueList}>
        {jobs.map(job => <li key={job.jobId}><JobPanel job={job} t={t} /></li>)}
      </ol>
    </section>
  )
}

function InstalledList({ entries, selection, currentProfile, loading, error, emptyMessage, t, onRetry, onUpdate, selectedUpdates, onToggleSelected, onSelectVisible, onClearSelection, onUpdateSelected, onUpdateAll, onEnableSelected, onDisableSelected, onUninstallSelected, onUninstall, onSetEnabled, onAgentUpdate, agentBusy, toggleBusy, jobs, startingActions, batchBusy }: InstalledListProps): ReactNode {
  if (loading) return <div className='mkt-empty' role='status'>{t('loadingInstalled')}</div>
  if (error !== null) {
    return (
      <div style={s.failure}>
        <p role='alert' style={s.muted}>{t('installedError')} {error}</p>
        <Button variant='outline' size='sm' onClick={onRetry}>{t('retry')}</Button>
      </div>
    )
  }
  const selectable = entries.filter(entry => entry.linked)
  const selected = selection
  const hiddenSelectionCount = selected.filter(entry => !entries.some(visible => visible.packageName === entry.packageName)).length
  const updateable = entries.filter((entry) => entry.updateAvailable && entry.canUpdate && entry.registryRepo !== null && entry.verifiedCommit !== null)
  const selectedUpdateCount = selected.filter(entry => entry.updateAvailable && entry.canUpdate && entry.registryRepo !== null && entry.verifiedCommit !== null).length
  const selectedEnabledCount = selected.filter(entry => entry.enabled).length
  const selectedDisabledCount = selected.filter(entry => !entry.enabled).length
  return (
    <>
      {selectable.length > 0 || selected.length > 0 ? (
        <div className='mkt-bulk-actions'>
          <div className='mkt-bulk-head'>
            <span style={s.muted}>{selected.length > 0 ? fmt(t, 'selectForBatch', { count: selected.length }) : t('batchOperationHint')}</span>
            <div style={s.fieldActions}>
              <Button variant='outline' size='sm' disabled={batchBusy || selectable.length === 0} onClick={onSelectVisible}>{t('selectVisible')}</Button>
              <Button variant='outline' size='sm' disabled={batchBusy || selected.length === 0} onClick={onClearSelection}>{t('clearSelection')}</Button>
            </div>
          </div>
          <div className='mkt-bulk-buttons'>
            <Button variant='outline' size='sm' disabled={batchBusy || selectedUpdateCount === 0} onClick={onUpdateSelected}>
              {fmt(t, 'batchUpdateSelected', { count: selectedUpdateCount })}
            </Button>
            <Button variant='outline' size='sm' disabled={batchBusy || updateable.length === 0} onClick={onUpdateAll}>{fmt(t, 'batchUpdateAll', { count: updateable.length })}</Button>
            <Button variant='outline' size='sm' disabled={batchBusy || selectedDisabledCount === 0} onClick={onEnableSelected}>{fmt(t, 'batchEnableSelected', { count: selectedDisabledCount })}</Button>
            <Button variant='outline' size='sm' disabled={batchBusy || selectedEnabledCount === 0} onClick={onDisableSelected}>{fmt(t, 'batchDisableSelected', { count: selectedEnabledCount })}</Button>
            <Button tone='danger' variant='outline' size='sm' disabled={batchBusy || selected.length === 0} onClick={onUninstallSelected}>{fmt(t, 'batchUninstallSelected', { count: selected.length })}</Button>
          </div>
          {hiddenSelectionCount > 0 ? <p style={s.fieldMeta}>{fmt(t, 'hiddenSelection', { count: hiddenSelectionCount })}</p> : null}
        </div>
      ) : null}
      {entries.length === 0 ? <div className='mkt-empty' role='status'>{emptyMessage}</div> : null}
      <ul style={s.installedList}>
        {entries.map((entry) => {
        const job = latestJobForPackage(jobs, entry.packageName)
        const jobActive = job !== undefined && job.finishedAt === null
        const startingKind = startingActions.get(entry.packageName) ?? null
        const operationActive = startingKind !== null || jobActive
        const description = preferredDescription(entry.description, t)
        return (
          <li key={entry.packageName} className='mkt-installed-card' data-selected={selectedUpdates.has(entry.packageName)}>
            <div className='mkt-installed-top'>
              <div className='mkt-installed-info'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  {entry.linked ? (
                    <input
                      type='checkbox'
                      checked={selectedUpdates.has(entry.packageName)}
                      aria-label={fmt(t, 'selectPluginFor', { package: friendlyPackageName(entry.packageName) })}
                      disabled={batchBusy}
                      onChange={() => { onToggleSelected(entry) }}
                    />
                  ) : null}
                  <strong style={s.title} title={entry.packageName}>{friendlyPackageName(entry.packageName)}</strong>
                </div>
                <span style={s.meta}>{entry.packageName}</span>
                <p style={s.installedDescription} title={entry.description ?? undefined}>{description ?? '—'}</p>
                <div style={s.installedMetaRow}>
                  <span style={s.muted} title={entry.currentSpec}>
                    {fmt(t, 'installedVersion', { version: entry.version })}
                    {entry.availableVersion !== null
                      ? ' · ' + fmt(t, entry.availableVersionSource === 'repository' ? 'repositoryVersion' : 'registryVersion', { version: entry.availableVersion })
                      : ''}
                  </span>
                </div>
                <div style={s.installedStatusRow}>
                  {!entry.linked ? (
                    <span style={s.installedStatusChip} title={entry.location}>{t('directoryOnly')}</span>
                  ) : (
                    <span style={{ ...s.installedStatusChip, ...(entry.updateAvailable ? s.installedStatusChipActive : {}) }}>
                      {entry.registryRepo === null
                        ? t('notInRegistry')
                        : entry.updateAvailable
                          ? t('updateAvailable')
                          : t('upToDate')}
                    </span>
                  )}
                  {entry.linked ? (
                    <span style={{ ...s.installedStatusChip, ...(entry.enabled ? s.installedStatusChipActive : {}) }}>
                      {entry.enabled ? t('enabled') : t('disabled')}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className='mkt-installed-actions'>
                {!entry.linked ? (
                  <Button style={s.installedActionButton} variant='outline' size='sm' disabled>{t('profileActionsUnavailable')}</Button>
                ) : operationActive ? (
                  <Button style={s.installedActionButton} variant='primary' size='sm' disabled>{activeJobLabel({ kind: job?.kind ?? startingKind ?? 'install' }, t)}</Button>
                ) : entry.updateAvailable && entry.canUpdate ? (
                  <Button style={s.installedActionButton} variant='primary' size='sm' disabled={batchBusy} onClick={() => { onUpdate(entry) }}>
                    {entry.packageName === SELF_PACKAGE ? t('selfUpdate') : t('update')}
                  </Button>
                ) : entry.updateAvailable
                  && entry.install?.mode === 'guided'
                  && entry.registryRepo !== null
                  && entry.verifiedCommit !== null
                  && (entry.install.profiles.length === 0 || entry.install.profiles.includes(currentProfile)) ? (
                    <Button style={s.installedActionButton} variant='primary' size='sm' disabled={batchBusy || agentBusy === entry.registryRepo} onClick={() => { onAgentUpdate(entry) }}>
                      {agentBusy === entry.registryRepo ? t('agentStarting') : t('agentUpdate')}
                    </Button>
                ) : entry.updateAvailable && entry.install !== null ? (
                  <a style={{ ...s.link, ...s.installedActionLink }} href={entry.install.instructionsUrl} target='_blank' rel='noreferrer'>{t('installGuide')}</a>
                ) : (
                  <Button style={s.installedActionButton} variant='outline' size='sm' disabled>{t('upToDate')}</Button>
                )}
                <Button style={s.installedActionButton} variant='outline' size='sm' disabled={batchBusy || !entry.linked || operationActive || toggleBusy === entry.packageName} onClick={() => { onSetEnabled(entry) }}>
                  {entry.enabled ? t('disable') : t('enable')}
                </Button>
                <Button tone='danger' style={s.installedActionButton} variant='outline' size='sm' disabled={batchBusy || !entry.linked || operationActive} onClick={() => { onUninstall(entry) }}>{t('uninstall')}</Button>
              </div>
            </div>
            {job !== undefined ? (
              <div style={{ width: '100%' }}>
                <JobPanel job={job} t={t} />
              </div>
            ) : null}
          </li>
        )
        })}
      </ul>
    </>
  )
}

function ManualInstallPanel({ command, profile, busy, job, onCommandChange, onInstall, t }: {
  command: string
  profile: string
  busy: boolean
  job: MarketplaceJobStatus | undefined
  onCommandChange: (value: string) => void
  onInstall: () => void
  t: MarketplaceTabProps['t']
}): ReactNode {
  const currentProfile = profile === '' ? 'web' : profile
  return (
    <div className='mkt-panel'>
      <strong style={s.fieldLabel}>{t('manualInstallTitle')}</strong>
      <p style={s.fieldMeta}>{t('manualInstallDescription')}</p>
      <div className='mkt-manual-command'>
        <Input
          type='text'
          value={command}
          placeholder={fmt(t, 'manualInstallPlaceholder', { profile: currentProfile })}
          aria-label={t('manualInstallCommandLabel')}
          disabled={busy}
          onChange={(event) => { onCommandChange(event.currentTarget.value) }}
        />
        <Button variant='primary' size='sm' disabled={busy || profile === '' || command.trim() === ''} onClick={onInstall}>
          {busy ? t('manualInstallStarting') : t('manualInstallAction')}
        </Button>
      </div>
      <p style={s.fieldMeta}>{t('manualInstallHint')}</p>
      {job !== undefined ? <JobPanel job={job} t={t} /> : null}
    </div>
  )
}

function InstallDirField({ installDir, installDirCustom, onChoose, onReset, busy, t }: {
  installDir: string
  installDirCustom: boolean
  onChoose: () => void
  onReset: () => void
  busy: boolean
  t: MarketplaceTabProps['t']
}): ReactNode {
  const displayDir = installDir || t('installDirUnavailable')
  return (
    <div className='mkt-panel'>
      <strong style={s.fieldLabel}>{t('installDirTitle')}</strong>
      {installDirCustom
        ? <p style={s.fieldMeta}>{fmt(t, 'installDirCustomHint', { dir: displayDir })}</p>
        : <p style={s.fieldMeta}>{fmt(t, 'installDirDefaultHint', { dir: displayDir })}</p>}
      <input style={s.directoryPath} value={displayDir} readOnly title={displayDir} aria-label={t('installDirPathLabel')} />
      <div style={s.fieldActions}>
        <Button variant='primary' size='sm' disabled={busy} onClick={onChoose}>
          {busy ? t('installDirChoosing') : t('installDirChoose')}
        </Button>
        {installDirCustom ? (
          <Button variant='outline' size='sm' disabled={busy} onClick={onReset}>{t('installDirResetAction')}</Button>
        ) : null}
      </div>
      <p style={s.fieldMeta}>{t('installDirResetHint')}</p>
    </div>
  )
}

function AgentWorkspaceField({ workspaceDir, workspaceDirCustom, onChoose, onReset, busy, t }: {
  workspaceDir: string
  workspaceDirCustom: boolean
  onChoose: () => void
  onReset: () => void
  busy: boolean
  t: MarketplaceTabProps['t']
}): ReactNode {
  const displayDir = workspaceDir || t('agentWorkspaceUnavailable')
  return (
    <div className='mkt-panel'>
      <strong style={s.fieldLabel}>{t('agentWorkspaceTitle')}</strong>
      <p style={s.fieldMeta}>{workspaceDirCustom ? t('agentWorkspaceCustomHint') : t('agentWorkspaceDefaultHint')}</p>
      <input style={s.directoryPath} value={displayDir} readOnly title={displayDir} aria-label={t('agentWorkspacePathLabel')} />
      <div style={s.fieldActions}>
        <Button variant='primary' size='sm' disabled={busy} onClick={onChoose}>
          {busy ? t('agentWorkspaceChoosing') : t('agentWorkspaceChoose')}
        </Button>
        {workspaceDirCustom ? (
          <Button variant='outline' size='sm' disabled={busy} onClick={onReset}>{t('agentWorkspaceResetAction')}</Button>
        ) : null}
      </div>
      <p style={s.fieldMeta}>{t('agentWorkspaceIsolationHint')}</p>
    </div>
  )
}

function ConflictPanel({ conflicts, diagnosedAt, busy, onDiagnose, t }: {
  conflicts: MarketplaceConflict[]
  diagnosedAt: number | null
  busy: boolean
  onDiagnose: () => void
  t: MarketplaceTabProps['t']
}): ReactNode {
  const header = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', width: '100%' }}>
      <strong style={conflicts.length === 0 ? s.conflictHealthy : s.conflictTitle}>
        {conflicts.length === 0 ? t('conflictNone') : fmt(t, 'conflictTitle', { count: conflicts.length })}
      </strong>
      <Button variant='outline' size='sm' disabled={busy} onClick={onDiagnose}>
        {busy ? t('diagnosing') : t('diagnoseNow')}
      </Button>
    </div>
  )
  if (conflicts.length === 0) {
    return (
      <div className='mkt-panel'>
        {header}
        <p style={s.conflictBody}>{t('conflictHint')}</p>
        {diagnosedAt !== null ? <p style={s.fieldMeta}>{fmt(t, 'diagnosedAt', { time: new Date(diagnosedAt).toLocaleString() })}</p> : null}
      </div>
    )
  }
  return (
    <div className='mkt-panel'>
      {header}
      <ul style={s.conflictList}>
        {conflicts.map((conflict) => (
          <li
            key={conflict.kind === 'service' ? 'svc:' + conflict.service : 'id:' + conflict.id}
            style={s.conflictItem}
          >
            <span style={s.conflictTitle}>
              {conflict.kind === 'service'
                ? fmt(t, 'conflictService', { service: conflict.service })
                : fmt(t, 'conflictDuplicateId', { id: conflict.id })}
            </span>
            <p style={s.conflictBody}>{conflict.packages.join(', ')}</p>
          </li>
        ))}
      </ul>
      <p style={s.conflictBody}>{t('conflictHint')}</p>
      {diagnosedAt !== null ? <p style={s.fieldMeta}>{fmt(t, 'diagnosedAt', { time: new Date(diagnosedAt).toLocaleString() })}</p> : null}
    </div>
  )
}

function JobPanel({ job, t }: { job: MarketplaceJobStatus; t: MarketplaceTabProps['t'] }): ReactNode {
  const settled = job.finishedAt !== null
  const label = settled && job.failure !== null
    ? jobKindLabel(job.kind, t) + ' — ' + t('jobFailed') + ': ' + job.failure.message
    : settled && job.outcome !== null
      ? jobKindLabel(job.kind, t) + ' — ' + t('jobDone') + ' (' + job.outcome.packageName + '@' + job.outcome.version + ')'
      : jobKindLabel(job.kind, t) + ' — ' + jobPhaseLabel(job.phase, t)
  return (
    <div style={s.jobPanel}>
      <div style={s.jobHead}>
        <StateDot state={phaseDot(job.phase)} aria-hidden='true' />
        <span style={s.muted}>{label}</span>
      </div>
      {job.log !== '' ? (
        <details open={settled && job.failure !== null}>
          <summary className='mkt-detail-toggle'>{t('jobLog')}</summary>
          <pre style={s.jobLog}>{job.log}</pre>
        </details>
      ) : null}
    </div>
  )
}
