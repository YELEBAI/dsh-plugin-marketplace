/** Plugin marketplace, browser half: the `marketplace` settings tab.
 *  Registers into the Plugins settings section through the
 *  settings.plugins.tab slot and mounts this package's own Remote
 *  contribution, mirroring ui-settings-plugin-inventory.
 */

import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-api-workspace-controller/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import type { MarketplaceResult } from '../types.ts'
import { TYPERT_REMOTE } from '../remote.ts'
import { MarketplaceTab, type MarketplaceTabInjected } from './MarketplaceTab.tsx'
import { createGuidedAgentWorkspace } from './agent-workspace.ts'
import { en, zh, type PluginMarketplaceLocaleKey } from './locales.ts'

export type { MarketplaceTabInjected, MarketplaceTabProps } from './MarketplaceTab.tsx'
export type { PluginMarketplaceLocaleKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Plugin marketplace copy. */
    'settings.pluginMarketplace': PluginMarketplaceLocaleKey
  }
}

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.pluginMarketplace'

/** Service required before this plugin can mount its own Remote namespace. */
export const inject = ['remote', 'connection']

/** Unwrap one marketplace call without leaking Host-side English errors into Chinese notices. */
function unwrapMarketplace<T>(
  result: RemoteResult<MarketplaceResult<T>>,
  t: (key: PluginMarketplaceLocaleKey) => string,
): T {
  if (!result.ok) throw new Error(t('requestFailed'))
  if (!result.value.ok) throw new Error(t('operationFailed') + ' [' + result.value.error.code + ']')
  return result.value.value
}

