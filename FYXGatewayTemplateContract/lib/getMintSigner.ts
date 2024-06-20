import { JsonRpcBatchProvider } from '@ethersproject/providers';
import { VoidSigner, Wallet } from 'ethers';

import dotenv from 'dotenv';
import { Network } from '../scripts/mintItems';
dotenv.config({ path: '../.env' });

// creates an ethers.js signer from env var pk
export const getSigner = (
  network: Network,
  pkOverride?: string
): VoidSigner => {
  const pk =
    pkOverride || process.env[`${network.toUpperCase()}_PRIVATE_KEY`] || '';
  
  if (!pk) {
    throw new Error('No private key found in .env');
  }
  const rpc = process.env[`${network.toUpperCase()}_RPC_URL`];
  const provider = new JsonRpcBatchProvider(rpc);

  return new Wallet(pk, provider) as unknown as VoidSigner;
};
