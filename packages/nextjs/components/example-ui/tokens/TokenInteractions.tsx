import { useEffect, useMemo, useState } from "react";
// import { useFetch } from "usehooks-ts";
import { useScaffoldContract, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export type TokenGroup = {
  token0: Token;
  token1: Token;
};

export type Token = {
  balance: bigint;
  image: string;
  name: string;
  description: string;
  id: number;
};

export interface Nft {
  name: string;
  description: string;
  image: string;
}

export const useUri = (tokenId?: number) => {
  return useScaffoldContractRead({
    contractName: "ReputationTokensStandalone",
    functionName: "uri",
    args: [BigInt(Number(tokenId))],
  });
};

export const useBalanceOf = (address?: string, tokenId?: number) => {
  return useScaffoldContractRead({
    contractName: "ReputationTokensStandalone",
    functionName: "balanceOf",
    args: [address, BigInt(Number(tokenId))],
  });
};

export function useUris(repTokensInstance: any, tokenIds: bigint[]) {
  const [uris, setUris] = useState<string[]>([]);

  useEffect(() => {
    async function get() {
      if (!repTokensInstance || tokenIds.length === 0) return;

      const arr = [];
      for (let i = 0; i < tokenIds.length; i++) {
        const result = await repTokensInstance.read.uri([tokenIds[i]]);
        if (result !== undefined) arr.push(result);
      }

      setUris([...arr]);
    }

    if (uris.length === 0) {
      get();
    }
  }, [repTokensInstance, tokenIds, uris.length]);

  return { uris, setUris };
}

export function useFetches(uris: string[]) {
  const [responses, setResponses] = useState<Nft[]>([]);

  useEffect(() => {
    async function getJson() {
      if (uris.length === 0) return;

      const arr = [];
      for (let i = 0; i < uris.length; i++) {
        const response = await fetch(uris[i]);
        const responseJson = await response.json();
        arr.push(responseJson);
      }

      setResponses([...arr]);
    }

    if (responses.length === 0) getJson();
  }, [uris, uris.length, responses.length]);

  return { responses };
}

export const useERC1155Information = (address?: string) => {
  const { data: repTokensInstance } = useScaffoldContract({ contractName: "ReputationTokensStandalone" });

  const { data: numOfTokens } = useScaffoldContractRead({
    contractName: "ReputationTokensStandalone",
    functionName: "getNumOfTokenTypes",
  });

  const AllArr = useMemo(() => {
    const addressArr: string[] = [];
    const tokenIdsArr: bigint[] = [];

    const iterator = numOfTokens ?? 0;
    for (let i = 0; i < iterator; i++) {
      if (address) {
        addressArr.push(address);
        tokenIdsArr.push(BigInt(i));
      }
    }

    return { addressArr, tokenIdsArr };
  }, [numOfTokens, address]);

  const { data: balanceOfBatch } = useScaffoldContractRead({
    contractName: "ReputationTokensStandalone",
    functionName: "balanceOfBatch",
    args: [AllArr.addressArr, AllArr.tokenIdsArr],
  });

  const { uris } = useUris(repTokensInstance, AllArr.tokenIdsArr);

  for (let i = 0; i < uris.length; i++) {
    uris[i] = uris[i].replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  const { responses } = useFetches(uris);

  const tokens: Token[] = [];
  for (let i = 0; i < responses.length; i++) {
    let balance = BigInt(0);
    if (balanceOfBatch) {
      balance = balanceOfBatch[i];
    }
    const token = {
      id: i,
      balance: balance,
      name: responses[i]?.name,
      description: responses[i]?.description,
      image: responses[i]?.image,
    };
    tokens.push(token);
  }

  return { tokens };
};
