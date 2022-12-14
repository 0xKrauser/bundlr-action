import "@rainbow-me/rainbowkit/styles.css";
import "./App.css"

// Imports
import { createClient, WagmiConfig, configureChains } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import merge from "lodash.merge";

import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
  Theme,
} from "@rainbow-me/rainbowkit";

import BundlrProvider from "./components/BundlrProvider";
import { SUPPORTED_CHAINS } from "./constants/chains";
import Home from './pages/Home';

const bundlrChains = SUPPORTED_CHAINS.map((supportedChain) => supportedChain.wagmi)

const { chains, provider } = configureChains(
  bundlrChains,
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: SUPPORTED_CHAINS.find(supChain => supChain.id === chain.id)?.rpc || '' })
    }),
    publicProvider(),
  ]
);

const readTheme = merge(lightTheme(), {
  fonts: {
    body: '"Space Mono", monospace, system',
  },
  radii: {
    actionButton: "0",
    connectButton: "0",
    menuButton: "0",
    modal: "0",
    modalMobile: "0",
  },
  shadows: {
    connectButton: "0",
    dialog: "0",
    profileDetailsAction: "0",
    selectedOption: "0",
    selectedWallet: "0",
    walletLogo: "0",
  },
} as Theme);

const { connectors } = getDefaultWallets({
  appName: "bundlr-action",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={readTheme}>
        <BundlrProvider>
          <Home />
        </BundlrProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
