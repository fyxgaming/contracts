// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import {ERC1155TransferOwnershipBaseInternal} from "./ERC1155TransferOwnershipBaseInternal.sol";

contract ERC1155TransferOwnershipFacet is
    ERC1155TransferOwnershipBaseInternal
{
    function transferOwnership(
        address account
    ) public onlyOwner {
        _devTransferOwnership(account);
    }
}
