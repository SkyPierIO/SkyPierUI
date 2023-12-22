import { useEffect, useState } from "react";
import { useScaffoldContract, useScaffoldContractRead } from "../scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { getNFTMetadataFromIPFS } from "~~/utils/simpleNFT";

export interface Collectible {
  id: number;
  uri: string;
  owner: string;
}

export function useNodeMetaData(connectedAddress?: string) {
  const [myAllCollectibles, setMyAllCollectibles] = useState<Collectible[]>([]);
  const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);

  const { data: yourCollectibleContract } = useScaffoldContract({
    contractName: "YourContract",
  });

  const { data: myTotalBalance } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "balanceOf",
    args: [connectedAddress],
    watch: true,
    cacheOnBlock: true,
  });
  useEffect(() => {
    const updateMyCollectibles = async (): Promise<void> => {
      if (myTotalBalance === undefined || yourCollectibleContract === undefined || connectedAddress === undefined)
        return;

      setAllCollectiblesLoading(true);
      const collectibleUpdate: Collectible[] = [];
      const totalBalance = parseInt(myTotalBalance.toString());
      for (let tokenIndex = 0; tokenIndex < totalBalance; tokenIndex++) {
        try {
          const tokenId = await yourCollectibleContract.read.tokenOfOwnerByIndex([
            connectedAddress,
            BigInt(tokenIndex.toString()),
          ]);

          const tokenURI = await yourCollectibleContract.read.tokenURI([tokenId]);

          const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");

          const nftMetadata = await getNFTMetadataFromIPFS(ipfsHash);

          collectibleUpdate.push({
            id: parseInt(tokenId.toString()),
            uri: tokenURI,
            owner: connectedAddress,
            ...nftMetadata,
          });
        } catch (e) {
          notification.error("Error fetching all collectibles");
          setAllCollectiblesLoading(false);
          console.log(e);
        }
      }
      setMyAllCollectibles(collectibleUpdate);
      setAllCollectiblesLoading(false);
    };

    updateMyCollectibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedAddress, myTotalBalance]);

  return myAllCollectibles;
}
