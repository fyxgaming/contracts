// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

interface IERC1155TransferOwnershipInternal {
    error ERC1155TransferOwnership__ExpiredDeadline();
    error ERC1155TransferOwnership__InvalidSignature();
    error ERC1155TransferOwnership__InvalidSigner();
}
