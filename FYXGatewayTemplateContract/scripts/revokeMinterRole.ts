import { ethers, run } from 'hardhat';
import { addFacetToDiamond } from '../lib/addFacetToDiamond';
import {
  ERC1155TokenUriSignatureMintFacet__factory,
} from '../typechain-types';

async function main() {
  const [signer] = await ethers.getSigners();
  const erc1155TokenUriSignatureMintFacet =
    await ERC1155TokenUriSignatureMintFacet__factory.connect(
      '0x0916e21FC385ad72402aC4d22eE01FEfd9b88F1a', // the address of the deployed contract
      signer
    );

  const tx = await erc1155TokenUriSignatureMintFacet.revokeMinterRole(
    '0x465Fd9d1764b2E3205dC74E4d32AF2CA6364D039' // the minter address
  );

  console.log('THE TRANSACTION: ', tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
