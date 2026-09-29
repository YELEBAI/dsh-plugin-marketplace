/** 在完整源码 checkout 或已安装的 DSH 发布包之间复用真实类型和运行契约。 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
export const checkout = path.resolve(process.env.DSH_CHECKOUT?.trim() || 'D:/DSH/deepseek-harness')
export const packageRoot = process.env.DSH_PACKAGE_ROOT?.trim() ? path.resolve(process.env.DSH_PACKAGE_ROOT.trim()) : undefined

if (packageRoot !== undefined) {
  const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))
  if (manifest.name !== '@deepseek-ai/dsh') throw new Error('DSH_PACKAGE_ROOT must point at the installed @deepseek-ai/dsh package')
}

/** 仅解析现有工具；不会触发自动安装或下载。 */
export function resolveTool(name) {
  const locations = [root, process.env.MARKETPLACE_TOOLS_DIR?.trim(), packageRoot, checkout].filter(Boolean)
  for (const location of locations) {
    try { return createRequire(path.join(location, 'package.json')).resolve(name) }
    catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error }
  }
  const store = path.join(checkout, 'node_modules', '.pnpm')
  if (existsSync(store)) {
    for (const entry of readdirSync(store).filter(entry => entry.startsWith(name + '@')).sort().reverse()) {
      try { return createRequire(path.join(store, entry, 'package.json')).resolve(name) }
      catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error }
    }
  }
  throw new Error(`${name} is not installed; provide it through MARKETPLACE_TOOLS_DIR or DSH_CHECKOUT`)
}

export function resolveDsh(name) {
  if (packageRoot === undefined) throw new Error('DSH_PACKAGE_ROOT is required to resolve a published DSH module')
  return createRequire(path.join(packageRoot, 'package.json')).resolve(name)
}

/** 普通 npm 安装会提升依赖；全局/独立安装可能嵌套依赖，按 Node 的查找顺序定位清单。 */
function dshSearchPaths() {
  if (packageRoot === undefined) throw new Error('DSH_PACKAGE_ROOT is required')
  return createRequire(path.join(packageRoot, 'package.json')).resolve.paths('@deepseek-ai/dsh') ?? []
}

export function resolveDshManifest(name) {
  for (const directory of dshSearchPaths()) {
    const manifest = path.join(directory, name, 'package.json')
    if (existsSync(manifest)) return manifest
  }
  throw new Error(`Cannot find installed DSH package manifest: ${name}`)
}

export function typeConfig() {
  const config = JSON.parse(readFileSync(path.join(root, 'tsconfig.json'), 'utf8'))
  if (packageRoot === undefined) {
    const base = path.join(checkout, 'tsconfig.base.json')
    if (!existsSync(base)) throw new Error('DSH checkout is missing tsconfig.base.json: ' + checkout)
    const original = path.posix.dirname(config.extends.replaceAll('\\', '/'))
    config.extends = base.replaceAll('\\', '/')
    for (const [name, targets] of Object.entries(config.compilerOptions.paths)) {
      config.compilerOptions.paths[name] = targets.map(target => {
        const normalized = target.replaceAll('\\', '/')
        if (!normalized.startsWith(original + '/')) throw new Error('Unexpected DSH type path: ' + target)
        return checkout.replaceAll('\\', '/') + normalized.slice(original.length)
      })
    }
    return config
  }

  // npm 发布包自带生成类型；使用其公开 exports，避免将旧源码路径当作新版契约。
  const paths = {}
  const names = new Set()
  for (const directory of dshSearchPaths()) {
    const namespace = path.join(directory, '@deepseek-ai')
    if (!existsSync(namespace)) continue
    for (const name of readdirSync(namespace)) {
      if (existsSync(path.join(namespace, name, 'package.json'))) names.add('@deepseek-ai/' + name)
    }
  }
  for (const name of names) {
    const manifestPath = resolveDshManifest(name)
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    for (const [key, value] of Object.entries(manifest.exports ?? {})) {
      const target = typeof value === 'object' && value !== null ? value.types : undefined
      if (typeof target !== 'string') continue
      const absolute = path.resolve(path.dirname(manifestPath), target)
      if (!existsSync(absolute)) throw new Error(`Published DSH type export is missing: ${absolute}`)
      paths[manifest.name + (key === '.' ? '' : key.slice(1))] = [absolute.replaceAll('\\', '/')]
    }
    if (manifest.types && paths[manifest.name] === undefined) {
      paths[manifest.name] = [path.resolve(path.dirname(manifestPath), manifest.types).replaceAll('\\', '/')]
    }
  }
  return {
    compilerOptions: {
      target: 'ES2024', module: 'ESNext', moduleResolution: 'Bundler', strict: true,
      skipLibCheck: true, allowImportingTsExtensions: true, esModuleInterop: true,
      noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true,
      noImplicitOverride: true, noFallthroughCasesInSwitch: true,
      noUnusedLocals: true, noUnusedParameters: true, types: ['node'],
      jsx: 'react-jsx', noEmit: true, paths,
    },
    include: ['src'],
  }
}
