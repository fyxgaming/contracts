import { ERC1155TokenUriSignatureMintFacet__factory } from '../typechain-types';
import { Signer } from 'ethers';

export const getSignatureNonceForUser = async (
  user: string,
  signer: Signer,
  contractAddress: string
) => {
  // @ts-ignore
  const sigMintInstance = ERC1155TokenUriSignatureMintFacet__factory.connect(
    contractAddress,
    signer
  );
  return (await sigMintInstance.nonceForUser(user)).toNumber();
};
