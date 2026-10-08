/** Hand-written Typert wire artifacts for the `marketplace` Remote service.
 *  Mirrors the generator output shape (see dsh-host-plugin-inventory's
 *  lib/typert.host.js / lib/typert.remote-client.js): the host loader
 *  validates this manifest and the client remote mounts the contribution.
 *  Every parameter and result uses a strict zod-v4 codec; the schemas
 *  therefore carry the wire contract, not just the TypeScript types.
 */

import { z } from 'zod'

const rateSchema = z.object({
  limit: z.number(),
  remaining: z.number(),
  reset: z.number(),
  source: z.union([z.literal('core'), z.literal('search')]),
})

const installMetadataSchema = z.object({
  mode: z.union([z.literal('automatic'), z.literal('guided')]),
  source: z.union([z.literal('github'), z.literal('npm'), z.literal('tarball'), z.literal('manual')]),
  spec: z.string(),
  profiles: z.array(z.string()),
  requiresBuildApproval: z.boolean(),
  requiresRestart: z.boolean(),
  manualSteps: z.boolean(),
  instructionsUrl: z.string(),
})

const categorySchema = z.union([
  z.literal('ui'),
  z.literal('agents'),
  z.literal('developer-tools'),
  z.literal('models'),
  z.literal('data'),
  z.literal('integrations'),
  z.literal('media'),
  z.literal('security'),
  z.literal('observability'),
  z.literal('other'),
])

const repoSummarySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  fullName: z.string(),
  description: z.union([z.string(), z.null()]),
  stars: z.number(),
  forks: z.number(),
  openIssues: z.number(),
  language: z.union([z.string(), z.null()]),
  license: z.union([z.string(), z.null()]),
  updatedAt: z.string(),
  defaultBranch: z.string(),
  verifiedCommit: z.string(),
  htmlUrl: z.string(),
  topics: z.array(z.string()),
  categories: z.array(categorySchema),
  starGrowth7d: z.number(),
  packageName: z.string(),
  version: z.string(),
  bundlePatch: z.string(),
  hasClient: z.boolean(),
  verifiedAt: z.string(),
  install: installMetadataSchema,
})

const manifestSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  license: z.union([z.string(), z.null()]),
  bundlePatch: z.union([z.string(), z.null()]),
  hasClient: z.boolean(),
  profiles: z.array(z.string()).optional(),
})

const detailsValueSchema = z.object({
  repo: z.string(),
  ref: z.string(),
  resolvedRef: z.string(),
  manifest: z.union([manifestSchema, z.null()]),
  patch: z.union([z.string(), z.null()]),
  readmeUrl: z.string(),
  rate: rateSchema,
})

const guidedAgentTaskValueSchema = z.object({
  repository: z.string(),
  packageName: z.string(),
  version: z.string(),
  verifiedCommit: z.string(),
  profile: z.string(),
  workspaceDir: z.string(),
  title: z.string(),
  prompt: z.string(),
  instructionsUrl: z.string(),
  assessment: z.string(),
  requiresBuildApproval: z.boolean(),
  lifecycleScripts: z.array(z.string()),
})

const searchValueSchema = z.object({
  totalCount: z.number(),
  items: z.array(repoSummarySchema),
  rate: rateSchema,
})

const jobIdValueSchema = z.object({ jobId: z.string() })

const jobStatusValueSchema = z.object({
  jobId: z.string(),
  kind: z.string(),
  packageName: z.string(),
  phase: z.string(),
  log: z.string(),
  exitCode: z.union([z.number(), z.null()]),
  startedAt: z.number(),
  finishedAt: z.union([z.number(), z.null()]),
  outcome: z.union([z.object({
    packageName: z.string(),
    version: z.string(),
    requiresRestart: z.boolean(),
  }), z.null()]),
  failure: z.union([z.object({
    code: z.string(),
    message: z.string(),
  }), z.null()]),
})

const jobsValueSchema = z.array(jobStatusValueSchema)

const conflictProviderSchema = z.object({
  bundle: z.string(),
  packageName: z.string(),
  id: z.string(),
})

const conflictSchema = z.union([
  z.object({
    kind: z.literal('service'),
    service: z.string(),
    packages: z.array(z.string()),
    providers: z.array(conflictProviderSchema).optional(),
  }),
  z.object({
    kind: z.literal('duplicate-id'),
    id: z.string(),
    packages: z.array(z.string()),
    providers: z.array(conflictProviderSchema).optional(),
  }),
])

const installedValueSchema = z.object({
  profile: z.string(),
  installDir: z.string().optional(),
  installDirCustom: z.boolean().optional(),
  conflicts: z.array(conflictSchema).optional(),
  entries: z.array(z.object({
    packageName: z.string(),
    version: z.string(),
    isBundle: z.boolean(),
    linked: z.boolean(),
    location: z.string(),
    enabled: z.boolean(),
    currentSpec: z.string(),
    description: z.union([z.string(), z.null()]).optional(),
    repositoryUrl: z.union([z.string(), z.null()]).optional(),
    registryRepo: z.union([z.string(), z.null()]),
    availableVersion: z.union([z.string(), z.null()]),
    availableVersionSource: z.union([z.literal('registry'), z.literal('repository'), z.null()]),
    verifiedCommit: z.union([z.string(), z.null()]),
    updateAvailable: z.boolean(),
    canUpdate: z.boolean(),
    install: z.union([installMetadataSchema, z.null()]),
  })),
})

