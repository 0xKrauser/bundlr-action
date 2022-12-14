import Bundlr from '@bundlr-network/client'

type Params = {
  endpoint: string
  currency: string
  privateKey: string
}
export function initializeBundlr(
  params: Params,
  onDebug: (msg: string) => void,
  onFailure: (msg: string) => void
): Bundlr | undefined {
  try {
    onDebug(`Initializing Bundlr Client...`)
    const {endpoint, currency, privateKey} = params
    const bundlr = new Bundlr(endpoint, currency, privateKey)
    return bundlr
  } catch (e: any) {
    onFailure(e.message)
  }
}
