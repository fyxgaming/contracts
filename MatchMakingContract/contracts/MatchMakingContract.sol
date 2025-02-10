// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MatchMakingData {
    address public owner;
    mapping(address => bool) public admins;
    mapping(string => MatchMaking) public matches;  // Store matches by invite code
    mapping(string => bool) public inviteCodes;  // Store invite codes (before match is complete)
    string[] public inviteCodeList;  // Array to store invite codes for iteration
    string public message;  // New variable to store the message

    struct MatchMaking {
        string inviteCode;  // Invite code used for matchmaking
        string winnerData;  // Data related to the winner
        string encryptedPlayersData;  // Encrypted players data
        string encryptedOwnerData;  // Encrypted owner data
        string encryptedRewardData;  // Encrypted reward data
        bool dataLocked;  // Indicates if the match data is filled (locked)
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

    // Define the match with the invite code and owner's data (called first)
    function defineMatch(
        string calldata inviteCode,  // Invite code for matchmaking, passed by your API
        string calldata ownerData  // Owner's data to be stored when defining the match
    ) external onlyAdmin {
        require(!inviteCodes[inviteCode], "Invite code is already in use by another match. Please use a different one.");
        
        // Mark the invite code as used
        inviteCodes[inviteCode] = true;

        // Add the invite code to the list for iteration
        inviteCodeList.push(inviteCode);

        // Check if the match data is already filled
        require(!matches[inviteCode].dataLocked, "Match data is already locked. Cannot be filled again.");

        // Initialize the match with the provided data (without winner and encrypted players at this point)
        matches[inviteCode] = MatchMaking(
            inviteCode,
            "",  // Winner data is not available yet
            "",  // Encrypted players data will be added later when winner is defined
            ownerData,  // Store owner's data when creating the match
            "",  // Encrypted reward data
            false  // Match data is not locked yet
        );
    }

    // Define winner, encrypted players, and lock the match data (called second)
    function defineWinnerAndLockMatch(
        string calldata inviteCode,  // Invite code to match the game
        string calldata winnerData,  // Winner data
        string calldata encryptedPlayersData,  // Encrypted players data (now added here)
        string calldata encryptedRewardData  // Encrypted reward data
    ) external onlyAdmin {
        require(inviteCodes[inviteCode], "Invite code not found");

        // Fetch the match data using the invite code
        MatchMaking storage matchData = matches[inviteCode];

        // Check if the match is already locked (completed)
        require(!matchData.dataLocked, "Match is already locked. Cannot modify again.");

        // Set the winner data, encrypted players data, and lock the match
        matchData.winnerData = winnerData;
        matchData.encryptedPlayersData = encryptedPlayersData;
        matchData.encryptedRewardData = encryptedRewardData;
        matchData.dataLocked = true;
    }

    // Retrieve match data by invite code
    function getMatchData(string calldata inviteCode)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            bool
        )
    {
        bool matchExists = inviteCodes[inviteCode];  // Check for invite code existence
        
        require(matchExists, "Match not found for the provided invite code");

        // Fetch match data using the invite code
        MatchMaking memory matchData = matches[inviteCode];

        // Return the match data
        return (
            matchData.inviteCode,
            matchData.winnerData,
            matchData.encryptedOwnerData,
            matchData.encryptedPlayersData,
            matchData.encryptedRewardData,
            matchData.dataLocked
        );
    }

    // Function to check if an invite code exists
    function checkInviteCode(string calldata inviteCode) public view returns (bool) {
        require(inviteCodes[inviteCode], "Invite code does not exist");
        return inviteCodes[inviteCode];  // Check if the invite code is used
    }
}
