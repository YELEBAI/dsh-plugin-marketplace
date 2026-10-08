/**
 * Controlled process restart for the DSH host.
 *
 * A detached helper waits for the current PID to disappear before it starts
 * the exact same Node invocation. This avoids racing the replacement process
 * against the old web server while it is still releasing its listening port.
 */

import { spawn } from 'node:child_process'
import { isDesktopHost } from './runtime.ts'

const ENV_PARENT = 'DSH_MARKETPLACE_RESTART_PARENT'
const ENV_EXECUTABLE = 'DSH_MARKETPLACE_RESTART_EXECUTABLE'
const ENV_ARGS = 'DSH_MARKETPLACE_RESTART_ARGS'
const ENV_CWD = 'DSH_MARKETPLACE_RESTART_CWD'

const HELPER_SOURCE = String.raw`
const { spawn } = require('node:child_process')
const keys = [
  'DSH_MARKETPLACE_RESTART_PARENT',
  'DSH_MARKETPLACE_RESTART_EXECUTABLE',
  'DSH_MARKETPLACE_RESTART_ARGS',
  'DSH_MARKETPLACE_RESTART_CWD',
]
const decode = (name) => Buffer.from(process.env[name] || '', 'base64').toString('utf8')
const parentPid = Number(process.env.DSH_MARKETPLACE_RESTART_PARENT)
const executable = decode('DSH_MARKETPLACE_RESTART_EXECUTABLE')
const cwd = decode('DSH_MARKETPLACE_RESTART_CWD')
let args
try {
  args = JSON.parse(decode('DSH_MARKETPLACE_RESTART_ARGS'))
} catch {
  process.exit(2)
}
if (!Number.isInteger(parentPid) || parentPid <= 0 || executable === '' || cwd === '' || !Array.isArray(args)) {
  process.exit(2)
}
const env = { ...process.env }
for (const key of keys) delete env[key]
const deadline = Date.now() + 30000

function parentAlive() {
  try {
    process.kill(parentPid, 0)
    return true
  } catch (error) {
    return Boolean(error && error.code === 'EPERM')
  }
}

function relaunch() {
  const child = spawn(executable, args, {
    cwd,
    env,
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  })
  child.once('error', () => { process.exit(4) })
  child.once('spawn', () => {
    child.unref()
    process.exit(0)
  })
}

function waitForParent() {
  if (!parentAlive()) {
    setTimeout(relaunch, 350)
    return
  }
  if (Date.now() >= deadline) {
    process.exit(3)
  }
  setTimeout(waitForParent, 100)
}

waitForParent()
`

export interface RestartTarget {
  parentPid: number
  executable: string
  args: string[]
  cwd: string
  env: NodeJS.ProcessEnv
}

/** Capture the current executable and every Node/program argument verbatim. */
export function currentRestartTarget(): RestartTarget {
  return {
    parentPid: process.pid,
    executable: process.execPath,
    args: [...process.execArgv, ...process.argv.slice(1)],
    cwd: process.cwd(),
    env: process.env,
  }
}

function encode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64')
}

/** Start the detached waiter and resolve only once the helper itself exists. */
export async function launchRestartHelper(target: RestartTarget): Promise<void> {
  const helper = spawn(process.execPath, ['-e', HELPER_SOURCE], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    env: {
      ...target.env,
      [ENV_PARENT]: String(target.parentPid),
      [ENV_EXECUTABLE]: encode(target.executable),
      [ENV_ARGS]: encode(JSON.stringify(target.args)),
      [ENV_CWD]: encode(target.cwd),
    },
  })
  await new Promise<void>((resolve, reject) => {
    helper.once('spawn', resolve)
    helper.once('error', reject)
  })
  helper.unref()
}

/**
 * Arm the replacement process, then enter DSH's normal SIGTERM shutdown path
 * after the Remote response has had time to reach the browser.
 */
export async function scheduleProcessRestart(shutdownDelayMs = 750): Promise<void> {
  if (isDesktopHost()) throw new Error('Desktop restart is owned by Electron; do not relaunch the Host process.')
  await launchRestartHelper(currentRestartTarget())
  const timer = setTimeout(() => {
    if (process.platform === 'win32') {
      const handled = process.emit('SIGTERM')
      if (!handled) process.exit(0)
      return
    }
    try {
      process.kill(process.pid, 'SIGTERM')
    } catch {
      process.exit(0)
    }
  }, shutdownDelayMs)
  timer.unref()
}
