import * as core from '@actions/core'

async function run(): Promise<void> {
    try {
        const privateKey: string = core.getInput('private-key')
        const bundlrCurrency: string = core.getInput('bundlr-currency')
        const bundlrEndpoint: string = core.getInput('bundlr-endpoint')
        const bundlrPriceLimit: string = core.getInput('bundlr-price-limit')
        const indexFile: string = core.getInput('index-file')
        const tags: string = core.getInput('tags')
        
        core.debug(`Initializing Bundlr Client...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
        
        try {
            const tagArray = JSON.parse(tags)
        } catch (e) {
            core.setFailed('Failed to parse tags')
        }


        core.setOutput('timestamp', new Date().toTimeString())
        core.setOutput('transaction-id', '')
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()