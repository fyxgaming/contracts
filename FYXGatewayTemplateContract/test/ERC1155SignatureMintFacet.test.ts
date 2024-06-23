import { expect } from 'chai';
import {
  UniversalDiamond__factory,
  UniversalDiamond,
  ERC1155Facet,
  ERC1155Facet__factory,
  ERC1155SignatureMintFacet,
  ERC1155SignatureMintFacet__factory,
} from '../typechain-types';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { addFacetToDiamond } from '../lib/addFacetToDiamond';
import {
  nowSecondsWithBuffer,
  signMint,
  signMintBatch,
} from '../lib/mintSignatures';
import { VoidSigner } from 'ethers';

describe('ERC1155Facet', function () {
  let diamond: UniversalDiamond;
  let erc1155Instance: ERC1155Facet;
  let sigMintInstance: ERC1155SignatureMintFacet;
  let owner: SignerWithAddress;
  let signer: SignerWithAddress;
  let minter: SignerWithAddress;
  let erc1155: ERC1155Facet;
  let erc1155Sigmint: ERC1155SignatureMintFacet;

  before(async function () {
    [owner, signer, minter] = await ethers.getSigners();
    erc1155 = await new ERC1155Facet__factory(owner).deploy();
    erc1155Sigmint = await new ERC1155SignatureMintFacet__factory(
      owner
    ).deploy();
  });

  beforeEach(async function () {
    diamond = await new UniversalDiamond__factory(owner).deploy();

    await addFacetToDiamond(diamond, erc1155, 'ERC1155Facet');
    await addFacetToDiamond(
      diamond,
      erc1155Sigmint,
      'ERC1155SignatureMintFacet'
    );

    erc1155Instance = await ERC1155Facet__factory.connect(
      diamond.address,
      owner
    );

    sigMintInstance = await ERC1155SignatureMintFacet__factory.connect(
      diamond.address,
      owner
    );
  });

  it('should allow the owner to set the mint signer', async () => {
    await sigMintInstance.setMinterRole(owner.address);

    expect(await sigMintInstance.checkHasMinterRole(owner.address)).to.equal(true);
  });

  it('should disallow minting if the signer is not set');

  context('when the signer is set', async () => {
    beforeEach(async () => {
      await sigMintInstance.setMinterRole(owner.address);
    });

    it('should allow minting with a proper signature', async () => {
      const to = minter.address;
      const id = 1;
      const amount = 1;
      const expiry = nowSecondsWithBuffer();

      const mintParams = {
        to,
        id,
        amount,
        nonce: 0,
        expiry,
      };

      const signature = await signMint(
        {
          signer: owner as unknown as VoidSigner,
          chainId: 31337, // hardhat chain id
          verifyingContract: diamond.address,
        },
        mintParams
      );

      await sigMintInstance.mintViaSignature(to, id, amount, expiry, signature);

      expect(await erc1155Instance.balanceOf(minter.address, id)).to.equal(
        amount
      );
    });

    it('should allow batch minting with a proper signature', async () => {
      const to = minter.address;
      const ids = [1, 2];
      const amounts = [3, 4];
      const expiry = nowSecondsWithBuffer();

      const mintParams = {
        to,
        ids,
        amounts,
        nonce: 0,
        expiry,
      };

      const signature = await signMintBatch(
        {
          signer: owner as unknown as VoidSigner,
          chainId: 31337, // hardhat chain id
          verifyingContract: diamond.address,
        },
        mintParams
      );

      await sigMintInstance.mintBatchViaSignature(
        to,
        ids,
        amounts,
        expiry,
        signature
      );

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const amount = amounts[i];
        expect(await erc1155Instance.balanceOf(minter.address, id)).to.equal(
          amount
        );
      }
    });

    it('should disallow minting with an expired signature');

    it('should disallow batch minting with an expired signature');

    it('should disallow minting with a signature that has already been used');

    it(
      'should disallow batch minting with a signature that has already been used'
    );
  });
});