/** Mount the marketplace Remote contribution, then register its Settings tab. */
export async function apply(ctx: ClientContext): Promise<void> {
  const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE)
  ctx.effect(() => disposeRemote, 'plugin-marketplace: remote lifetime')

  ctx.inject([
    'slots', 'locale', 'remote', 'remote.marketplace',
    'connection', 'sessions', 'workspaces', 'uiWorkspace',
  ], (scope: ClientContext) => {
    scope.effect(() => scope.locale.register(NS, { zh, en }), 'plugin-marketplace: dictionaries')

    const t = scope.locale.bind(NS)
    const injected = (): MarketplaceTabInjected => ({
      search: async (query, page, sort, category) => unwrapMarketplace(await scope.remote.marketplace.search({ query, page, sort, category }), t),
      details: async (repo, ref) => unwrapMarketplace(await scope.remote.marketplace.details({ repo, ref }), t),
      guidedAgent: async (repo, ref, operation) => {
        const task = unwrapMarketplace(await scope.remote.marketplace.guidedTask({ repo, ref, operation }), t)
        let target: Awaited<ReturnType<typeof scope.workspaces.create>>
        try {
          target = await createGuidedAgentWorkspace(scope.workspaces, task.workspaceDir)
        } catch (error) {
          throw new Error(t('agentWorkspaceRequired') + ': ' + (error instanceof Error ? error.message : String(error)))
        }

        // ClientSessions 使用部署配置的默认 composition，并在本地 binding 可寻址后才返回。
        // 不直接依赖可选的 agentPresets Remote，避免只有 Sessions、没有 preset roster 的
        // 部署在启动引导更新时失败。
        const sessionId = await scope.sessions.create({ workspaceId: target.workspaceId })
        const binding = await waitForBinding(scope, sessionId)
        await binding.session.rename(task.title)
        const prompted = await binding.session.prompt([{ type: 'text', text: task.prompt }], 'queue')
        if (!prompted.ok) throw new Error(prompted.error.message)
        scope.sessions.open(sessionId)
      },
      install: async (repo, ref) => unwrapMarketplace(await scope.remote.marketplace.installPlugin({ repo, ref }), t).jobId,
      manualInstall: async (command) => unwrapMarketplace(await scope.remote.marketplace.manualInstall({ command }), t),
      update: async (repo, ref) => unwrapMarketplace(await scope.remote.marketplace.update({ repo, ref }), t).jobId,
      updateBatch: async (updates) => unwrapMarketplace(await scope.remote.marketplace.updateBatch({ updates }), t),
      uninstall: async (packageName) => unwrapMarketplace(await scope.remote.marketplace.uninstall({ packageName }), t).jobId,
      uninstallBatch: async (packageNames) => unwrapMarketplace(await scope.remote.marketplace.uninstallBatch({ packageNames }), t),
      setEnabled: async (packageName, enabled) => unwrapMarketplace(await scope.remote.marketplace.setEnabled({ packageName, enabled }), t),
      setEnabledBatch: async (packageNames, enabled) => unwrapMarketplace(await scope.remote.marketplace.setEnabledBatch({ packageNames, enabled }), t),
      installLocation: async () => unwrapMarketplace(await scope.remote.marketplace.installLocation(), t),
      setInstallDir: async (installDir) => unwrapMarketplace(await scope.remote.marketplace.setInstallDir({ installDir }), t),
      agentWorkspace: async () => unwrapMarketplace(await scope.remote.marketplace.agentWorkspace(), t),
      setAgentWorkspaceDir: async (workspaceDir) => unwrapMarketplace(await scope.remote.marketplace.setAgentWorkspaceDir({ workspaceDir }), t),
      chooseInstallDir: async () => {
        try {
          return await scope.uiWorkspace.pickDirectory()
        } catch (error) {
          throw new Error(t('installDirPickerFailed') + ': ' + (error instanceof Error ? error.message : String(error)))
        }
      },
      chooseAgentWorkspaceDir: async () => {
        try {
          return await scope.uiWorkspace.pickDirectory()
        } catch (error) {
          throw new Error(t('agentWorkspacePickerFailed') + ': ' + (error instanceof Error ? error.message : String(error)))
        }
      },
      diagnoseConflicts: async () => unwrapMarketplace(await scope.remote.marketplace.diagnoseConflicts(), t),
      jobStatus: async (jobId) => unwrapMarketplace(await scope.remote.marketplace.jobStatus({ jobId }), t),
      jobs: async () => unwrapMarketplace(await scope.remote.marketplace.jobs(), t),
      installed: async (refresh = false) => unwrapMarketplace(await scope.remote.marketplace.installed({ refresh }), t),
      restart: async () => unwrapMarketplace(await scope.remote.marketplace.restart(), t),
    })

    scope.slots.inject('settings.plugins.tab', () => scope.slots.register({
      name: 'settings.plugins.tab',
      id: 'marketplace',
      order: 20,
      label: () => t('tab'),
      locale: NS,
      inject: injected,
    }, MarketplaceTab))
  })
}

/** Wait for the runtime's Host stream to project a directly-created Agent session. */
function waitForBinding(ctx: ClientContext, sessionId: Parameters<ClientContext['sessions']['open']>[0]) {
  const ready = ctx.sessions.binding(sessionId)
  if (ready !== undefined) return Promise.resolve(ready)
  return new Promise<NonNullable<ReturnType<ClientContext['sessions']['binding']>>>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      unsubscribe()
      reject(new Error('The Agent session was created, but it did not appear in the client before the timeout.'))
    }, 10_000)
    const unsubscribe = ctx.sessions.list.subscribe(() => {
      const binding = ctx.sessions.binding(sessionId)
      if (binding === undefined) return
      window.clearTimeout(timeout)
      unsubscribe()
      resolve(binding)
    })
  })
}

// The injected face types below keep the closures checked without pulling
// extra value imports into the client bundle.
export type {
  MarketplaceInstallRequest,
  MarketplaceInstalledEntry,
  MarketplaceInstalled,
  MarketplaceJobStatus,
  MarketplacePluginDetails,
  MarketplaceRestartResult,
  MarketplaceSearchPage,
} from '../types.ts'
