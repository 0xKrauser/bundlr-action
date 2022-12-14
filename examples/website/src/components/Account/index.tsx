import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useDisconnect, useNetwork } from "wagmi";
import { ArrowSwapVertical, ArrowDown2 } from "iconic-react";
import { WebBundlr } from "@bundlr-network/client";
import { useContext, useMemo } from "react";
import { BundlrContext } from "../BundlrProvider";
import { SUPPORTED_CHAINS } from "../../constants/chains";

export default function Account({
  onBundlrOpen,
}: {
  onBundlrOpen: () => void;
}) {
  const { bundlr, balance: bundlrBalance, ready, onBundlrConnect } = useContext(BundlrContext);
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address: address });

  const { chain } = useNetwork();
  const chainInfo = useMemo(() => { return SUPPORTED_CHAINS.find(supChain => supChain.id === chain?.id) }, [chain])

  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;
          return (
            <div
              className="flex flex-col gap-3 md:gap-2 mt-auto pt-10"
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {connected && !chain?.unsupported && (
                <>
                  <div className="flex flex-col md:flex-row gap-2">
                    <span>Wallet balance:{" "}</span>
                    <span className="md:ml-auto pr-2 mr-[14px]">
                      {Number(balance?.formatted).toFixed(5)} {balance?.symbol}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-col md:flex-row">
                    <span>Bundlr balance:{" "}</span>
                    {bundlr && ready ? (
                      <button
                        onClick={() => onBundlrOpen()}
                        className="md:ml-auto flex items-center gap-2 cursor-pointer"
                      >
                        <div>
                          {bundlrBalance.formatted.toFixed(5)} {bundlrBalance.symbol}
                        </div>
                        <ArrowSwapVertical size={14} className="mt-[0.5px]" />
                      </button>
                    ) : (
                      <button
                        className="font-bold ml-auto pr-2 mr-[14px]"
                        onClick={onBundlrConnect}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                  {bundlr && ready &&
                    <div className="flex flex-col md:flex-row gap-2">
                      <span>Bundlr node:{" "}</span>
                      <span className="md:ml-auto flex items-center gap-1 cursor-pointer">{bundlr?.api.config.host}
                        <ArrowDown2 size={14} className="mt-[0.5px]" />
                      </span>
                    </div>
                  }
                </>
              )}
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="w-full font-bold border-2 border-black p-2"
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="w-full font-bold border-2 border-black p-2"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex flex-col gap-4">
                    <div className="flex-row-reverse md:flex-row" style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
                      {account.displayName}
                      <div className="cursor-pointer gap-2" style={{ display: "flex", alignItems: "center" }}
                        onClick={openChainModal}
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: "hidden",
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                        <ArrowDown2 size={14} className="mt-[0.5px]" />
                      </div>
                    </div>
                    <button
                      className="w-full font-bold border-2 border-black p-2"
                      onClick={() => disconnect()}
                    >
                      Disconnect
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
