import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/Dialog";
import { getMnemonicFromHexSeed } from "@/functions/getMnemonicFromHexSeed";
import withSuspense from "@/functions/withSuspense";
import { Web3BaseWalletAccount } from "@theqrl/web3";
import { ArrowRight, HardDriveDownload, Undo } from "lucide-react";
import { lazy } from "react";

const MnemonicWordListing = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWallet/Body/CreateAccount/MnemonicDisplay/MnemonicWordListing/MnemonicWordListing"
      ),
  ),
);

type MnemonicDisplayProps = {
  account?: Web3BaseWalletAccount;
  onMnemonicNoted: () => void;
};

const MnemonicDisplay = ({
  account,
  onMnemonicNoted,
}: MnemonicDisplayProps) => {
  const accountAddress = account?.address;
  const accountHexSeed = account?.seed;
  const mnemonic = getMnemonicFromHexSeed(accountHexSeed);

  const onDownload = () => {
    const mnemonicObject = {
      "Account public address (can be shared with others)":
        account?.address ?? "",
      "Secret Mnemonic phrases (can be used for recovering your account, and should be kept safe)":
        mnemonic,
    };
    const blobData = JSON.stringify(mnemonicObject, null, 2);
    const blob = new Blob([blobData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = "Secret Mnemonic Phrases.json";
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    URL.revokeObjectURL(url);
  };

  const cardDescription = `Don't lose this mnemonic phrases. Download it right now. You may need this someday to import or recover your new account ${accountAddress?.substring(0, 5)}...${accountAddress?.substring(accountAddress?.length - 5)}`;
  const continueWarning =
    "You should only continue if you have downloaded the mnemonic phrases. If you haven't, go back, download, and then continue. There is no going back once you click the continue button.";

  return (
    <Card className="text-ellipsis">
      <CardHeader>
        <CardTitle>Keep this safe</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <MnemonicWordListing mnemonic={mnemonic} />
      </CardContent>
      <CardFooter className="gap-4">
        <Button
          className="w-full"
          type="button"
          variant="constructive"
          onClick={onDownload}
        >
          <HardDriveDownload className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" type="button">
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue
            </Button>
          </DialogTrigger>
          <DialogContent className="w-80 rounded-md">
            <DialogHeader className="text-left">
              <DialogTitle>Important!</DialogTitle>
              <DialogDescription>{continueWarning}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-4">
              <DialogClose asChild>
                <Button className="w-full" type="button" variant="outline">
                  <Undo className="mr-2 h-4 w-4" />
                  Go back
                </Button>
              </DialogClose>
              <Button
                className="w-full"
                type="button"
                onClick={onMnemonicNoted}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default MnemonicDisplay;
