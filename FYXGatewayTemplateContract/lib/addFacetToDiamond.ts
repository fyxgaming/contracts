import { Contract, ethers } from 'ethers';
import { UniversalDiamond, IDiamondWritableInternal } from '../typechain-types';
import { FacetCutAction } from './constants';
import { getSelectors } from './getSelectorsFromContract';

export const addFacetToDiamond = async function (
  diamondInstance: UniversalDiamond,
  facetImplementation: Contract,
  facetContractName: string,
  excluded?: string[]
) {
  const add: IDiamondWritableInternal.FacetCutStruct[] = [
    {
      target: facetImplementation.address,
      action: FacetCutAction.Add,
      selectors: getSelectors(
        facetImplementation,
        excluded ? excluded : ['supportsInterface(bytes4)']
      ),
    },
  ];

  const tx = await diamondInstance.diamondCut(
    add,
    ethers.constants.AddressZero,
    '0x'
  );

  return tx;
};
