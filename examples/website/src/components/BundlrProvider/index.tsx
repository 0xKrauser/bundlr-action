import { useAccount, useBlockNumber, useNetwork, useSigner } from "wagmi";
import { WebBundlr } from "@bundlr-network/client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { BundlrCurrency, SUPPORTED_CHAINS } from "../../constants/chains";

export const BundlrContext = createContext<{
  bundlr: WebBundlr | undefined;
  address: string;
  ready: boolean;
  balance: {
    value: number;
    formatted: number;
    symbol: string;
    isLoading: boolean;
  };
  onBundlrConnect: () => void;
  onSwitchNode: (node: string) => void
}>({
  bundlr: undefined,
  address: "",
  ready: false,
  balance: { value: 0, formatted: 0, symbol: "", isLoading: true },
  onBundlrConnect: () => null,
  onSwitchNode: () => null,
});

export default function BundlrProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [bundlr, setBundlr] = useState<WebBundlr | undefined>();
  const [bundlrAddress, setBundlrAddress] = useState("");
  const [ready, setReady] = useState(false);
  const [signing, setSigning] = useState(false);

  const [balance, setBalance] = useState({
    value: 0,
    formatted: 0,
    symbol: "",
    isLoading: true,
  });

  const [endpoint, setEndpoint] = useState('')
  const [currency, setCurrency] = useState<undefined | BundlrCurrency>()

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    setReady(false);
    const chainInfo = SUPPORTED_CHAINS.find(supChain => supChain.id === chain?.id)
    if (!chainInfo) {
      setBalance({ value: 0, formatted: 0, symbol: "", isLoading: true })
      setEndpoint("")
      setCurrency(undefined)
      return
    }
    setBalance(prev => ({ ...prev, symbol: chainInfo?.bundlrCurrencies[0].label || "TOKEN" }))
    setEndpoint(chainInfo.bundlrNodes[0])
    setCurrency(chainInfo.bundlrCurrencies[0])
  }, [signer, chain, isConnected]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchBalance = async () => {
      if (address && bundlr && ready) {
        const balance = await bundlr.getBalance(address);

        if (isSubscribed) {
          setBalance((prev) => ({
            ...prev,
            value: +balance,
            formatted: +balance / 10 ** 18,
            isLoading: false,
          }));
        }
      }
    };

    fetchBalance();

    return () => {
      isSubscribed = false;
    };
  }, [address, bundlr, ready, blockNumber]);

  const initialiseBundlr = async () => {
    const chainInfo = SUPPORTED_CHAINS.find(supChain => supChain.id === chain?.id)
    if (!chainInfo || !endpoint || !currency) return
    const providerUrl = chainInfo.rpc
    const bundlr = new WebBundlr(endpoint, currency.name, signer?.provider, {
      providerUrl,
    });
    setSigning(true);
    await bundlr
      .ready()
      .then(() => {
        setBundlr(bundlr);
        setSigning(false);
        setReady(true);
      })
      .catch(() => {
        setSigning(false);
      });
    const newBundlrAddress = await bundlr.utils.getBundlerAddress(
      bundlr.currency
    );
    setBundlrAddress(newBundlrAddress);
  };

  const handleBundlrConnect = () => {
    if (signer && chain && !chain.unsupported) {
      initialiseBundlr();
    }
  };

  const handleSwitchNode = (node: string) => {
    setEndpoint(node)
  }
  return (
    <BundlrContext.Provider
      value={{
        bundlr,
        address: bundlrAddress,
        ready,
        balance,
        onBundlrConnect: () => handleBundlrConnect(),
        onSwitchNode: (node: string) => handleSwitchNode(node),
      }}
    >
      {children}
    </BundlrContext.Provider>
  );
}
