// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import Sapphire library (for randomness)
import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

contract RedeemRewardContract {
    address public owner;
    mapping(string => RedeemReward) public redeemRewards;
    mapping(string => LockStatus) public voucherCodesLockStatus;  // Mapping for voucher code lock status
    mapping(address => bool) public admins;

    struct LockStatus {
        bool dataLocked;  // Lock status for data
    }

    struct RedeemReward {
        string voucherCode;
        string encryptedUserRedeemable;
        bool isMisteryBox;
        bool isSentToGameItem;
        bool isSentToNFT;
        string encryptedAddressGame;
        string encryptedAddressNFT;
        string[] items;
        uint256[] probabilities;
        uint256 numberOfItems;
        string[] resultItems;
        bool encryptedUserRedeemableLocked;
        string matchCode;
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

    // Add a new admin
    function addAdmin(address _admin) external onlyOwner {
        require(!admins[_admin], "Address is already an admin");
        admins[_admin] = true;
    }

    // Remove an admin
    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "Address is not an admin");
        admins[_admin] = false;
    }

    function defineVoucherAndItems(
        string calldata voucherCode,
        string calldata encryptedUserRedeemable,
        bool isMisteryBox,
        string[] calldata items,
        uint256 numberOfItems,
        uint256[] calldata probabilities,
        string calldata matchCode
    ) external onlyAdmin {
        
        LockStatus storage currentLockStatus = voucherCodesLockStatus[voucherCode];

        // Ensure the voucher data is not locked
        require(!currentLockStatus.dataLocked, "Voucher data is locked");

        // Store redeemReward in a local variable
        RedeemReward storage currentReward = redeemRewards[voucherCode];
        // Check if encryptedUserRedeemable can be set
        _checkUserRedeemable(currentReward, encryptedUserRedeemable);

        // Set the reward details
        currentReward.voucherCode = voucherCode;
        currentReward.encryptedUserRedeemable = encryptedUserRedeemable;
        currentReward.encryptedUserRedeemableLocked = bytes(encryptedUserRedeemable).length > 0;

        currentReward.isMisteryBox = isMisteryBox;
        currentReward.numberOfItems = numberOfItems;
        currentReward.items = items;
        currentReward.probabilities = probabilities;
        currentReward.matchCode = matchCode;

        currentLockStatus.dataLocked = false;
    }

    // Redeem and open mystery box in a single call
    function redeemAndOpenMysteryBox(string calldata voucherCode, string calldata encryptedAddressGame, string calldata encryptedAddressNFT) external {

        LockStatus storage currentLockStatus = voucherCodesLockStatus[voucherCode];
        require(!currentLockStatus.dataLocked, "Voucher data is locked");
        require(
            (bytes(encryptedAddressGame).length > 0 && bytes(encryptedAddressNFT).length == 0) || 
            (bytes(encryptedAddressNFT).length > 0 && bytes(encryptedAddressGame).length == 0),
            "Either encryptedAddressGame or encryptedAddressNFT must be filled, but not both"
        );

        RedeemReward storage currentReward = redeemRewards[voucherCode];
        require(bytes(currentReward.encryptedUserRedeemable).length > 0, "No redeemable found for this voucher");
        
        if (currentReward.isMisteryBox) {
            require(currentReward.isMisteryBox, "This is not a mystery box");
            // Get the random items based on probabilities
            string[] memory resultItems = _getRandomItems(currentReward.items, currentReward.probabilities, currentReward.numberOfItems);
            // Update result items
            currentReward.resultItems = resultItems;
        }

        currentReward.encryptedAddressGame = encryptedAddressGame;
        currentReward.encryptedAddressNFT = encryptedAddressNFT;
        currentReward.isSentToGameItem = bytes(encryptedAddressGame).length > 0;
        currentReward.isSentToNFT = bytes(encryptedAddressNFT).length > 0;

        // Lock the data after redemption
        currentLockStatus.dataLocked = true;
    }

    // Helper function to check user redeemable
    function _checkUserRedeemable(RedeemReward storage currentReward, string calldata encryptedUserRedeemable) private view {
        require(
            bytes(currentReward.encryptedUserRedeemable).length == 0 || 
            (keccak256(abi.encodePacked(currentReward.encryptedUserRedeemable)) == keccak256(abi.encodePacked(encryptedUserRedeemable))),
            "User redeemable is already set and cannot be changed"
        );
    }

    // Internal helper function to get random items based on probabilities using Sapphire's randomBytes
    function _getRandomItems(string[] memory items, uint256[] memory probabilities, uint256 numberOfItems) private view returns (string[] memory) {
        uint256 totalProbability = _calculateTotalProbability(probabilities);

        // Normalize probabilities to ensure they sum to 100
        uint256[] memory normalizedProbabilities = _normalizeProbabilities(probabilities, totalProbability);

        string[] memory selectedItems = new string[](numberOfItems);
        uint256 selectedCount = 0;

        // Generate random data for each selection iteration
        for (uint256 i = 0; i < numberOfItems; i++) {
            // Generate a new random value for each item selection
            bytes memory randomData = Sapphire.randomBytes(32, abi.encodePacked(blockhash(block.number - 1), block.timestamp, msg.sender, i)); 
            uint256 randomValue = uint256(keccak256(randomData)) % totalProbability; // Random value within the range of total probability

            uint256 accumulatedProbability = 0;
            for (uint256 j = 0; j < normalizedProbabilities.length; j++) {
                accumulatedProbability += normalizedProbabilities[j];
                if (randomValue < accumulatedProbability) {
                    selectedItems[selectedCount] = items[j];
                    selectedCount++;
                    break;
                }
            }
        }

        return selectedItems;
    }

    // Helper function to calculate the total probability
    function _calculateTotalProbability(uint256[] memory probabilities) private pure returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < probabilities.length; i++) {
            total += probabilities[i];
        }
        return total;
    }

    // Helper function to normalize probabilities
    function _normalizeProbabilities(uint256[] memory probabilities, uint256 totalProbability) private pure returns (uint256[] memory) {
        uint256[] memory normalizedProbabilities = new uint256[](probabilities.length);
        for (uint256 i = 0; i < probabilities.length; i++) {
            normalizedProbabilities[i] = (probabilities[i] * 100) / totalProbability;
        }
        return normalizedProbabilities;
    }

    // Function to retrieve redeem reward data by voucherCode
    function getData(string calldata voucherCode)
        public
        view
        returns (
            string memory,
            string memory,
            bool,
            bool,
            string memory,
            string memory,
            bool,
            string[] memory,
            uint256[] memory,
            uint256,
            string[] memory,
            string memory,
            bool
        )
    {
        RedeemReward memory redeemReward = redeemRewards[voucherCode];
        LockStatus storage currentLockStatus = voucherCodesLockStatus[voucherCode];
        return (
            redeemReward.voucherCode,
            redeemReward.encryptedUserRedeemable,
            redeemReward.isSentToGameItem,
            redeemReward.isSentToNFT,
            redeemReward.encryptedAddressNFT,
            redeemReward.encryptedAddressGame,
            redeemReward.isMisteryBox,
            redeemReward.items,
            redeemReward.probabilities,
            redeemReward.numberOfItems,
            redeemReward.resultItems,
            redeemReward.matchCode,
            currentLockStatus.dataLocked
        );
    }
}
