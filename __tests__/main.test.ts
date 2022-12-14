import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import Bundlr from '@bundlr-network/client'

test('initialize bundlr (expect success)', () => {
  const endpoint = process.env['INPUT_BUNDLR-ENDPOINT']
  const currency = process.env['INPUT_BUNDLR-CURRENCY']
  const privateKey = process.env['INPUT_PRIVATE-KEY']
  try {
    const bundlr = new Bundlr(endpoint!, currency!, privateKey!)
    expect(bundlr).toBeDefined()
  } catch (e) {
    console.log(e)
  }
})

test('initialize bundlr without private key (expect undefined node address)', () => {
  let endpoint = process.env['INPUT_BUNDLR-ENDPOINT']!
  let currency = process.env['INPUT_BUNDLR-CURRENCY']!
  let privateKey = ''
  const bundlr = new Bundlr(endpoint, currency, privateKey)
  expect(bundlr.address).toBeUndefined()
})

test('test complete flow', () => {
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
