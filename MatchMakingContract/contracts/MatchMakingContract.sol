// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MatchMakingData {
    address public owner;
    mapping(address => bool) public admins;
    mapping(string => MatchMaking) public matches;
    mapping(string => bool) public inviteCodes;

    struct MatchMaking {
        string inviteCode;
        string winnerData;
        string encryptedPlayersData;
        string encryptedOwnerData;
        string encryptedRewardData;
        bool isFilled;
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

    // Store invite code and encrypted owner data, callable only by admins
    function storeData(
        string calldata inviteCode,
        string calldata encryptedOwnerData
    ) external onlyAdmin {
        require(!inviteCodes[inviteCode], "Invite code is already in use by another match");
        inviteCodes[inviteCode] = true;
        matches[inviteCode] = MatchMaking(inviteCode, "", "", encryptedOwnerData, "", false);
    }

    // Update data match by invite code, callable only by admins
    function updateData(
        string calldata inviteCode,
        string calldata winnerData,
        string calldata encryptedPlayersData,
        string calldata encryptedRewardData
    ) external onlyAdmin {
        require(inviteCodes[inviteCode], "Match is not found by code");
        require(!matches[inviteCode].isFilled, "Match is already filled");
        matches[inviteCode].winnerData = winnerData;
        matches[inviteCode].encryptedPlayersData = encryptedPlayersData;
        matches[inviteCode].encryptedRewardData = encryptedRewardData;
        matches[inviteCode].isFilled = false;
    }

    // Declare a winner and store encrypted players data, callable only by admins
    function declareWinner(
        string calldata inviteCode,
        string calldata winnerData,
        string calldata encryptedPlayersData,
        string calldata encryptedRewardData
    ) external onlyAdmin {
        require(inviteCodes[inviteCode], "Match is not found by code");
        require(!matches[inviteCode].isFilled, "Match is already filled");
        matches[inviteCode].winnerData = winnerData;
        matches[inviteCode].encryptedPlayersData = encryptedPlayersData;
        matches[inviteCode].encryptedRewardData = encryptedRewardData;
        matches[inviteCode].isFilled = true;
    }

    // Initialize a new match with all the data, callable only by admins
    function initFullMatch(
        string calldata inviteCode,
        string calldata winnerData,
        string calldata encryptedPlayersData,
        string calldata encryptedOwnerData,
        string calldata encryptedRewardData
    ) external onlyAdmin {
        require(!inviteCodes[inviteCode], "Invite code is already in use by another match");
        inviteCodes[inviteCode] = true;
        matches[inviteCode] = MatchMaking(inviteCode, winnerData, encryptedPlayersData, encryptedOwnerData, encryptedRewardData, true);
    }

    // Retrieve all the data of a match by invite code
    function getMatchData(string calldata inviteCode) external view returns (string memory, string memory, string memory, string memory, bool) {
        require(inviteCodes[inviteCode], "Match not found for the provided invite code");
        MatchMaking memory matchData = matches[inviteCode];
        return (matchData.inviteCode, matchData.winnerData, matchData.encryptedPlayersData, matchData.encryptedOwnerData, matchData.isFilled);
    }

}
