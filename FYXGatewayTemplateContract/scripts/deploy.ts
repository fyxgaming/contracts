import { ethers, run } from 'hardhat';
import { addFacetToDiamond } from '../lib/addFacetToDiamond';
import {
  OmniscapeDiamond__factory,
  ERC1155Facet__factory,
  ERC1155TokenUriSignatureMintFacet__factory,
  ERC1155BurnFacet__factory,
  // ERC1155TransferOwnershipFacet__factory,
  OwnerERC165Facet__factory,
} from '../typechain-types';

const delay = (timeMs = 100) =>
  new Promise((resolve) => setTimeout(resolve, timeMs));

async function main() {
  const accounts = await ethers.getSigners();
  const [tempOwner] = accounts;
  console.log('All accounts: ', accounts);
  console.log('THE OWNER IS: ', tempOwner.address);

  const omniscapeDiamond = await new OmniscapeDiamond__factory(tempOwner).deploy();
  await omniscapeDiamond.deployed();

  console.log('Step 0');

  const erc1155Facet = await new ERC1155Facet__factory(tempOwner).deploy();
  await erc1155Facet.deployed();

  console.log('Step 1');


  const erc1155TokenUriSignatureMintFacet =
    await new ERC1155TokenUriSignatureMintFacet__factory(tempOwner).deploy();
  await erc1155TokenUriSignatureMintFacet.deployed();

  console.log('Step 2');

  // BURN
  const erc1155BurnFacet =
    await new ERC1155BurnFacet__factory(tempOwner).deploy();
  await erc1155BurnFacet.deployed();

  console.log('Step 3');

  // TransferOwnership
  // const erc1155TransferOwnershipFacet =
  //   await new ERC1155TransferOwnershipFacet__factory(tempOwner).deploy();
  // await erc1155TransferOwnershipFacet.deployed();

  console.log('Step 4');

  const erc165Owner = await new OwnerERC165Facet__factory(tempOwner).deploy();
  await erc165Owner.deployed();

  console.log('Step 5');

  // add facets to the diamond
  let tx = await addFacetToDiamond(omniscapeDiamond, erc1155Facet, 'ERC1155Facet');
  await tx.wait();
  console.log('Step 6');

  tx = await addFacetToDiamond(
    omniscapeDiamond,
    erc1155TokenUriSignatureMintFacet,
    'ERC1155TokenUriSignatureMintFacet'
  );

  console.log('Step 7');
  await tx.wait();
  // BURN
  tx = await addFacetToDiamond(
    omniscapeDiamond,
    erc1155BurnFacet,
    'ERC1155BurnFacet'
  );
  await tx.wait();

  console.log('Step 8');
  tx = await addFacetToDiamond(omniscapeDiamond, erc165Owner, 'OwnerERC165Facet');
  await tx.wait();

  console.log('Step 9');

  const erc165Instance = await OwnerERC165Facet__factory.connect(
    omniscapeDiamond.address,
    tempOwner
  );

  console.log('Step 10');

  await erc165Instance.setSupportsInterface('0xd9b67a26', true, {
    gasLimit: 1000000,
  });

  console.log('Step 11');

  // verify all contracts on etherscan
  const toVerify = [
    omniscapeDiamond.address,
    erc1155Facet.address,
    erc165Owner.address,
    erc1155TokenUriSignatureMintFacet.address,
  ];

  // etherscan takes some time to index contracts, so we wait two minutes
  console.log(
    'All contracts deployed, delaying two minutes before verifying... Addresses:',
    toVerify
  );

  await delay(120000);

  for (let contractAddress of toVerify) {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: [],
    });
  }

  // Set the burner role to owner
  const erc1155BurnFacetFactory =
    await ERC1155BurnFacet__factory.connect(
      omniscapeDiamond.address, // the address of the deployed contract
      tempOwner
    );

  const txHashBurner = await erc1155BurnFacetFactory.setBurnerRole(
    tempOwner.address // the burner address
  );

  console.log("txHashBurner", txHashBurner)

  // Set the minter role to owner
  const erc1155TokenUriSignatureMintFacetFactory =
    await ERC1155TokenUriSignatureMintFacet__factory.connect(
      omniscapeDiamond.address, // the address of the deployed contract
      tempOwner
    );

  const txHashMinter = await erc1155TokenUriSignatureMintFacetFactory.setMinterRole(
    tempOwner.address // the minter address
  );

  console.log("txHashMinter", txHashMinter)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
