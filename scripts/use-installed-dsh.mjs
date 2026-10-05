/** 测试进程显式使用目标发布包的真实 DSH 依赖，不改写开发依赖或用户 Profile。 */
import { registerHooks } from 'node:module'
import { pathToFileURL } from 'node:url'
import { packageRoot, resolveDsh } from './dsh-environment.mjs'

if (packageRoot === undefined) throw new Error('DSH_PACKAGE_ROOT is required')
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@deepseek-ai/')) {
      return { url: pathToFileURL(resolveDsh(specifier)).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
})
