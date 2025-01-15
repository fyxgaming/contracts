// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MatchMakingData {
    address public owner;
    mapping(address => bool) public admins;

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event MatchMakingDataStored(address indexed admin, string inviteCode, string encryptedOwnerData);
    event WinnerStored(
        address indexed admin,
        string inviteCode,
        string winnerData,
        string encryptedPlayersData,
        string encryptedOwnerData
    );

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
        emit AdminAdded(owner);
    }

    // Add a new admin, only callable by the owner
    function addAdmin(address _admin) external onlyOwner {
        require(!admins[_admin], "Address is already an admin");
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    // Remove an admin, only callable by the owner
    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "Address is not an admin");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    // Store invite code and encrypted owner data, callable only by admins
    function storeData(
        string calldata inviteCode,
        string calldata encryptedOwnerData
    ) external onlyAdmin {
        emit MatchMakingDataStored(msg.sender, inviteCode, encryptedOwnerData);
    }

    // Declare a winner and store encrypted players data, callable only by admins
    function declareWinner(
        string calldata inviteCode,
        string calldata winnerData,
        string calldata encryptedPlayersData,
        string calldata encryptedOwnerData
    ) external onlyAdmin {
        emit WinnerStored(msg.sender, inviteCode, winnerData, encryptedPlayersData, encryptedOwnerData);
    }
}
