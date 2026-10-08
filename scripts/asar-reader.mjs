/** 只读检查已安装桌面端的 ASAR；不解包或修改应用目录。 */
import { closeSync, openSync, readFileSync, readSync } from 'node:fs'

export function openAsar(archive) {
  const fd = openSync(archive, 'r')
  try {
    const size = Buffer.alloc(8)
    readSync(fd, size, 0, 8, 0)
    const headerSize = size.readUInt32LE(4)
    if (headerSize < 8 || headerSize > 64 * 1024 * 1024) throw new Error('Invalid ASAR header size')
    const bytes = Buffer.alloc(headerSize)
    readSync(fd, bytes, 0, bytes.length, 8)
    const header = JSON.parse(bytes.subarray(8, 8 + bytes.readUInt32LE(4)).toString())
    function entry(name) {
      let value = header
      for (const part of name.split('/')) value = value?.files?.[part]
      return value
    }
    function read(name, visited = new Set()) {
      if (visited.has(name) || name.split('/').some(part => part === '..' || part === '')) throw new Error('Invalid ASAR path')
      visited.add(name)
      const value = entry(name)
      if (value === undefined) throw new Error('Missing ASAR file: ' + name)
      if (value.link !== undefined) return read(value.link, visited)
      if (value.unpacked) return readFileSync(archive + '.unpacked/' + name, 'utf8')
      const content = Buffer.alloc(Number(value.size))
      readSync(fd, content, 0, content.length, 8 + headerSize + Number(value.offset))
      return content.toString()
    }
    return { read, entry, close: () => closeSync(fd) }
  } catch (error) {
    closeSync(fd)
    throw error
  }
}
