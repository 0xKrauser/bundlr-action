import Bundlr from '@bundlr-network/client'
import {existsSync, lstatSync} from 'fs'
import fsPath from 'path'

type Params = {
  sourcePath: string
  indexFile: string
}
export function pathCheck(
  params: Params,
  onDebug: (msg: string) => void,
  onFailure: (msg: string) => void
): [boolean, boolean, boolean] | [] {
  const {sourcePath, indexFile} = params

  const exists = existsSync(sourcePath)
  if (!exists) {
    onFailure('Specified path does not exist')
    return []
  }
  onDebug(`Path '${sourcePath}' exists, proceeding...`)

  const isDirectory = exists && lstatSync(sourcePath).isDirectory()
  if (!isDirectory) onDebug('Path is not a directory')

  const isWebsite =
    isDirectory && existsSync(fsPath.join(sourcePath, indexFile))
  if (!isWebsite)
    onDebug(
      `Not a website: path is either not a directory or ${indexFile} hasn't been found`
    )
  return [exists, isDirectory, isWebsite]
}
