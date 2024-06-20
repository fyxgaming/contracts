// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import {IERC1155TransferOwnershipInternal} from "./IERC1155TransferOwnershipInternal.sol";
import {ECDSA} from "@solidstate/contracts/cryptography/ECDSA.sol";
import {OwnableInternal} from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import {ERC1155BaseInternal} from "@solidstate/contracts/token/ERC1155/base/ERC1155BaseInternal.sol";

contract ERC1155TransferOwnershipBaseInternal is
    IERC1155TransferOwnershipInternal,
    OwnableInternal,
    ERC1155BaseInternal
{
    using ECDSA for bytes32;

    function _devTransferOwnership(
        address account
    ) internal {
        _transferOwnership(account);
    }

}
