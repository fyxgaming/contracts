import { Network } from '../scripts/mintItems';
import { getSigner } from './getMintSigner';
import { getSignatureNonceForUser } from './getSignatureNonceForUser';
import {
  nowSecondsWithBuffer,
  signMintBatchWithTokenUris,
} from './mintSignatures';

export type OptimisticSignatureParams = {
  gameItems: any[];
  amounts: number[];
  network: Network;
  destinationAddress: string;
  contractAddress: string;
  chainId:number;
  tokenUris: string[];
};

// this creates a signature that can be used to mint the items
// even before the metadata is uploaded to IPFS or S3
export const createOptimisticSignature = async ({
  gameItems,
  amounts,
  network,
  destinationAddress,
  contractAddress,
  chainId,
  tokenUris
}: OptimisticSignatureParams) => {
  const signer = getSigner(network);
  // @ts-ignore

  const nonce = await getSignatureNonceForUser(destinationAddress, signer, contractAddress);
  const expiry = nowSecondsWithBuffer();

  const signature = await signMintBatchWithTokenUris(
    { signer, chainId, verifyingContract:contractAddress },
    {
      to: destinationAddress,
      tokenUris,
      amounts,
      nonce,
      expiry,
    }
  );

  return { signature, tokenUris, expiry };
};
