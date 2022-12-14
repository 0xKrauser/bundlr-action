import { parseUnits } from "ethers/lib/utils";
import { MouseEventHandler, useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { BundlrContext } from "../BundlrProvider";
import { Dialog } from "../Dialog";
import Input from "../Input";

const stopPropagation: MouseEventHandler<unknown> = (event) =>
  event.stopPropagation();

type BundlrModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function BundlrModal({ open, onClose }: BundlrModalProps) {
  const [deposit, setDeposit] = useState(true);
  const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState("");
  const {
    bundlr,
    balance,
    ready,
    address: bundlrAddress,
  } = useContext(BundlrContext);
  const { address } = useAccount();
  const { data: walletBalance } = useBalance({ address: address, watch: true });

  const [isDisabled, disabledMessage] = useMemo(() => {
    if (!walletBalance) return [true, "Wallet error"];
    if (!amount || +amount === 0) return [true, "Missing input"];
    if (
      deposit &&
      (!+walletBalance.formatted || +walletBalance.formatted < +amount)
    )
      return [true, "Insufficient Wallet Balance"];
    if (!deposit && (!balance.formatted || balance.formatted < +amount))
      return [true, "Insufficient Bundlr Balance"];
    return [false, ""];
  }, [deposit, amount, balance.formatted, walletBalance]);

  useEffect(() => {
    if (!open) setDeposit(true);
  }, [open]);

  useEffect(() => {
    let isSubscribed = true;

    const input =
      amount !== "" && Number.isFinite(+amount)
        ? parseUnits(amount, 18).toString()
        : "0";

    const fetchFee = async () => {
      if (address && bundlr && ready) {
        const signer = await bundlr.funder;
        const fee = await bundlr.currencyConfig.getFee(input, bundlrAddress);
        if (isSubscribed) {
          console.log(fee);
        }
      }
    };

    return () => {
      isSubscribed = false;
    };
  }, [amount]);

  const handleTab = (input: boolean) => {
    if (input !== deposit) {
      setAmount("");
    }
    setDeposit(input);
  };
  const handleChange = (input: string) => {
    if (input === "" || (Number.isFinite(+input) && +input >= 0)) {
      setAmount(input);
    }
  };

  const handleMax = () => {
    if (walletBalance) setAmount(walletBalance.formatted);
  };

  const handleSubmit = async () => {
    if (!bundlr || !ready) return;
    const input = parseUnits(amount, 18).toString();
    if (deposit) {
      await bundlr.fund(input).then((res) => {
        console.log("fund successful");
        console.log(res);
      });
    } else {
      await bundlr
        .withdrawBalance(input)
        .then((res) => {
          console.log("withdraw successful");
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  return (
    <Dialog onClose={onClose} open={open} >
      <div className="dialog-content"
        onClick={stopPropagation}
      >
        <div className="grid grid-cols-2 border-b-[1px] border-black">
          <button
            className={`cursor-pointer w-full p-3 ${deposit ? "font-bold" : ""
              }`}
            onClick={() => handleTab(true)}
          >
            Deposit
          </button>
          <button
            className={`cursor-pointer w-full p-3 ${!deposit ? "font-bold" : ""
              }`}
            onClick={() => handleTab(false)}
          >
            Withdraw
          </button>
        </div>
        <div className="flex p-4 text-center justify-center text-lg gap-2 items-center">
          <div className="">Your Bundlr Balance:</div>{" "}
          <div>
            {balance.formatted.toFixed(5)} {balance.symbol}
          </div>
        </div>
        <div className="p-4 flex items-end flex-col">
          <div className="text-sm">
            {deposit ? walletBalance?.formatted : balance.formatted}{" "}
            <button className="font-[600]" onClick={() => handleMax()}>
              Max
            </button>
          </div>
          <div className="flex w-full justify-center border-[1px]">
            <Input
              containerClassName="w-full border-r-[1px]"
              className="p-3 w-full"
              placeholder={"0.0"}
              value={amount}
              onChange={handleChange}
            />
            <div className="h-full flex items-center p-3">{balance.symbol}</div>
          </div>
        </div>
        <div className="p-4">
          <button
            disabled={isDisabled}
            onClick={() => handleSubmit()}
            className="border-2 border-black w-full font-bold p-2 disabled:border-gray-300 disabled:text-gray-300"
          >
            {disabledMessage && amount !== "" && +amount !== 0
              ? disabledMessage
              : deposit
                ? "Deposit"
                : "Withdraw"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
