import {readFile, stat, opendir} from 'fs/promises'
import * as p from 'path'

async function* walk(dir: string): any {
  for await (const d of await opendir(dir)) {
    const entry = p.join(dir, d.name)
    if (d.isDirectory()) yield* await walk(entry)
    else if (d.isFile()) yield entry
  }
}

export async function dirSize(dir: string): Promise<any> {
  let total = 0
  for await (const f of walk(dir)) {
    const relPath = p.relative(dir, f)
    total += (await stat(f)).size
  }
  return total
}

export const fileSize = async (filename: string) => {
  const file = await readFile(filename)
  const fileStat = await stat(file)
  return fileStat.size
}
