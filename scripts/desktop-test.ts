/** 桌面端包管理配置与安全边界回归；只写临时目录。 */
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { JobTable, runPnpmJob } from '../src/host/installer.ts'
import { activeProfileRuntime, isDesktopHost, packageManagerFor, withDesktopProfileLock } from '../src/host/runtime.ts'

const root = mkdtempSync(join(tmpdir(), 'mkt-desktop with spaces-'))
try {
  assert.equal(packageManagerFor({}), undefined, '旧版 Web 沿用系统 pnpm')
  assert.equal(isDesktopHost('40.0.0', { ELECTRON_RUN_AS_NODE: '1' }), true)
  assert.equal(isDesktopHost('40.0.0', {}), false)
  assert.throws(() => packageManagerFor({}, true), /refusing to use system pnpm/)
  await assert.rejects(withDesktopProfileLock({}, root, async () => { throw new Error('must not run') }, true), /installation anchor/)
  assert.equal(await withDesktopProfileLock({}, root, async () => 'legacy-web', false), 'legacy-web')
  assert.throws(() => activeProfileRuntime({ get: () => ({ dir: root, packageManager: { command: '', args: [] } }) }), /invalid/)
  const runner = join(root, 'owned pnpm.mjs')
  const record = join(root, 'record.json')
  writeFileSync(runner, `import {writeFileSync} from 'node:fs';writeFileSync(process.env.MKT_DESKTOP_RECORD, JSON.stringify({args:process.argv.slice(2),path:process.env.PATH,ci:process.env.CI,cwd:process.cwd()}))`)
  const context = { get: () => ({ dir: root, packageManager: {
    command: process.execPath, args: [runner], env: { PATH: 'desktop-only-tools', MKT_DESKTOP_RECORD: record },
  } }) }
  const runtime = packageManagerFor(context, true)
  assert(runtime)
  const originalPath = process.env.PATH
  const table = new JobTable(runtime)
  const job = table.create('install', 'fixture')
  const dir = join(root, 'profile')
  mkdirSync(join(dir, 'node_modules'), { recursive: true })
  writeFileSync(join(dir, 'node_modules', '.modules.yaml'), JSON.stringify({ storeDir: join(root, 'store', 'v11', 'v11') }))
  assert.equal(await runPnpmJob(job, ['install', '--offline', '--ignore-scripts'], dir, table), 0, job.log)
  const observed = JSON.parse(readFileSync(record, 'utf8')) as { args: string[]; path: string; ci: string; cwd: string }
  assert(observed.args.includes('--no-frozen-lockfile'))
  assert(observed.args.some(arg => arg.endsWith('v11' + (process.platform === 'win32' ? '\\' : '/') + 'v11')))
  assert.equal(observed.path, 'desktop-only-tools')
  assert.equal(observed.ci, 'true')
  assert.equal(observed.cwd, dir)
  assert.equal(process.env.PATH, originalPath, '私有工具 PATH 不能污染 Host 或 Agent')
  console.log('Desktop runtime unit regressions passed')
} finally {
  rmSync(root, { recursive: true, force: true })
}
