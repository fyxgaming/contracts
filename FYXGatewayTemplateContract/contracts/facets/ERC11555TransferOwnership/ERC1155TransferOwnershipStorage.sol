// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

library ERC1155TransferOwnershipStorage {
    struct Layout {
        address transferOwnershipSigner;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256("diamond.storage.ERC1155TransferOwnership");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
