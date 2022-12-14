import {Chain} from 'wagmi'
import {
  arbitrum,
  avalanche,
  fantom,
  mainnet,
  optimism,
  polygon,
  polygonMumbai
} from '@wagmi/chains'
import {ZERO_ADDRESS} from './misc'

export type BundlrCurrency = {
  name: string
  label: string
  isNative: boolean
  address: string
}

type SupportedChain = {
  id: number
  name: string
  label: string
  currency: string
  bundlrNodes: string[]
  bundlrCurrencies: BundlrCurrency[]
  rpc: string
  wagmi: Chain
}

const ETHEREUM: BundlrCurrency = {
  name: 'ethereum',
  label: 'ETH',
  isNative: true,
  address: ZERO_ADDRESS
}

const BNB: BundlrCurrency = {
  name: 'bnb',
  label: 'BNB',
  isNative: true,
  address: ZERO_ADDRESS
}

const AVAX: BundlrCurrency = {
  name: 'avalanche',
  label: 'AVAX',
  isNative: true,
  address: ZERO_ADDRESS
}

const MATIC: BundlrCurrency = {
  name: 'matic',
  label: 'MATIC',
  isNative: true,
  address: ZERO_ADDRESS
}

const FTM: BundlrCurrency = {
  name: 'fantom',
  label: 'FTM',
  isNative: true,
  address: ZERO_ADDRESS
}

const BOBA: BundlrCurrency = {
  name: 'boba',
  label: 'BOBA',
  isNative: false,
  address: '0xa18bF3994C0Cc6E3b63ac420308E5383f53120D7'
}

const BOBA_ETH: BundlrCurrency = {
  name: 'boba-eth',
  label: 'ETH',
  isNative: true,
  address: ZERO_ADDRESS
}

const ARBITRUM_ETH: BundlrCurrency = {
  name: 'arbitrum',
  label: 'ETH',
  isNative: true,
  address: ZERO_ADDRESS
}

export const bobaCustomChain: Chain = {
  id: 280,
  name: 'Boba Network',
  network: 'boba',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {http: ['https://mainnet.boba.network']}
  },
  blockExplorers: {
    etherscan: {name: 'Bobascan', url: 'https://bobascan.com/'},
    default: {name: 'Bobascan', url: 'https://bobascan.com/'}
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11', // placeholder, have to find or deploy
      blockCreated: 11907934
    }
  }
}

//

export const ARBITRUM: SupportedChain = {
  id: 42161,
  name: 'arbitrum',
  label: 'Arbitrum One',
  currency: 'ETH',
  bundlrNodes: ['https://node1.bundlr.network', 'https://node2.bundlr.network'],
  bundlrCurrencies: [ARBITRUM_ETH],
  rpc: `https://rpc.ankr.com/arbitrum`,
  wagmi: arbitrum
}

export const AVALANCHE: SupportedChain = {
  id: 43114,
  name: 'avalanche',
  label: 'Avalanche C-SupportedChain',
  currency: 'AVAX',
  bundlrNodes: ['https://node1.bundlr.network', 'https://node2.bundlr.network'],
  bundlrCurrencies: [AVAX],
  rpc: `https://rpc.ankr.com/avalanche`,
  wagmi: avalanche
}

export const BOBA_NETWORK: SupportedChain = {
  id: 288,
  name: 'boba_network',
  label: 'Boba Network',
  currency: 'ETH',
  bundlrNodes: ['https://node1.bundlr.network', 'https://node2.bundlr.network'],
  bundlrCurrencies: [BOBA_ETH, BOBA],
  rpc: `https://mainnet.boba.network`,
  wagmi: bobaCustomChain
}

export const MAINNET: SupportedChain = {
  id: 1,
  name: 'mainnet',
  label: 'Ethereum',
  currency: 'ETH',
  bundlrNodes: ['https://node1.bundlr.network', 'https://node2.bundlr.network'],
  bundlrCurrencies: [ETHEREUM],
  rpc: `https://rpc.flashbots.net`,
  wagmi: mainnet
}

export const FANTOM: SupportedChain = {
  id: 250,
  name: 'fantom',
  label: 'Fantom Opera',
  currency: 'FTM',
  bundlrNodes: ['https://node1.bundlr.network', 'https://node2.bundlr.network'],
  bundlrCurrencies: [FTM],
  rpc: `https://rpc.ankr.com/fantom`,
  wagmi: fantom
}

export const OPTIMISM: SupportedChain = {
  id: 10,
  name: 'optimism',
  label: 'Optimism',
  currency: 'ETH',
  bundlrNodes: ['https://node1.bundlr.network', 'https://node2.bundlr.network'],
  bundlrCurrencies: [ETHEREUM],
  rpc: `https://rpc.ankr.com/optimism`,
  wagmi: optimism
}

export const POLYGON: SupportedChain = {
  id: 137,
  name: 'polygon',
  label: 'Polygon',
  currency: 'MATIC',
  bundlrNodes: ['https://node1.bundlr.network', 'https://node2.bundlr.network'],
  bundlrCurrencies: [MATIC],
  rpc: `https://rpc.ankr.com/polygon`,
  wagmi: polygon
}

export const POLYGON_MUMBAI: SupportedChain = {
  id: 80001,
  name: 'polygonMumbai',
  label: 'Polygon Mumbai',
  currency: 'MATIC',
  bundlrNodes: ['https://devnet.bundlr.network'],
  bundlrCurrencies: [MATIC],
  rpc: `https://rpc.ankr.com/polygon_mumbai`,
  wagmi: polygonMumbai
}

export const SUPPORTED_CHAINS: SupportedChain[] = [
  ARBITRUM,
  AVALANCHE,
  MAINNET,
  POLYGON,
  POLYGON_MUMBAI,
  FANTOM
]
export const SUPPORTED_CHAIN_IDS: number[] = SUPPORTED_CHAINS.map(
  chain => chain.id
)
