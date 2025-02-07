// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract RedeemRewardContract {
    address public owner;
    mapping(address => bool) public admins;
    mapping(string => RedeemReward) public redeemRewards;

    struct RedeemReward {
        string uniqueCode;
        address user;
        bool isSendToNFT;
        string addressNFTOrUserID;
        bool isSent;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only an admin can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[owner] = true;
    }

    // Add a new admin, only callable by the owner
    function addAdmin(address _admin) external onlyOwner {
        require(!admins[_admin], "Address is already an admin");
        admins[_admin] = true;
    }

    // Remove an admin, only callable by the owner
    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "Address is not an admin");
        admins[_admin] = false;
    }

    // Store redeem reward data, callable only by admins
    function storeRedeemReward(
        string calldata uniqueCode,
        address user,
        bool isSendToNFT,
        string calldata addressNFTOrUserID
    ) external onlyAdmin {
        require(!redeemRewards[uniqueCode].isSent, "Reward is already sent");
        redeemRewards[uniqueCode] = RedeemReward(uniqueCode, user, isSendToNFT, addressNFTOrUserID, false);
    }

    // Update redeem reward data, callable only by admins
    function updateRedeemReward(
        string calldata uniqueCode,
        address user,
        bool isSendToNFT,
        string calldata addressNFTOrUserID
    ) external onlyAdmin {
        require(!redeemRewards[uniqueCode].isSent, "Reward is already sent");
        redeemRewards[uniqueCode].user = user;
        redeemRewards[uniqueCode].isSendToNFT = isSendToNFT;
        redeemRewards[uniqueCode].addressNFTOrUserID = addressNFTOrUserID;
    }

    // Mark redeem reward as sent, callable only by admins
    function markAsSent(string calldata uniqueCode) external onlyAdmin {
        require(!redeemRewards[uniqueCode].isSent, "Reward is already sent");
        redeemRewards[uniqueCode].isSent = true;
    }

    // Retrieve redeem reward data by unique code
    function getRedeemRewardData(string calldata uniqueCode) external view returns (string memory, address, bool, string memory, bool) {
        RedeemReward memory redeemReward = redeemRewards[uniqueCode];
        return (redeemReward.uniqueCode, redeemReward.user, redeemReward.isSendToNFT, redeemReward.addressNFTOrUserID, redeemReward.isSent);
    }

}
