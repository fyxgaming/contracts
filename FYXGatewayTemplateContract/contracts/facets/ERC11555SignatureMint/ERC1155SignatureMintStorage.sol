// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

library ERC1155SignatureMintStorage {
    struct Layout {
        mapping(bytes32 => mapping(address => bool)) hasRole;
        
        mapping(address => uint256) nonces;
        // Mapping of ChainID to domain separators. This is a very gas efficient way
        // to not recalculate the domain separator on every call, while still
        // automatically detecting ChainID changes.
        mapping(uint256 => bytes32) domainSeparators;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256("diamond.storage.ERC1155SignatureMint");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
