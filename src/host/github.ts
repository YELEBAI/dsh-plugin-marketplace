/** GitHub REST access for install-time manifest details and ref resolution.
 */

import type {
  MarketplacePluginDetails,
  MarketplacePluginManifest,
  MarketplaceRateLimit,
} from '../types.ts'

const API_BASE = 'https://api.github.com'
const RAW_BASE = 'https://raw.githubusercontent.com'
const USER_AGENT = 'dsh-plugin-marketplace'
const MAX_PATCH_CHARS = 65536

export type GitHubFailureCode =
  | 'network'
  | 'rate-limited'
  | 'bad-token'
  | 'not-found'
  | 'ref-not-found'
  | 'bad-repo'
  | 'bad-manifest'

/** Typed failure that surfaces through the Remote error branch. */
export class GitHubError extends Error {
  readonly code: GitHubFailureCode
  readonly details: Record<string, unknown>

  constructor(
    code: GitHubFailureCode,
    message: string,
    details: Record<string, unknown> = {},
  ) {
    super(message)
    this.name = 'GitHubError'
    this.code = code
    this.details = details
  }
}

interface ApiResponse {
  status: number
  body: unknown
  headers: Headers
}

interface CacheEntry {
  etag: string | null
  body: unknown
  fetchedAt: number
}

const REPO_PATTERN = /^([\w.-]+)\/([\w.-]+)$/

/** Parse and validate an owner/repo specifier. */
export function parseRepo(spec: string): { owner: string; repo: string } {
  const match = REPO_PATTERN.exec(spec.trim())
  if (match === null) {
    throw new GitHubError('bad-repo', 'Malformed repository spec — expected owner/repo.')
  }
  return { owner: match[1] as string, repo: match[2] as string }
}

/** A bundle patch path must stay inside the package. */
function isSafePatchPath(value: string): boolean {
  return value.length > 0
    && !value.startsWith('/')
    && !value.includes('\\')
    && !value.split('/').includes('..')
}

function contentsPath(value: string): string {
  return value.split('/').map(encodeURIComponent).join('/')
}

export class GitHubClient {
  private readonly token: string | undefined = process.env.GITHUB_TOKEN ?? undefined
  private readonly cache = new Map<string, CacheEntry>()
  private readonly timeoutMs: number

  constructor(timeoutMs = 10_000) {
    this.timeoutMs = timeoutMs
  }

  /** One conditional GET against the API; 304 serves the cached body. */
  private async api(path: string, cacheKey?: string): Promise<ApiResponse> {
    const url = API_BASE + path
    const headers: Record<string, string> = {
      accept: 'application/vnd.github+json',
      'user-agent': USER_AGENT,
      'x-github-api-version': '2022-11-28',
    }
    if (this.token !== undefined) headers.authorization = 'Bearer ' + this.token
    const cached = cacheKey === undefined ? undefined : this.cache.get(cacheKey)
    if (cached?.etag !== undefined && cached.etag !== null) headers['if-none-match'] = cached.etag
    let response: Response
    try {
      response = await fetch(url, { headers, signal: AbortSignal.timeout(this.timeoutMs) })
    } catch (cause) {
      throw new GitHubError('network', 'GitHub request failed: ' + url, { cause: String(cause) })
    }
    if (response.status === 304 && cached !== undefined) {
      return { status: 304, body: cached.body, headers: response.headers }
    }
    if (response.status === 403 || response.status === 429) throw this.rateLimitError(response.headers)
    if (response.status === 401) {
      throw new GitHubError('bad-token', 'GitHub rejected the token (401). Fix or unset GITHUB_TOKEN for anonymous access.')
    }
    if (response.status === 404) {
      throw new GitHubError('not-found', 'GitHub resource not found: ' + url, { url })
    }
    if (!response.ok) {
      throw new GitHubError('network', 'GitHub request failed (' + String(response.status) + '): ' + url, { status: response.status })
    }
    const body: unknown = await response.json()
    if (cacheKey !== undefined) {
      this.cache.set(cacheKey, { etag: response.headers.get('etag'), body, fetchedAt: Date.now() })
    }
    return { status: response.status, body, headers: response.headers }
  }

  private rateLimitError(headers: Headers): GitHubError {
    const reset = Number(headers.get('x-ratelimit-reset') ?? '0')
    const seconds = reset > 0 ? Math.max(0, reset - Math.floor(Date.now() / 1000)) : 3600
    return new GitHubError(
      'rate-limited',
      'GitHub rate limit exceeded — resets in about ' + Math.ceil(seconds / 60) + ' minutes. Set GITHUB_TOKEN for a higher quota.',
      { remaining: Number(headers.get('x-ratelimit-remaining') ?? '0'), reset },
    )
  }

  private rate(headers: Headers, source: 'core' | 'search'): MarketplaceRateLimit {
    return {
      limit: Number(headers.get('x-ratelimit-limit') ?? '0'),
      remaining: Number(headers.get('x-ratelimit-remaining') ?? '0'),
      reset: Number(headers.get('x-ratelimit-reset') ?? '0'),
      source,
    }
  }

