/** Web 兼容回归入口：独立进程、临时 DSH_HOME、离线本地包，不读取用户凭据。 */
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const fixture = mkdtempSync(join(tmpdir(), 'mkt-web-runtime with spaces-'))
try {
  const env = { ...process.env, DSH_HOME: join(fixture, 'home'), DSH_PLUGIN_INSTALL_DIR: '', CI: 'true', pnpm_config_verify_deps_before_run: 'false' }
  for (const key of ['GITHUB_TOKEN', 'GH_TOKEN', 'DEEPSEEK_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'NPM_TOKEN']) delete env[key]
  const result = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--experimental-strip-types', fileURLToPath(new URL('./web-runtime-worker.mjs', import.meta.url)), fixture], {
      env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
    })
    let output = ''
    child.stdout.on('data', chunk => { output += chunk; process.stdout.write(chunk) })
    child.stderr.on('data', chunk => { output += chunk; process.stderr.write(chunk) })
    const timer = setTimeout(() => { child.kill(); reject(new Error('Web runtime fixture timed out')) }, 120_000)
    child.once('error', error => { clearTimeout(timer); reject(error) })
    child.once('close', code => { clearTimeout(timer); resolve({ code, output }) })
  })
  assert.equal(result.code, 0, result.output)
} finally {
  rmSync(fixture, { recursive: true, force: true })
}
