import { ethers, VoidSigner } from 'ethers';

export type MintParams = {
  to: string;
  id: number;
  amount: number;
  nonce: number;
  expiry: number;
};

export type MintBatchParams = {
  to: string;
  ids: number[];
  amounts: number[];
  nonce: number;
  expiry: number;
};

export type MintBatchURIParams = {
  to: string;
  tokenUris: string[];
  amounts: number[];
  nonce: number;
  expiry: number;
};

export type SigningParams = {
  signer: VoidSigner;
  chainId: number;
  verifyingContract: string;
};

const getDomain = (
  verifyingContract: string,
  chainId: number,
  name: string = 'ERC1155SignatureMint'
) => {
  return {
    name,
    version: '1',
    chainId,
    verifyingContract,
  };
};

const TEN_MINUTES_SECONDS = 600;
export const nowSecondsWithBuffer = (plus: number = TEN_MINUTES_SECONDS) =>
  Math.floor(Date.now() / 1000) + plus;

// signs mint data according to eip-712 typed data standard
export const signMint = async (
  { signer, chainId, verifyingContract }: SigningParams,
  mintParams: MintParams
) => {
  const mintTypes = {
    Mint: [
      { name: 'to', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
    ],
  };

  const domain = getDomain(verifyingContract, chainId);

  const signature = await signer._signTypedData(domain, mintTypes, mintParams);

  return signature;
};

// signs mint batch data according to eip-712 typed data standard
export const signMintBatch = async (
  { signer, chainId, verifyingContract }: SigningParams,
  mintParams: MintBatchParams
) => {
  const mintBatchTypes = {
    MintBatch: [
      { name: 'to', type: 'address' },
      { name: 'ids', type: 'uint256[]' },
      { name: 'amounts', type: 'uint256[]' },
      { name: 'nonce', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
    ],
  };

  const domain = getDomain(verifyingContract, chainId);

  const signature = await signer._signTypedData(
    domain,
    mintBatchTypes,
    mintParams
  );

  return signature;
};

// signs mint batch data according to eip-712 typed data standard
export const signMintBatchWithTokenUris = async (
  { signer, chainId, verifyingContract }: SigningParams,
  mintParams: MintBatchURIParams
) => {
  const mintBatchUriTypes = {
    MintBatchURI: [
      { name: 'to', type: 'address' },
      { name: 'tokenUris', type: 'string[]' },
      { name: 'amounts', type: 'uint256[]' },
      { name: 'nonce', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
    ],
  };

  const domain = getDomain(
    verifyingContract,
    chainId,
    'ERC1155TokenUriSignatureMint'
  );

  const signature = await signer._signTypedData(
    domain,
    mintBatchUriTypes,
    mintParams
  );

  return signature;
};
