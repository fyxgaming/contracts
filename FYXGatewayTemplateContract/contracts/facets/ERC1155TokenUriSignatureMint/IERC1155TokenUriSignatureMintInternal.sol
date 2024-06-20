// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

interface IERC1155TokenUriSignatureMintInternal {
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    error PermissionsAlreadyGranted(address account, bytes32 role);
    error PermissionsUnauthorizedAccount(address account, bytes32 neededRole);
    error ERC1155TokenUriSignatureMint__ExpiredDeadline();
    error ERC1155TokenUriSignatureMint__InvalidSignature();
    error ERC1155TokenUriSignatureMint__InvalidSigner();
}
