"use client";

// import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useAccount } from "wagmi";
// import { ReputationTokenCard } from "~~/components/rep-tokens/cards/ReputationTokenCard";
import { ReputationTokenGroupCard } from "~~/components/rep-tokens/cards/ReputationTokenGroupCard";
import { AddressCard } from "~~/components/rep-tokens/cards/token-properties/AddressCard";
// import { BalanceCard } from "~~/components/rep-tokens/cards/token-properties/BalanceCard";
// import { DescriptionCard } from "~~/components/rep-tokens/cards/token-properties/DescriptionCard";
// import { ImageCard } from "~~/components/rep-tokens/cards/token-properties/ImageCard";
// import { NameCard } from "~~/components/rep-tokens/cards/token-properties/NameCard";
// import { TokenTypeCard } from "~~/components/rep-tokens/cards/token-properties/TokenTypeCard";
import {
  //useGetRepToken,
  useRepTokens,
} from "~~/components/rep-tokens/hooks/Hooks";
import {
  useScaffoldContract, //, useScaffoldContractWrite
} from "~~/hooks/scaffold-eth";

export function RepTokensDemo() {
  const { address } = useAccount();

  const {
    tokens: userTokens,
    //refetchBalances: refetchUserBalances
  } = useRepTokens([BigInt(0), BigInt(1)], address, "nftstorage");

  const { data: reputationTokens } = useScaffoldContract({ contractName: "ReputationTokens" });
  // const { token, refetchBalance } = useGetRepToken(address, BigInt(0), "ipfs");
  // const { writeAsync: claim } = useScaffoldContractWrite({
  //   contractName: "ReputationFaucet",
  //   functionName: "claim",
  // });

  // const { data: faucet } = useScaffoldContract({ contractName: "ReputationFaucet" });
  // const { tokens: faucetTokens, refetchBalances: refetchFaucetBalances } = useRepTokens(
  //   [BigInt(0), BigInt(1), BigInt(2)],
  //   faucet?.address,
  //   "nftstorage",
  // );

  return (
    <>
      <div className="py-1 space-y-5 flex flex-col justify-center items-center bg-[length:100%_100%] py-1 px-5 sm:px-0 lg:py-auto max-w-[100vw]">
        <ReputationTokenGroupCard
          tokens={userTokens}
          preChildren={<AddressCard address={reputationTokens?.address} />}
        />
      </div>
    </>
  );
}