const installedRequestSchema = z.object({ refresh: z.boolean() })

const searchRequestSchema = z.object({
  query: z.string(),
  page: z.number(),
  sort: z.union([z.literal('stars'), z.literal('updated'), z.literal('trending')]),
  category: z.union([z.literal('all'), categorySchema]),
})

const detailsRequestSchema = z.object({
  repo: z.string(),
  ref: z.string(),
})

const installRequestSchema = z.object({
  repo: z.string(),
  ref: z.string(),
})

const batchUpdateRequestSchema = z.object({
  updates: z.array(installRequestSchema).min(1).max(50),
})

const batchPackageRequestSchema = z.object({
  packageNames: z.array(z.string()).min(1).max(50),
})

const batchToggleRequestSchema = batchPackageRequestSchema.extend({ enabled: z.boolean() })

const manualInstallRequestSchema = z.object({ command: z.string() })

const manualInstallValueSchema = z.object({
  jobId: z.string(),
  operation: z.union([z.literal('install'), z.literal('update')]),
  packageName: z.string(),
  repository: z.string(),
  verifiedCommit: z.string(),
})

const guidedAgentRequestSchema = installRequestSchema.extend({
  operation: z.union([z.literal('install'), z.literal('update')]),
})

const jobStatusRequestSchema = z.object({
  jobId: z.string(),
})

const uninstallRequestSchema = z.object({
  packageName: z.string(),
})

const toggleRequestSchema = z.object({
  packageName: z.string(),
  enabled: z.boolean(),
})

const toggleValueSchema = z.object({
  packageName: z.string(),
  enabled: z.boolean(),
  requiresRestart: z.boolean(),
})

const restartValueSchema = z.object({
  accepted: z.literal(true),
  profile: z.string(),
})

const installDirRequestSchema = z.object({ installDir: z.string() })

const installDirValueSchema = z.object({
  profile: z.string(),
  packageNames: z.array(z.string()),
  installDir: z.string(),
  installDirCustom: z.boolean(),
})

const agentWorkspaceRequestSchema = z.object({ workspaceDir: z.string() })

const agentWorkspaceValueSchema = z.object({
  workspaceDir: z.string(),
  workspaceDirCustom: z.boolean(),
})

const batchUpdateValueSchema = z.object({
  jobs: z.array(z.object({ jobId: z.string(), packageName: z.string() })),
  failures: z.array(z.object({ repo: z.string(), message: z.string() })),
})

const batchUninstallValueSchema = z.object({
  jobs: z.array(z.object({ jobId: z.string(), packageName: z.string() })),
  failures: z.array(z.object({ packageName: z.string(), message: z.string() })),
})

const batchToggleValueSchema = z.object({
  results: z.array(toggleValueSchema),
  failures: z.array(z.object({ packageName: z.string(), message: z.string() })),
  requiresRestart: z.boolean(),
})

const diagnoseConflictsValueSchema = z.object({
  conflicts: z.array(conflictSchema),
  scannedAt: z.number(),
})

/** Business failure: typed code + message + optional payload. */
const failureSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown(),
})

/** The RemoteResult envelope the client API resolves to. */
function resultSchema<T extends z.ZodTypeAny>(value: T) {
  return z.union([
    z.object({ ok: z.literal(true), value }),
    z.object({ ok: z.literal(false), error: failureSchema }),
  ])
}

type Codec = {
  mode: 'strict'
  typeSymbol: string
  schema: z.ZodTypeAny
  create: () => { parse: (value: unknown) => unknown }
}

function codec(schema: z.ZodTypeAny, typeSymbol: string): Codec {
  return {
    mode: 'strict',
    typeSymbol,
    schema,
    create: () => ({ parse: (value) => schema.parse(value) }),
  }
}

function param(name: string, schema: z.ZodTypeAny, typeSymbol: string) {
  return {
    name,
    wire: name,
    source: 'json' as const,
    codec: codec(schema, typeSymbol),
  }
}

function result(schema: z.ZodTypeAny, typeSymbol: string) {
  return codec(schema, typeSymbol)
}

const PKG = 'dsh-plugin-marketplace'
const NS = 'marketplace'

function invocation(
  method: string,
  parameters: ReturnType<typeof param>[],
  codec: ReturnType<typeof result>,
  implementation?: string,
) {
  return {
    id: `${PKG}#${NS}/${method}`,
    service: NS,
    namespace: NS,
    method,
    invocation: { kind: 'direct' as const },
    ...implementation === undefined ? {} : { implementation },
    parameters,
    result: codec,
  }
}

const REQUEST_TYPES = `${PKG}/types#`

