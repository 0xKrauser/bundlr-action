import * as core from '@actions/core'
import fsPath from 'path'
import { dirSize, fileSize } from './getSize'
import { initializeBundlr } from './initializeBundlr'
import { pathCheck as pathCheckFn } from './pathCheck'

async function run(): Promise<void> {
  // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
  function debug(msg: string) {
    core.debug(msg)
    //console.log(msg)
  }
  function fail(msg: string) {
    core.setFailed(`Action failed: ${msg}`)
    //console.log(`Action failed: ${msg}`)
  }
  try {
    const privateKey: string = core.getInput('private-key')
    const currency: string = core.getInput('bundlr-currency')
    const endpoint: string = core.getInput('bundlr-endpoint')
    const bundlrPriceLimit: string = core.getInput('bundlr-price-limit')
    const path: string = core.getInput('path')
    const indexFile: string = core.getInput('index-file')
    const tags: string = core.getInput('tags')

    // Getting workspace directory
    const workspace = process.env.GITHUB_WORKSPACE
    if (!workspace) return

    // If path is absolute use it
    let sourcePath = path

    // Otherwise combine it using workspace and provided path
    if (!fsPath.isAbsolute(path)) {
      sourcePath = fsPath.join(workspace.toString(), path)
    }
    console.log(sourcePath)

    const client = initializeBundlr(
      { endpoint, currency, privateKey },
      msg => debug(msg),
      msg => fail(msg)
    )
    if (!client) return

    const pathCheck = pathCheckFn(
      { sourcePath, indexFile },
      msg => debug(msg),
      msg => fail(msg)
    )
    if (!pathCheck.length) return

    const [exists, isDirectory, isWebsite] = pathCheck

    // Calculate file/directory size
    const size = await (isDirectory
      ? dirSize(sourcePath)
      : fileSize(sourcePath))
    debug(`Upload size: ${size} bytes`)

    // Fetch price, log in readable units
    const price = await client.getPrice(size)
    const priceFormatted = client.utils.unitConverter(price.times(1.1))
    debug(`Bundlr price: ${priceFormatted} ${currency.toUpperCase()}`)

    // Fetch wallet balance, validate against price
    const balance = await client.getLoadedBalance()
    if (price.gt(balance)) {
      fail(
        `Est. price: ${priceFormatted} ${currency.toUpperCase()}. Insufficient wallet balance`
      )
      return
    }

    // Fail if price exceeds the user set limit
    if (price.gt(bundlrPriceLimit)) {
      fail(
        `Fetched price exceeds set limit, price: ${price.toFixed()}, your price limit: ${bundlrPriceLimit}`
      )
      return
    }

    // Fail if meta tags can't be parsed
    let parsedTags
    try {
      parsedTags = JSON.parse(tags)
    } catch (e) {
      fail('Failed to parse tags')
      return
    }

    let transactionId

    try {
      if (isWebsite) {
        const upload = await client.uploadFolder(sourcePath, {
          indexFile:
            indexFile.toLowerCase() === 'false' ? undefined : indexFile,
          interactivePreflight: process.env.ACTION_DEV_ENV ? true : false
        })
        console.log(upload)
        transactionId = upload?.id
      } else {
        const upload = await client.uploadFile(sourcePath, { tags: parsedTags })
        transactionId = upload?.id
      }
    } catch (e: any) {
      fail(e.message)
      return
    }

    core.setOutput('timestamp', new Date().toTimeString())
    core.setOutput('transaction-id', transactionId)
  } catch (error) {
    if (error instanceof Error) fail(error.message)
  }
}

run()
