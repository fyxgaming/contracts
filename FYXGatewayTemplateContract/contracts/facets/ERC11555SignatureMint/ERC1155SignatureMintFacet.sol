// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import {ERC1155SignatureMintBaseInternal} from "./ERC1155SignatureMintBaseInternal.sol";
import {OwnableInternal} from "@solidstate/contracts/access/ownable/OwnableInternal.sol";

contract ERC1155SignatureMintFacet is
    ERC1155SignatureMintBaseInternal,
    OwnableInternal
{
    function mintBatchViaSignature(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        uint256 expiry,
        bytes calldata signature
    ) external {
        _mintBatchViaSignature(to, ids, amounts, expiry, signature);
    }

    function mintViaSignature(
        address to,
        uint256 id,
        uint256 amount,
        uint256 expiry,
        bytes calldata signature
    ) external {
        _mintViaSignature(to, id, amount, expiry, signature);
    }

    function setMinterRole(address signer) external onlyOwner {
        _setMinterRole(signer);
    }

    function revokeMinterRole(address signer) external onlyOwner {
        _revokeMinterRole(signer);
    }

    function checkHasMinterRole(address signer) external view onlyOwner returns (bool) {
        return _checkHasMinterRole(signer);
    }

    function nonceForUser(address account) external view returns (uint256) {
        return _nonceForUser(account);
    }
}
