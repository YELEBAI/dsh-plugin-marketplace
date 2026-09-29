import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const script = fileURLToPath(new URL('./dsh-environment.mjs', import.meta.url))
function manifest(directory, name) {
  mkdirSync(join(directory, 'lib'), { recursive: true })
  writeFileSync(join(directory, 'package.json'), JSON.stringify({
    name, type: 'module', exports: { '.': { types: './lib/index.d.ts', default: './lib/index.js' } },
  }))
  writeFileSync(join(directory, 'lib/index.js'), 'export {}')
  writeFileSync(join(directory, 'lib/index.d.ts'), 'export {}')
}

for (const layout of ['nested', 'hoisted']) {
  test(`发布包路径解析支持 ${layout} 安装，并优先选择最近依赖`, () => {
    const fixture = mkdtempSync(join(tmpdir(), 'marketplace-dsh-layout-'))
    try {
      const packageRoot = join(fixture, 'node_modules/@deepseek-ai/dsh')
      manifest(packageRoot, '@deepseek-ai/dsh')
      const hoisted = join(fixture, 'node_modules/@deepseek-ai/fixture-layout')
      manifest(hoisted, '@deepseek-ai/fixture-layout')
      const target = layout === 'nested' ? join(packageRoot, 'node_modules/@deepseek-ai/fixture-layout') : hoisted
      if (layout === 'nested') manifest(target, '@deepseek-ai/fixture-layout')
      const probe = `
        import { resolveDsh, resolveDshManifest, typeConfig } from ${JSON.stringify(new URL('./dsh-environment.mjs', import.meta.url).href)}
        console.log(JSON.stringify({
          entry: resolveDsh('@deepseek-ai/fixture-layout'),
          manifest: resolveDshManifest('@deepseek-ai/fixture-layout'),
          types: typeConfig().compilerOptions.paths['@deepseek-ai/fixture-layout'],
        }))
      `
      const result = spawnSync(process.execPath, ['--input-type=module', '-e', probe], {
        cwd: resolve(script, '..', '..'), env: { ...process.env, DSH_PACKAGE_ROOT: packageRoot }, encoding: 'utf8',
      })
      assert.equal(result.status, 0, result.stderr)
      assert.deepEqual(JSON.parse(result.stdout), {
        entry: join(target, 'lib/index.js'), manifest: join(target, 'package.json'),
        types: [join(target, 'lib/index.d.ts').replaceAll('\\', '/')],
      })
    } finally {
      rmSync(fixture, { recursive: true, force: true })
    }
  })
}
