/** Emit package-owned declarations; the separate typecheck command validates the full DSH graph. */
import ts from 'typescript'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

export function buildDeclarations(root, checkout) {
  const config = JSON.parse(readFileSync(path.join(root, 'tsconfig.json'), 'utf8'))
  const originalBase = path.posix.dirname(config.extends.replaceAll('\\', '/'))
  const checkoutPath = path.resolve(checkout).replaceAll('\\', '/')
  config.extends = checkoutPath + '/tsconfig.base.json'
  for (const [name, targets] of Object.entries(config.compilerOptions.paths)) {
    config.compilerOptions.paths[name] = targets.map(target => {
      const normalized = target.replaceAll('\\', '/')
      if (!normalized.startsWith(originalBase + '/')) throw new Error('Unexpected DSH type path: ' + target)
      return checkoutPath + normalized.slice(originalBase.length)
    })
  }
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, root)
  const sourceDir = path.join(root, 'src')
  const outputDir = path.join(root, 'lib', 'types')
  const program = ts.createProgram(parsed.fileNames, {
    ...parsed.options,
    noEmit: false,
    declaration: true,
    emitDeclarationOnly: true,
    declarationMap: false,
    sourceMap: false,
    rootDir: sourceDir,
    outDir: outputDir,
    newLine: ts.NewLineKind.LineFeed,
  })
  const diagnostics = [...parsed.errors]
  let count = 0
  // Do not emit sources from the external DSH checkout into the plugin package.
  for (const source of program.getSourceFiles()) {
    const relative = path.relative(sourceDir, source.fileName)
    if (source.isDeclarationFile || relative.startsWith('..') || path.isAbsolute(relative)) continue
    const result = program.emit(source, (file, text) => {
      const output = path.relative(outputDir, file)
      if (output.startsWith('..') || path.isAbsolute(output) || !file.endsWith('.d.ts')) {
        throw new Error('Declaration output outside lib/types: ' + file)
      }
      mkdirSync(path.dirname(file), { recursive: true })
      writeFileSync(file, text, 'utf8')
      count += 1
    }, undefined, true, { afterDeclarations: [rewriteModuleExtensions] })
    diagnostics.push(...result.diagnostics)
    if (result.emitSkipped) throw new Error('Declaration emission failed: ' + source.fileName)
  }
  if (diagnostics.length > 0) {
    throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: file => file,
      getCurrentDirectory: () => root,
      getNewLine: () => '\n',
    }))
  }
  if (count === 0) throw new Error('No package declarations generated')
  console.log('declarations generated: ' + count + ' files')
}

/** Published declarations refer to sibling declarations via Node-compatible .js specifiers. */
function rewriteModuleExtensions(context) {
  const visit = node => {
    const specifier = ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
      ? node.moduleSpecifier
      : ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) ? node.argument.literal : undefined
    if (specifier !== undefined && ts.isStringLiteral(specifier)
      && /^\.\.?\//.test(specifier.text) && /\.tsx?$/.test(specifier.text)) {
      const replacement = context.factory.createStringLiteral(specifier.text.replace(/\.tsx?$/, '.js'))
      if (ts.isImportDeclaration(node)) return context.factory.updateImportDeclaration(node, node.modifiers, node.importClause, replacement, node.attributes)
      if (ts.isExportDeclaration(node)) return context.factory.updateExportDeclaration(node, node.modifiers, node.isTypeOnly, node.exportClause, replacement, node.attributes)
      return context.factory.updateImportTypeNode(node, context.factory.createLiteralTypeNode(replacement), node.attributes, node.qualifier, node.typeArguments, node.isTypeOf)
    }
    return ts.visitEachChild(node, visit, context)
  }
  return source => ts.visitNode(source, visit)
}
