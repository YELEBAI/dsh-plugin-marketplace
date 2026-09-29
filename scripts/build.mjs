/** Build the dual-face plugin artifacts with the checkout's esbuild.
 *  node scripts/build.mjs  (DSH_CHECKOUT overrides the checkout path)
 *  Emits runtime entries in lib/ and owned declarations in lib/types/.
 */
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildDeclarations } from './build-declarations.mjs'
import { checkout, packageRoot, resolveTool } from './dsh-environment.mjs'

const require = createRequire(import.meta.url)
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const esbuild = require(resolveTool('esbuild'))
const zod = path.join(root, 'node_modules', 'zod')
if (!existsSync(path.join(zod, 'package.json'))) throw new Error('zod is not installed under the plugin workspace')

// The loader module table: every entry the browser require can answer
// (platform seed + the documented runtime-store exemption).
const PLATFORM_EXTERNALS = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
  '@deepseek-ai/dsh-client-runtime/client',
]

const ID = 'dsh-plugin-marketplace'
const INTRO = 'var module = { exports: {} }; var exports = module.exports;'
const BANNER = 'window.__ModuleLoader__.load({ id: ' + JSON.stringify(ID) + ', factory: (require) => {\n' + INTRO
const FOOTER = 'return module.exports; } });'

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['src/host/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'es2024',
  tsconfigRaw: { compilerOptions: { alwaysStrict: true } },
  outfile: 'lib/index.js',
  external: ['@deepseek-ai/*', 'zod'],
  logLevel: 'info',
  nodePaths: [path.join(packageRoot ?? checkout, 'node_modules')],
})

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['src/typert.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'es2024',
  tsconfigRaw: { compilerOptions: { alwaysStrict: true } },
  outfile: 'lib/typert.js',
  preserveSymlinks: true,
  alias: { zod },
})

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['src/remote.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'es2024',
  tsconfigRaw: { compilerOptions: { alwaysStrict: true } },
  outfile: 'lib/remote.js',
  preserveSymlinks: true,
  alias: { zod },
})

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['src/client/index.ts'],
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  // Do not inherit the maintainer checkout's absolute tsconfig path. Besides
  // being non-portable, that made Windows and Linux disagree about whether
  // the generated CommonJS bundle should contain the strict-mode directive.
  tsconfigRaw: { compilerOptions: { alwaysStrict: true } },
  jsx: 'automatic',
  outfile: 'lib/client.js',
  preserveSymlinks: true,
  external: PLATFORM_EXTERNALS,
  alias: { zod },
  banner: { js: BANNER },
  footer: { js: FOOTER },
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
})

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['src/types.ts'],
  tsconfigRaw: { compilerOptions: {} },
  format: 'esm',
  outfile: 'lib/types.js',
  banner: { js: '// Generated from src/types.ts. Type-only declarations have no runtime values.' },
  footer: { js: 'export {};' },
})
buildDeclarations(root)

console.log('build complete: host, client, wire artifacts and public declarations')
