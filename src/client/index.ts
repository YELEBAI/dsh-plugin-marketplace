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
import { createGuidedAgentSession } from './agent-session.ts'
import { pickCompatibleDirectory } from './directory-picker.ts'
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
    'connection', 'sessions', 'workspaces',
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

        await createGuidedAgentSession(scope, target.workspaceId, task)
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
          return await pickCompatibleDirectory(scope)
        } catch (error) {
          throw new Error(t('installDirPickerFailed') + ': ' + (error instanceof Error ? error.message : String(error)))
        }
      },
      chooseAgentWorkspaceDir: async () => {
        try {
          return await pickCompatibleDirectory(scope)
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
