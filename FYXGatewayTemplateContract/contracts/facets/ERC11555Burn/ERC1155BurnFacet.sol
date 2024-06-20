// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import {ERC1155BurnBaseInternal} from "./ERC1155BurnBaseInternal.sol";
import {OwnableInternal} from "@solidstate/contracts/access/ownable/OwnableInternal.sol";

contract ERC1155BurnFacet is
    ERC1155BurnBaseInternal,
    OwnableInternal
{
    function devBurnBatchWithBurner(
        address from,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external {
        _devBurnBatchWithBurner(from, ids, amounts);
    }

    function setBurnerRole(address signer) external onlyOwner {
        _setBurnerRole(signer);
    }

    function revokeBurnerRole(address signer) external onlyOwner {
        _revokeBurnerRole(signer);
    }

    function checkHasBurnerRole(address signer) external view onlyOwner returns (bool) {
        return _checkHasBurnerRole(signer);
    }

}