  /** Raw CDN 不可用时回退到已认证的 Contents API。 */
  private async textFile(owner: string, repo: string, ref: string, file: string): Promise<string | null> {
    const rawUrl = RAW_BASE + '/' + owner + '/' + repo + '/' + ref + '/' + file
    try {
      const response = await fetch(rawUrl, {
        headers: { accept: 'application/vnd.github+json', 'user-agent': USER_AGENT },
        cache: 'no-store',
        signal: AbortSignal.timeout(this.timeoutMs),
      })
      if (response.ok) return await response.text()
    } catch {
      // 继续通过 API 读取；桌面端代理偶尔无法访问 raw.githubusercontent.com。
    }
    try {
      const { body } = await this.api(
        '/repos/' + owner + '/' + repo + '/contents/' + contentsPath(file) + '?ref=' + encodeURIComponent(ref),
      )
      const entry = body as { type?: unknown; encoding?: unknown; content?: unknown }
      if (entry.type !== 'file' || entry.encoding !== 'base64' || typeof entry.content !== 'string') return null
      return Buffer.from(entry.content.replace(/\s/g, ''), 'base64').toString('utf8')
    } catch (error) {
      if (error instanceof GitHubError && error.code === 'not-found') return null
      throw error
    }
  }

  /**
   * Resolve the concrete commit for a repo: an explicit tag, branch, or SHA;
   * otherwise the latest release tag, then the default branch.
   */
  private async resolveRef(owner: string, repo: string, ref: string): Promise<{ ref: string; rate: MarketplaceRateLimit }> {
    if (ref !== '') {
      try {
        const { body, headers } = await this.api('/repos/' + owner + '/' + repo + '/commits/' + encodeURIComponent(ref))
        const sha = (body as { sha?: unknown }).sha
        if (typeof sha !== 'string' || !/^[0-9a-f]{40}$/i.test(sha)) {
          throw new GitHubError('ref-not-found', "Ref '" + ref + "' did not resolve to a commit on " + owner + '/' + repo + '.', { ref })
        }
        return { ref: sha, rate: this.rate(headers, 'core') }
      } catch (error) {
        if (error instanceof GitHubError && error.code === 'not-found') {
          throw new GitHubError('ref-not-found', "Ref '" + ref + "' not found on " + owner + '/' + repo + '.', { ref })
        }
        throw error
      }
    }
    try {
      const { body } = await this.api('/repos/' + owner + '/' + repo + '/releases/latest')
      const tag = (body as { tag_name?: unknown }).tag_name
      if (typeof tag === 'string' && tag !== '') return this.resolveRef(owner, repo, tag)
    } catch (error) {
      if (!(error instanceof GitHubError) || error.code !== 'not-found') throw error
    }
    const { body } = await this.api('/repos/' + owner + '/' + repo)
    const branch = (body as { default_branch?: unknown }).default_branch
    const fallback = typeof branch === 'string' && branch !== '' ? branch : 'main'
    return this.resolveRef(owner, repo, fallback)
  }

  /** Read the plugin manifest and bundle patch at one ref, for review before install. */
  async details(repoSpec: string, ref: string): Promise<MarketplacePluginDetails> {
    const { owner, repo } = parseRepo(repoSpec)
    const resolved = await this.resolveRef(owner, repo, ref)
    let manifest: MarketplacePluginManifest | null = null
    let patch: string | null = null
    let entrySource: string | null = null
    try {
      const packageText = await this.textFile(owner, repo, resolved.ref, 'package.json')
      if (packageText !== null) {
        const pkg = JSON.parse(packageText) as Record<string, unknown>
        const dsh = pkg.dsh as Record<string, unknown> | undefined
        const bundle = dsh?.bundle as Record<string, unknown> | undefined
        const client = dsh?.client as Record<string, unknown> | undefined
        const declaredPatch = bundle?.patch
        const exportsRoot = pkg.exports
        let entry: string | null = null
        if (typeof exportsRoot === 'string') entry = exportsRoot
        else if (exportsRoot !== null && typeof exportsRoot === 'object') {
          const dot = (exportsRoot as Record<string, unknown>)['.']
          if (typeof dot === 'string') entry = dot
          else if (dot !== null && typeof dot === 'object' && typeof (dot as Record<string, unknown>).default === 'string') entry = (dot as Record<string, unknown>).default as string
          else if (typeof (exportsRoot as Record<string, unknown>).default === 'string') entry = (exportsRoot as Record<string, unknown>).default as string
        }
        if (entry === null && typeof pkg.main === 'string') entry = pkg.main
        manifest = {
          name: typeof pkg.name === 'string' ? pkg.name : '',
          version: typeof pkg.version === 'string' ? pkg.version : 'unknown',
          description: typeof pkg.description === 'string' ? pkg.description : '',
          license: typeof pkg.license === 'string' ? pkg.license : null,
          bundlePatch: typeof declaredPatch === 'string' && isSafePatchPath(declaredPatch) ? declaredPatch : null,
          hasClient: client !== undefined && typeof client === 'object',
          entry: typeof entry === 'string' && isSafePatchPath(entry) ? entry : null,
        }
        if (manifest.name === '') {
          throw new GitHubError('bad-manifest', owner + '/' + repo + ' package.json has no name field.')
        }
        if (manifest.bundlePatch !== null) {
          patch = (await this.textFile(owner, repo, resolved.ref, manifest.bundlePatch))?.slice(0, MAX_PATCH_CHARS) ?? null
        }
        if (manifest.entry !== null) {
          entrySource = (await this.textFile(owner, repo, resolved.ref, manifest.entry))?.slice(0, MAX_PATCH_CHARS) ?? null
        }
      } else {
        manifest = null
      }
    } catch (error) {
      if (error instanceof GitHubError) throw error
      // Raw fetch failures degrade to a missing manifest rather than failing the listing.
    }
    return {
      repo: owner + '/' + repo,
      ref,
      resolvedRef: resolved.ref,
      manifest,
      patch,
      entrySource,
      readmeUrl: 'https://github.com/' + owner + '/' + repo + '#readme',
      rate: resolved.rate,
    }
  }
}
