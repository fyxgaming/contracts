// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import {IERC1155BurnInternal} from "./IERC1155BurnInternal.sol";
import {ERC1155BurnStorage} from "./ERC1155BurnStorage.sol";
import {ECDSA} from "@solidstate/contracts/cryptography/ECDSA.sol";
import {ERC1155BaseInternal} from "@solidstate/contracts/token/ERC1155/base/ERC1155BaseInternal.sol";

contract ERC1155BurnBaseInternal is
    IERC1155BurnInternal,
    ERC1155BaseInternal
{
    bytes32 private constant BURNER_ROLE = keccak256("BURNER_ROLE");

    using ECDSA for bytes32;

    function _devBurnBatchWithBurner(
        address from,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) internal {
        _verifyBurner();
        _burnBatch(from, ids, amounts);
    }

    function _verifyBurner() internal {
        if (!_checkHasRole(BURNER_ROLE, msg.sender)){
            revert ERC1155Burn__InvalidSigner();
        }
    }

    function _setBurnerRole(address signer) internal {
        if (ERC1155BurnStorage.layout().hasRole[BURNER_ROLE][signer]) {
            revert PermissionsAlreadyGranted(signer, BURNER_ROLE);
        }
        _setupRole(BURNER_ROLE, signer);
    }

    function _setupRole(bytes32 role, address account) internal virtual {
        ERC1155BurnStorage.layout().hasRole[role][account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    function _checkHasBurnerRole(address account) internal view returns (bool) {
        return _checkHasRole(BURNER_ROLE, account);
    }

    function _checkHasRole(bytes32 role, address account) internal view returns (bool) {
        return ERC1155BurnStorage.layout().hasRole[role][account];
    }

    function _revokeBurnerRole(address account) internal {
        _revokeRole(BURNER_ROLE, account);
    }

    function _revokeRole(bytes32 role, address account) internal {
        if(!_checkHasRole(role, account)){
            revert PermissionsUnauthorizedAccount(account, role);
        }
        delete ERC1155BurnStorage.layout().hasRole[role][account];
        emit RoleRevoked(role, account, msg.sender);
    }
}
