/** Run the plugin TypeScript check against a selected DSH checkout.
 *
 * The development tsconfig intentionally points at the maintainer's DSH
 * checkout. CI rewrites only that checkout prefix into a temporary config,
 * preserving the exact module/type map used by local builds.
 */

import { spawnSync } from 'node:child_process'
import { unlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { typeConfig } from './dsh-environment.mjs'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceConfig = typeConfig()

const temporaryConfig = join(root, '.tsconfig.typecheck-' + process.pid + '.json')
writeFileSync(temporaryConfig, JSON.stringify(sourceConfig, null, 2) + '\n', 'utf8')
try {
  const tsc = require.resolve('typescript/bin/tsc')
  const result = spawnSync(process.execPath, [tsc, '--noEmit', '-p', temporaryConfig], {
    cwd: root,
    stdio: 'inherit',
    windowsHide: true,
  })
  if (result.error !== undefined) throw result.error
  process.exitCode = result.status ?? 1
} finally {
  unlinkSync(temporaryConfig)
}
