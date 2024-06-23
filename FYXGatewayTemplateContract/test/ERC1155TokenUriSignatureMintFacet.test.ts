import { expect } from 'chai';
import {
  UniversalDiamond__factory,
  UniversalDiamond,
  ERC1155Facet,
  ERC1155Facet__factory,
  ERC1155TokenUriSignatureMintFacet,
  ERC1155TokenUriSignatureMintFacet__factory,
} from '../typechain-types';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { addFacetToDiamond } from '../lib/addFacetToDiamond';
import {
  nowSecondsWithBuffer,
  signMintBatchWithTokenUris,
} from '../lib/mintSignatures';
import { VoidSigner } from 'ethers';

describe('ERC1155Facet', function () {
  let diamond: UniversalDiamond;
  let erc1155Instance: ERC1155Facet;
  let sigMintInstance: ERC1155TokenUriSignatureMintFacet;
  let owner: SignerWithAddress;
  let signer: SignerWithAddress;
  let minter: SignerWithAddress;
  let erc1155: ERC1155Facet;
  let erc1155Sigmint: ERC1155TokenUriSignatureMintFacet;

  before(async function () {
    [owner, signer, minter] = await ethers.getSigners();
    erc1155 = await new ERC1155Facet__factory(owner).deploy();
    erc1155Sigmint = await new ERC1155TokenUriSignatureMintFacet__factory(
      owner
    ).deploy();
  });

  beforeEach(async function () {
    diamond = await new UniversalDiamond__factory(owner).deploy();

    await addFacetToDiamond(diamond, erc1155, 'ERC1155Facet');
    await addFacetToDiamond(
      diamond,
      erc1155Sigmint,
      'ERC1155TokenUriSignatureMintFacet'
    );

    erc1155Instance = await ERC1155Facet__factory.connect(
      diamond.address,
      owner
    );

    sigMintInstance = await ERC1155TokenUriSignatureMintFacet__factory.connect(
      diamond.address,
      owner
    );

    console.log("diamond.address",diamond.address,owner.address)
  });

  context('when the signer is set', async () => {
    beforeEach(async () => {
      await sigMintInstance.setMinterRole(owner.address);
    });

    it('should allow the owner to set the mint signer', async () => {
      // await sigMintInstance.setMinterRole(owner.address);
  
      expect(await sigMintInstance.checkHasMinterRole(owner.address)).to.equal(true);
    });

    it('should allow batch minting with token uri with a proper signature', async () => {
      const to = minter.address;
      const tokenUris = ['https://image1', 'https://image2'];
      const amounts = [3, 4];
      const expiry = nowSecondsWithBuffer();

      const mintParams = {
        to,
        tokenUris,
        amounts,
        nonce: 0,
        expiry,
      };

      const signature = await signMintBatchWithTokenUris(
        {
          signer: owner as unknown as VoidSigner,
          chainId: 31337, // hardhat chain id
          verifyingContract: diamond.address,
        },
        mintParams
      );

      await sigMintInstance.mintBatchWithTokenUrisViaSignature(
        to,
        tokenUris,
        amounts,
        expiry,
        signature
      );

      const ids = [1, 2];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const amount = amounts[i];
        expect(await erc1155Instance.balanceOf(minter.address, id)).to.equal(
          amount
        );

        // ensure the URIs are set correctly
        expect(await erc1155Instance.uri(id)).to.equal(tokenUris[i]);
      }
    });

    it('should not create new items if they already exist', async () => {
      const to = minter.address;
      const tokenUris = ['https://image1', 'https://image2'];
      const amounts = [3, 4];
      const expiry = nowSecondsWithBuffer();

      const mintParams = {
        to,
        tokenUris,
        amounts,
        nonce: 0,
        expiry,
      };

      const signerParams = {
        signer: owner as unknown as VoidSigner,
        chainId: 31337, // hardhat chain id
        verifyingContract: diamond.address,
      };

      const signature = await signMintBatchWithTokenUris(
        signerParams,
        mintParams
      );

      const sig2 = await signMintBatchWithTokenUris(signerParams, {
        ...mintParams,
        nonce: 1,
      });

      await sigMintInstance.mintBatchWithTokenUrisViaSignature(
        to,
        tokenUris,
        amounts,
        expiry,
        signature
      );

      await sigMintInstance.mintBatchWithTokenUrisViaSignature(
        to,
        tokenUris,
        amounts,
        expiry,
        sig2
      );

      const ids = [1, 2];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const amount = amounts[i] * 2;
        expect(await erc1155Instance.balanceOf(minter.address, id)).to.equal(
          amount
        );
      }
    });
  });
});
