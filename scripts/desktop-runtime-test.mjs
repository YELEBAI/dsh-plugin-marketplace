/** 使用用户指定的已安装 Electron/DSH/pnpm，只在临时 Profile 做离线测试。 */
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openAsar } from './asar-reader.mjs'

const desktop = process.env.DSH_DESKTOP_ROOT?.trim()
if (!desktop) throw new Error('Set DSH_DESKTOP_ROOT to an existing DSH Desktop installation; this test never downloads one.')
const installation = resolve(desktop)
const exe = join(installation, 'DeepSeek Harness.exe')
const asar = join(installation, 'resources', 'app.asar')
const pnpm = join(installation, 'resources', 'runtime', 'pnpm', 'bin', 'pnpm.cjs')
for (const file of [exe, asar, pnpm]) assert(existsSync(file), 'Missing installed runtime: ' + file)
const archive = openAsar(asar)
try {
  const manifest = JSON.parse(archive.read('package.json'))
  assert.equal(manifest.name, '@deepseek-ai/dsh-desktop')
  console.log('Testing installed Desktop', manifest.version, manifest.dshBuildCommit)
} finally { archive.close() }

const fixture = mkdtempSync(join(tmpdir(), 'mkt-desktop-runtime with spaces-'))
try {
  const worker = fileURLToPath(new URL('./desktop-runtime-worker.mjs', import.meta.url))
  const processResult = await new Promise((resolveResult, reject) => {
    const child = spawn(exe, ['--expose-internals', worker, installation, fixture], {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', DSH_HOME: join(fixture, 'home'), DSH_TELEMETRY_DISABLED: '1' },
    })
    let output = ''
    child.stdout.on('data', chunk => { output += chunk; process.stdout.write(chunk) })
    child.stderr.on('data', chunk => { output += chunk; process.stderr.write(chunk) })
    const timeout = setTimeout(() => { child.kill(); reject(new Error('Desktop runtime fixture timed out')) }, 120_000)
    child.once('error', error => { clearTimeout(timeout); reject(error) })
    child.once('close', code => { clearTimeout(timeout); resolveResult({ code, output }) })
  })
  assert.equal(processResult.code, 0, processResult.output)
} finally { rmSync(fixture, { recursive: true, force: true }) }
