import { describeBehaviorOfERC1155Base } from '@solidstate/spec';
import { expect } from 'chai';
import {
  OmniscapeDiamond__factory,
  OmniscapeDiamond,
  IERC1155Base,
  ERC1155Facet,
  ERC1155Facet__factory,
  OwnerERC165Facet__factory,
  OwnerERC165Facet,
} from '../typechain-types';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { addFacetToDiamond } from '../lib/addFacetToDiamond';

describe('ERC1155Facet', function () {
  let diamond: OmniscapeDiamond;
  let instance: ERC1155Facet;
  let owner: SignerWithAddress;
  let facetImplementation: ERC1155Facet;
  let erc165Owner: OwnerERC165Facet;

  before(async function () {
    [owner] = await ethers.getSigners();
    facetImplementation = await new ERC1155Facet__factory(owner).deploy();
    erc165Owner = await new OwnerERC165Facet__factory(owner).deploy();
  });

  beforeEach(async function () {
    diamond = await new OmniscapeDiamond__factory(owner).deploy();

    await addFacetToDiamond(diamond, facetImplementation, 'ERC1155Facet');
    await addFacetToDiamond(diamond, erc165Owner, 'OwnerERC165Facet');

    const erc165Instance = await OwnerERC165Facet__factory.connect(
      diamond.address,
      owner
    );

    await erc165Instance.setSupportsInterface('0xd9b67a26', true);

    instance = await ERC1155Facet__factory.connect(diamond.address, owner);
  });

  describeBehaviorOfERC1155Base(
    async () => instance as unknown as IERC1155Base,
    {
      mint: async (address, id, amount) => {
        return await instance.devMint(address, id, amount);
      },
      burn: async (address, id, amount) => {
        return await instance.devBurn(address, id, amount);
      },
    }
  );
});