/** Host-face manifest registered by @deepseek-ai/dsh-typert-loader. */
export const TYPERT = {
  package: PKG,
  face: 'host',
  schemas: [],
  invocations: [
    invocation('search', [param('request', searchRequestSchema, `${REQUEST_TYPES}MarketplaceSearchRequest`)], result(resultSchema(searchValueSchema), `${REQUEST_TYPES}MarketplaceSearchOutcome`)),
    invocation('details', [param('request', detailsRequestSchema, `${REQUEST_TYPES}MarketplaceDetailsRequest`)], result(resultSchema(detailsValueSchema), `${REQUEST_TYPES}MarketplaceDetailsOutcome`)),
    invocation('guidedTask', [param('request', guidedAgentRequestSchema, `${REQUEST_TYPES}MarketplaceGuidedAgentRequest`)], result(resultSchema(guidedAgentTaskValueSchema), `${REQUEST_TYPES}MarketplaceGuidedAgentOutcome`)),
    invocation('installPlugin', [param('request', installRequestSchema, `${REQUEST_TYPES}MarketplaceInstallRequest`)], result(resultSchema(jobIdValueSchema), `${REQUEST_TYPES}MarketplaceInstallOutcome`)),
    invocation('manualInstall', [param('request', manualInstallRequestSchema, `${REQUEST_TYPES}MarketplaceManualInstallRequest`)], result(resultSchema(manualInstallValueSchema), `${REQUEST_TYPES}MarketplaceManualInstallOutcome`)),
    invocation('update', [param('request', installRequestSchema, `${REQUEST_TYPES}MarketplaceInstallRequest`)], result(resultSchema(jobIdValueSchema), `${REQUEST_TYPES}MarketplaceInstallOutcome`)),
    invocation('updateBatch', [param('request', batchUpdateRequestSchema, `${REQUEST_TYPES}MarketplaceBatchUpdateRequest`)], result(resultSchema(batchUpdateValueSchema), `${REQUEST_TYPES}MarketplaceBatchUpdateOutcome`)),
    invocation('uninstall', [param('request', uninstallRequestSchema, `${REQUEST_TYPES}MarketplaceUninstallRequest`)], result(resultSchema(jobIdValueSchema), `${REQUEST_TYPES}MarketplaceInstallOutcome`)),
    invocation('uninstallBatch', [param('request', batchPackageRequestSchema, `${REQUEST_TYPES}MarketplaceBatchPackageRequest`)], result(resultSchema(batchUninstallValueSchema), `${REQUEST_TYPES}MarketplaceBatchUninstallOutcome`)),
    invocation('setEnabled', [param('request', toggleRequestSchema, `${REQUEST_TYPES}MarketplaceToggleRequest`)], result(resultSchema(toggleValueSchema), `${REQUEST_TYPES}MarketplaceToggleOutcome`)),
    invocation('setEnabledBatch', [param('request', batchToggleRequestSchema, `${REQUEST_TYPES}MarketplaceBatchToggleRequest`)], result(resultSchema(batchToggleValueSchema), `${REQUEST_TYPES}MarketplaceBatchToggleOutcome`)),
    invocation('jobStatus', [param('request', jobStatusRequestSchema, `${REQUEST_TYPES}MarketplaceJobStatusRequest`)], result(resultSchema(jobStatusValueSchema), `${REQUEST_TYPES}MarketplaceJobStatusOutcome`)),
    invocation('jobs', [], result(resultSchema(jobsValueSchema), `${REQUEST_TYPES}MarketplaceJobsOutcome`), 'listJobs'),
    invocation('installed', [param('request', installedRequestSchema, `${REQUEST_TYPES}MarketplaceInstalledRequest`)], result(resultSchema(installedValueSchema), `${REQUEST_TYPES}MarketplaceInstalledOutcome`)),
    invocation('installLocation', [], result(resultSchema(installDirValueSchema), `${REQUEST_TYPES}MarketplaceInstallLocationOutcome`)),
    invocation('setInstallDir', [param('request', installDirRequestSchema, `${REQUEST_TYPES}MarketplaceInstallDirRequest`)], result(resultSchema(installDirValueSchema), `${REQUEST_TYPES}MarketplaceInstallDirOutcome`)),
    invocation('agentWorkspace', [], result(resultSchema(agentWorkspaceValueSchema), `${REQUEST_TYPES}MarketplaceAgentWorkspaceOutcome`)),
    invocation('setAgentWorkspaceDir', [param('request', agentWorkspaceRequestSchema, `${REQUEST_TYPES}MarketplaceAgentWorkspaceRequest`)], result(resultSchema(agentWorkspaceValueSchema), `${REQUEST_TYPES}MarketplaceAgentWorkspaceOutcome`)),
    invocation('diagnoseConflicts', [], result(resultSchema(diagnoseConflictsValueSchema), `${REQUEST_TYPES}MarketplaceDiagnoseConflictsOutcome`)),
    invocation('restart', [], result(resultSchema(restartValueSchema), `${REQUEST_TYPES}MarketplaceRestartOutcome`)),
  ],
  model: {
    services: [],
    events: [],
    objects: [],
  },
}

/** Client-side contribution mounted through ctx.remote.$mount(). */
export const TYPERT_REMOTE = {
  package: PKG,
  descriptors: TYPERT.invocations,
}

export default TYPERT_REMOTE
