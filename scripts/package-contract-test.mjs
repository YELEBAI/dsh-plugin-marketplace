/** Test the published package, not source aliases or files excluded by npm pack. */
import assert from 'node:assert/strict'
import { execSync, execFileSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createGunzip } from 'node:zlib'
import tar from 'tar-stream'
import ts from 'typescript'
import { assertPackageContract } from './package-contract.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const scratchParent = path.join(root, '.compatibility-work')
mkdirSync(scratchParent, { recursive: true })
const scratch = mkdtempSync(path.join(scratchParent, 'package-contract-'))
let archive
try {
  // A fixed command: no plugin input is interpolated, and lifecycle scripts are disabled.
  const [packed] = JSON.parse(execSync('npm pack --json --ignore-scripts', { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }))
  assert.equal(path.basename(packed.filename), packed.filename)
  assert.ok(packed.filename.endsWith('.tgz'))
  archive = path.join(root, packed.filename)
  const files = new Map()
  const extract = tar.extract()
  const input = createReadStream(archive)
  const unzip = createGunzip()
  await new Promise((resolve, reject) => {
    input.on('error', reject)
    unzip.on('error', reject)
    extract.on('error', reject)
    extract.on('finish', resolve)
    extract.on('entry', (header, stream, next) => {
      const chunks = []
      stream.on('error', reject)
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('end', () => {
        try {
          if (header.type === 'directory') return next()
          assert.equal(header.type, 'file', 'Package must not contain links')
          assert.ok(header.name.startsWith('package/'))
          const file = header.name.slice('package/'.length)
          assert.ok(file && !file.includes('\\') && !file.includes(':') && !file.startsWith('/') && !file.split('/').includes('..'))
          assert.ok(!files.has(file), 'Duplicate tar entry: ' + file)
          files.set(file, Buffer.concat(chunks))
          next()
        } catch (error) { reject(error) }
      })
    })
    input.pipe(unzip).pipe(extract)
  })
  const pkg = JSON.parse(files.get('package.json'))
  const read = file => files.get(file)
  const declarations = assertPackageContract(pkg, read)
  assert.ok(declarations > 0)
  for (const file of [pkg.types, 'lib/types.js', 'lib/types/types.d.ts', 'cordis.patch.yml']) {
    assert.throws(() => assertPackageContract(pkg, name => name === file ? undefined : read(name)), /Missing/)
  }
  assert.throws(() => assertPackageContract({ ...pkg, engines: {} }, read), /Node compatibility/)
  assert.throws(() => assertPackageContract({ ...pkg, main: '../escape.js' }, read), /Invalid package path/)
  assert.throws(() => assertPackageContract({ ...pkg, exports: { './absent': './lib/absent.js' } }, read), /Missing exports/)

  const packageDir = path.join(scratch, 'node_modules', pkg.name)
  for (const [file, content] of files) {
    const destination = path.join(packageDir, file)
    mkdirSync(path.dirname(destination), { recursive: true })
    writeFileSync(destination, content)
  }
  writeFileSync(path.join(scratch, 'package.json'), '{"type":"module"}\n')
  const runtimeProbe = path.join(scratch, 'runtime.mjs')
  writeFileSync(runtimeProbe, `
import assert from 'node:assert/strict'
import MarketplaceService from 'dsh-plugin-marketplace'
import { TYPERT } from 'dsh-plugin-marketplace/typert'
import remote from 'dsh-plugin-marketplace/remote'
import * as types from 'dsh-plugin-marketplace/types'
assert.equal(typeof MarketplaceService, 'function')
assert.ok(remote)
assert.equal(Object.keys(types).length, 0)
const symbols = new Set()
for (const item of TYPERT.invocations) {
  assert.equal(typeof MarketplaceService.prototype[item.implementation ?? item.method], 'function')
  for (const codec of [...item.parameters.map(p => p.codec), item.result]) {
    assert.ok(codec.typeSymbol.startsWith('dsh-plugin-marketplace/types#'))
    symbols.add(codec.typeSymbol.split('#')[1])
  }
}
console.log(JSON.stringify([...symbols]))
`)
  const symbols = JSON.parse(execFileSync(process.execPath, [runtimeProbe], { cwd: scratch, encoding: 'utf8' }))
  assert.ok(symbols.length > 0)
  const consumer = path.join(scratch, 'consumer.mts')
  writeFileSync(consumer, `
import MarketplaceService from 'dsh-plugin-marketplace'
import { TYPERT } from 'dsh-plugin-marketplace/typert'
import remote from 'dsh-plugin-marketplace/remote'
import type { MarketplaceTabProps } from 'dsh-plugin-marketplace/client'
import type { ${symbols.join(', ')} } from 'dsh-plugin-marketplace/types'
type IsAny<T> = 0 extends (1 & T) ? true : false
type Assert<T extends true> = T
type Valid = Assert<IsAny<MarketplaceSearchRequest> extends false ? true : false>
type Method = Assert<IsAny<Parameters<MarketplaceService['search']>[0]> extends false ? true : false>
const request: MarketplaceSearchRequest = { query: '', page: 1, sort: 'stars', category: 'all' }
// @ts-expect-error invalid inputs must not silently become any
const invalid: MarketplaceSearchRequest = { query: 42 }
declare const service: MarketplaceService
const result: Promise<MarketplaceSearchOutcome> = service.search(request)
`)
  const program = ts.createProgram([consumer], {
    strict: true, noEmit: true, skipLibCheck: true, types: [],
    module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ES2024, jsx: ts.JsxEmit.ReactJSX,
  })
  const diagnostics = ts.getPreEmitDiagnostics(program)
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: file => file, getCurrentDirectory: () => scratch, getNewLine: () => '\n',
  }))
  console.log(`PACKAGE CONTRACT OK: ${files.size} packed files, ${declarations} reachable declarations, ${symbols.length} wire types; Node ${process.version}`)
  console.log('Missing JS/types/patch, omitted exports, invalid paths and missing engines regressions passed')
} finally {
  // Only remove the generated archive and this test's mkdtemp directory.
  if (archive && existsSync(archive)) rmSync(archive)
  rmSync(scratch, { recursive: true, force: true })
}
