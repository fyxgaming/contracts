// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import {ERC1155TokenUriSignatureMintBaseInternal} from "./ERC1155TokenUriSignatureMintBaseInternal.sol";
import {OwnableInternal} from "@solidstate/contracts/access/ownable/OwnableInternal.sol";

contract ERC1155TokenUriSignatureMintFacet is
    ERC1155TokenUriSignatureMintBaseInternal,
    OwnableInternal
{
    function mintBatchWithTokenUrisViaSignature(
        address to,
        string[] calldata tokenUris,
        uint256[] calldata amounts,
        uint256 expiry,
        bytes calldata signature
    ) external {
        _mintBatchWithTokenUriViaSignature(
            to,
            tokenUris,
            amounts,
            expiry,
            signature
        );
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
