import path from 'node:path'
import ts from 'typescript'

/** Validate files in either a checkout or the actual npm tarball. */
export function assertPackageContract(pkg, read) {
  if (typeof pkg.engines?.node !== 'string' || !pkg.engines.node.trim()) {
    throw new Error('Node compatibility declaration missing')
  }
  const visited = new Set()
  function check(target, label, declaration = false) {
    if (typeof target !== 'string' || !target || target.includes('\\') || target.includes('*')
      || path.posix.isAbsolute(target) || /^[a-z]+:/i.test(target)
      || target.split('/').includes('..')) throw new Error('Invalid package path: ' + label)
    const file = target.replace(/^\.\//, '')
    const text = read(file)
    if (text === undefined) throw new Error('Missing ' + label + ': ' + file)
    if (!declaration || visited.has(file)) return
    visited.add(file)
    for (const reference of ts.preProcessFile(String(text)).importedFiles) {
      const spec = reference.fileName
      if (!spec.startsWith('.')) continue
      if (!/\.js$/.test(spec)) throw new Error('Non-portable declaration import: ' + file + ' -> ' + spec)
      const dependency = path.posix.join(path.posix.dirname(file), spec.replace(/\.js$/, '.d.ts'))
      check(dependency, 'declaration dependency', true)
    }
  }
  function exports(value, label, declaration = false) {
    if (typeof value === 'string') check(value, label, declaration)
    else if (value !== null && typeof value === 'object') {
      for (const [key, target] of Object.entries(value)) exports(target, label + '/' + key, declaration || key === 'types')
    } else if (value !== null) throw new Error('Invalid export: ' + label)
  }
  check(pkg.main, 'main entry')
  check(pkg.types, 'types entry', true)
  exports(pkg.exports, 'exports')
  check(pkg.dsh?.bundle?.patch, 'bundle patch')
  return visited.size
}
