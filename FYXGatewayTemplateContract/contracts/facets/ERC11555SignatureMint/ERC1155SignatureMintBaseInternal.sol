// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import {IERC1155SignatureMintInternal} from "./IERC1155SignatureMintInternal.sol";
import {ERC1155SignatureMintStorage} from "./ERC1155SignatureMintStorage.sol";
import {ECDSA} from "@solidstate/contracts/cryptography/ECDSA.sol";
import {ERC1155BaseInternal} from "@solidstate/contracts/token/ERC1155/base/ERC1155BaseInternal.sol";

contract ERC1155SignatureMintBaseInternal is
    IERC1155SignatureMintInternal,
    ERC1155BaseInternal
{
    using ECDSA for bytes32;

    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");

    bytes32 internal constant _DOMAIN_SEPARATOR_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    bytes32 internal constant _MINT_TYPEHASH =
        keccak256(
            "Mint(address to,uint256 id,uint256 amount,uint256 nonce,uint256 expiry)"
        );

    bytes32 internal constant _MINT_BATCH_TYPEHASH =
        keccak256(
            "MintBatch(address to,uint256[] ids,uint256[] amounts,uint256 nonce,uint256 expiry)"
        );

    function _mintViaSignature(
        address to,
        uint256 id,
        uint256 amount,
        uint256 expiry,
        bytes calldata signature
    ) internal {
        _verifyMintSignature(to, id, amount, expiry, signature);
        _mint(to, id, amount, "");
    }

    function _mintBatchViaSignature(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        uint256 expiry,
        bytes calldata signature
    ) internal {
        _verifyMintBatchSignature(to, ids, amounts, expiry, signature);
        _mintBatch(to, ids, amounts, "");
    }

    function _verifyMinter() internal {
        if (!_checkHasRole(MINTER_ROLE, msg.sender)){
            revert ERC1155SignatureMint__InvalidSigner();
        }
    }

    function _setMinterRole(address signer) internal {
        if (ERC1155SignatureMintStorage.layout().hasRole[MINTER_ROLE][signer]) {
            revert PermissionsAlreadyGranted(signer, MINTER_ROLE);
        }
        _setupRole(MINTER_ROLE, signer);
    }

    function _setupRole(bytes32 role, address account) internal virtual {
        ERC1155SignatureMintStorage.layout().hasRole[role][account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    function _checkHasMinterRole(address account) internal view returns (bool) {
        return _checkHasRole(MINTER_ROLE, account);
    }

    function _checkHasRole(bytes32 role, address account) internal view returns (bool) {
        return ERC1155SignatureMintStorage.layout().hasRole[role][account];
    }

    function _revokeMinterRole(address account) internal {
        _revokeRole(MINTER_ROLE, account);
    }

    function _revokeRole(bytes32 role, address account) internal {
        if(!_checkHasRole(role, account)){
            revert PermissionsUnauthorizedAccount(account, role);
        }
        delete ERC1155SignatureMintStorage.layout().hasRole[role][account];
        emit RoleRevoked(role, account, msg.sender);
    }


    function _verifyMintSignature(
        address to,
        uint256 id,
        uint256 amount,
        uint256 expiry,
        bytes calldata signature
    ) internal {
        if (block.timestamp > expiry)
            revert ERC1155SignatureMint__ExpiredDeadline();

        _verifyMinter();

        uint256 nonce = _getNonceAndIncrement(to);
        bytes32 digest = _calculateDigestForMint(to, id, amount, nonce, expiry);

        if (msg.sender != digest.recover(signature))
            revert ERC1155SignatureMint__InvalidSignature();
    }

    function _verifyMintBatchSignature(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        uint256 expiry,
        bytes calldata signature
    ) internal {
        if (block.timestamp > expiry)
            revert ERC1155SignatureMint__ExpiredDeadline();

        _verifyMinter();

        uint256 nonce = _getNonceAndIncrement(to);

        bytes32 digest = _calculateDigestForMintBatch(
            to,
            ids,
            amounts,
            nonce,
            expiry
        );

        if (msg.sender != digest.recover(signature))
            revert ERC1155SignatureMint__InvalidSignature();
    }

    function _getNonceAndIncrement(address account) internal returns (uint256) {
        ERC1155SignatureMintStorage.Layout
            storage l = ERC1155SignatureMintStorage.layout();
        return l.nonces[account]++;
    }

    function _nonceForUser(address account) internal view returns (uint256) {
        return ERC1155SignatureMintStorage.layout().nonces[account];
    }

    /**
     * @notice return the EIP-712 domain separator unique to contract and chain
     * @return domainSeparator domain separator
     */
    function _DOMAIN_SEPARATOR()
        internal
        view
        returns (bytes32 domainSeparator)
    {
        domainSeparator = ERC1155SignatureMintStorage.layout().domainSeparators[
                _chainId()
            ];

        if (domainSeparator == 0x00) {
            domainSeparator = _calculateDomainSeparator();
        }
    }

    /**
     * @notice calculate unique EIP-712 domain separator
     * @return domainSeparator domain separator
     */
    function _calculateDomainSeparator()
        internal
        view
        returns (bytes32 domainSeparator)
    {
        // no need for assembly, running very rarely
        domainSeparator = keccak256(
            abi.encode(
                _DOMAIN_SEPARATOR_TYPEHASH,
                keccak256(bytes("ERC1155SignatureMint")), // Name
                keccak256(bytes("1")), // Version
                _chainId(),
                address(this)
            )
        );
    }

    /**
     * @notice get the current chain ID
     * @return chainId chain ID
     */
    function _chainId() private view returns (uint256 chainId) {
        assembly {
            chainId := chainid()
        }
    }

    function _calculateDigestForMint(
        address to,
        uint256 id,
        uint256 amount,
        uint256 nonce,
        uint256 expiry
    ) internal view returns (bytes32 digest) {
        bytes32 structHash = keccak256(
            abi.encode(_MINT_TYPEHASH, to, id, amount, nonce, expiry)
        );

        digest = keccak256(
            abi.encodePacked("\x19\x01", _DOMAIN_SEPARATOR(), structHash)
        );
    }

    function _calculateDigestForMintBatch(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        uint256 nonce,
        uint256 expiry
    ) internal view returns (bytes32 digest) {
        // array values are encoded as the hash of their contents
        bytes32 idsHash = keccak256(abi.encodePacked(ids));
        bytes32 amountsHash = keccak256(abi.encodePacked(amounts));

        bytes32 structHash = keccak256(
            abi.encode(
                _MINT_BATCH_TYPEHASH,
                to,
                idsHash,
                amountsHash,
                nonce,
                expiry
            )
        );

        digest = keccak256(
            abi.encodePacked("\x19\x01", _DOMAIN_SEPARATOR(), structHash)
        );
    }
}
