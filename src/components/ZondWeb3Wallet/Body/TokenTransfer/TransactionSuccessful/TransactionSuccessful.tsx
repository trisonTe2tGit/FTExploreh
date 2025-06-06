import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { getOptimalGasFee } from "@/functions/getOptimalGasFee";
import { ROUTES } from "@/router/router";
import StringUtil from "@/utilities/stringUtil";
import { TransactionReceipt, utils } from "@theqrl/web3";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

type TransactionSuccessfulProps = {
  transactionReceipt: TransactionReceipt;
};

export const TransactionSuccessful = ({
  transactionReceipt,
}: TransactionSuccessfulProps) => {
  const {
    blockHash,
    blockNumber,
    transactionHash,
    gasUsed,
    effectiveGasPrice,
  } = transactionReceipt;

  const { prefix: prefixTxHash, addressSplit: addressSplitTxHash } =
    StringUtil.getSplitAddress(transactionHash.toString());
  const { prefix: prefixBlockHash, addressSplit: addressSplitBlockHash } =
    StringUtil.getSplitAddress(blockHash.toString());

  return (
    <div className="w-full">
      <img
        className="fixed z-0 h-96 w-96 -translate-x-8 animate-rotate-scale overflow-hidden opacity-30"
        src="tree.svg"
      />
      <div className="relative z-10 p-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Transaction completed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col gap-2">
              <div>Transaction Hash</div>
              <div className="font-bold text-secondary">
                {`${prefixTxHash} ${addressSplitTxHash.join(" ")}`}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>Block hash</div>
              <div className="font-bold text-secondary">
                {`${prefixBlockHash} ${addressSplitBlockHash.join(" ")}`}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div>Block number</div>
                <div className="font-bold text-secondary">
                  {blockNumber.toString()}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Gas used</div>
                <div className="font-bold text-secondary">
                  {getOptimalGasFee(
                    utils.fromWei(
                      Number(gasUsed) * Number(effectiveGasPrice ?? 0),
                      "ether",
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4">
            <span />
            <Link className="w-full" to={ROUTES.HOME}>
              <Button className="w-full" type="button">
                <Check className="mr-2 h-4 w-4" />
                Done
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
