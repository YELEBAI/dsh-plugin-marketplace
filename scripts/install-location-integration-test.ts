/** Real pnpm integration checks for external plugin directories.
 *  These tests execute pnpm in isolated temporary projects but never run
 *  third-party lifecycle scripts or modify a DSH profile.
 */

import { strict as assert } from 'node:assert'
import { spawnSync } from 'node:child_process'
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, parse } from 'node:path'
import { linkProfilePeerDependencies, localDependencySpec } from '../src/host/install-location.ts'

let passed = 0
function ok(name: string, fn: () => void): void {
  fn()
  passed += 1
  console.log('ok - ' + name)
}

function runPnpm(cwd: string, args: string[]): void {
  const result = spawnSync('pnpm', args, {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    windowsHide: true,
  })
  if (result.status !== 0) {
    throw new Error([
      'pnpm integration command failed: pnpm ' + args.join(' '),
      result.stdout,
      result.stderr,
    ].filter(Boolean).join('\n'))
  }
}

const tmp = mkdtempSync(join(tmpdir(), 'mkt-pnpm-integration-'))
let profileProject: string | null = null
try {
  const store = join(tmp, 'store')
  const hostProfile = join(tmp, 'host-profile')
  const hostPeer = join(hostProfile, 'node_modules', '@dsh-test', 'host-peer')
  mkdirSync(hostPeer, { recursive: true })
  writeFileSync(join(hostPeer, 'package.json'), JSON.stringify({
    name: '@dsh-test/host-peer',
    version: '1.2.0',
  }))

  const externalPlugin = join(tmp, 'external-plugin')
  mkdirSync(externalPlugin, { recursive: true })
  writeFileSync(join(externalPlugin, 'package.json'), JSON.stringify({
    name: 'external-plugin',
    version: '1.0.0',
    scripts: {
      prepare: 'node -e "require(\'node:fs\').writeFileSync(\'prepare-ran\', \'x\')"',
    },
    peerDependencies: {
      '@dsh-test/host-peer': '^1.0.0',
    },
  }))
  runPnpm(externalPlugin, [
    'install',
    '--prod',
    '--ignore-scripts',
    '--config.auto-install-peers=false',
    '--config.store-dir=' + store,
  ])

  const peerDestination = join(externalPlugin, 'node_modules', '@dsh-test', 'host-peer')
  ok('pnpm leaves Host peers uninstalled for marketplace linking', () => {
    assert.equal(existsSync(peerDestination), false)
  })
  ok('pnpm does not execute the external plugin prepare script', () => {
    assert.equal(existsSync(join(externalPlugin, 'prepare-ran')), false)
  })
  ok('the missing peer is linked from the active Host profile', () => {
    assert.deepEqual(linkProfilePeerDependencies(externalPlugin, hostProfile), ['@dsh-test/host-peer'])
    assert.equal(lstatSync(peerDestination).isSymbolicLink(), true)
  })

  // On the maintainer's Windows checkout tmpdir is on C: and the repository
  // is on D:, exercising the cross-volume file: form. Other environments
  // still validate the same spec through a real lockfile-only pnpm install.
  profileProject = mkdtempSync(join(process.cwd(), '.mkt-pnpm-profile-'))
  const fileTarget = join(tmp, 'file-target')
  mkdirSync(fileTarget, { recursive: true })
  writeFileSync(join(fileTarget, 'package.json'), JSON.stringify({
    name: 'file-target-plugin',
    version: '1.0.0',
  }))
  const fileSpec = localDependencySpec(profileProject, fileTarget)
  writeFileSync(join(profileProject, 'package.json'), JSON.stringify({
    name: 'profile-test',
    private: true,
    dependencies: { 'file-target-plugin': fileSpec },
  }))
  runPnpm(profileProject, [
    'install',
    '--lockfile-only',
    '--ignore-scripts',
    '--ignore-workspace',
    '--config.store-dir=' + store,
  ])
  ok('pnpm accepts the generated local dependency spec', () => {
    assert.match(readFileSync(join(profileProject!, 'pnpm-lock.yaml'), 'utf8'), /file-target-plugin/)
  })
  if (process.platform === 'win32' && parse(profileProject).root !== parse(fileTarget).root) {
    ok('the real pnpm check crossed Windows volumes', () => {
      assert.match(fileSpec, /^file:[A-Za-z]:\//)
    })
  }
} finally {
  if (profileProject !== null) rmSync(profileProject, { recursive: true, force: true })
  rmSync(tmp, { recursive: true, force: true })
}

console.log('install-location integration tests passed: ' + passed)
