// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/extension/Permissions.sol";
import "@thirdweb-dev/contracts/eip/interface/IERC20.sol";
import "@thirdweb-dev/contracts/base/ERC20SignatureMintVote.sol";

contract CFSContract is ERC20SignatureMintVote, Permissions {
    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");

    bool public allowMint;
    uint256 public constant maxTotalSupply = 1000000000 * 10**18; // 1,000,000,000 tokens with 18 decimal places
    uint256 public currentSupply; // Variable to track the current supply of tokens

    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        ERC20SignatureMintVote(
            _defaultAdmin,
            _name,
            _symbol,
            _primarySaleRecipient
        )
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function startMint(bool _allowMint) public onlyRole(DEFAULT_ADMIN_ROLE) {
        allowMint = _allowMint;
    }

    function mintTo(address _to, uint256 _amount) public virtual override {
        require(allowMint == true, "Minting currently closed!");
        // Check if minting would not exceed maximum total supply
        require(currentSupply + _amount <= maxTotalSupply, "Exceeds maximum total supply");

        super.mintTo(_to, _amount);
        currentSupply += _amount; // Update the current supply after minting
    }

    function mintBulk(address[] memory _recipients, uint256[] memory _amounts) public onlyRole(MINTER_ROLE) {
        require(_recipients.length == _amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            address recipient = _recipients[i];
            uint256 amount = _amounts[i];
            
            if (recipient == address(0) || amount == 0) {
                continue; // Skip this iteration if recipient or amount is invalid
            }

            // if it exceeds the maximum total supply
            require(currentSupply + amount <= maxTotalSupply, "Exceeds maximum total supply");

            // Mint tokens and update the current supply
            super.mintTo(recipient, amount);
            currentSupply += amount;
        }
    }


    function transferBulk(address[] memory _recipients, uint256[] memory _amounts) public {
        require(_recipients.length == _amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            address recipient = _recipients[i];
            uint256 amount = _amounts[i];
            
            if (recipient == address(0) || amount == 0) {
                continue; // Skip this iteration if recipient or amount is invalid
            }

            // Transfer tokens from the sender to the recipient
            require(transfer(recipient, amount), "Transfer failed");
        }
    }


    function totalSupply() public view virtual override returns (uint256) {
        return maxTotalSupply; // Return the current supply of tokens
    }

    /**
     *  `_canMint` is a function available in `ERC20Base`.
     *
     *  It is called every time a wallet tries to mint tokens on this
     *  contract, and lets you define the condition in which an
     *  attempt to mint tokens should be permitted, or rejected.
     *
     *  By default, `ERC20Base` only lets the contract's owner mint
     *  tokens. Here, we override that functionality.
     *
     *  We use the `Permissions` extension to specify that anyone holding
     *  "MINTER_ROLE" should be able to mint tokens.
     */
    function _canMint() internal view override returns (bool) {
        return hasRole(MINTER_ROLE, msg.sender);
    }
}
