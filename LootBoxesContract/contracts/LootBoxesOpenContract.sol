// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import Sapphire library
import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

contract LootBoxesOpen {
    address public owner;
    string constant errForbidden = "Access forbidden";

    // Admin list
    mapping(address => bool) private admins;

    // Event for loot box results
    event LootBoxOpened(
        address indexed user,
        string[] items,
        uint256[] probabilities,
        string resultItem
    );

    modifier onlyOwner() {
        require(msg.sender == owner, errForbidden);
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], errForbidden);
        _;
    }

    constructor() {
        owner = msg.sender; // Set contract deployer as the owner
        admins[msg.sender] = true; // Set the deployer as a default admin
    }

    // Function to add admin
    function addAdmin(address admin) external onlyOwner {
        admins[admin] = true;
    }

    // Function to remove admin
    function removeAdmin(address admin) external onlyOwner {
        admins[admin] = false;
    }

    // Function to open loot box
    function openLootBox(
        string[] memory items,
        uint256[] memory probabilities
    ) external onlyAdmin {
        require(items.length == probabilities.length, "Invalid input lengths");

        // Calculate total probability
        uint256 totalProbability = 0;
        for (uint256 i = 0; i < probabilities.length; i++) {
            totalProbability += probabilities[i];
        }

        // Normalize probabilities
        uint256[] memory normalizedProbabilities = new uint256[](probabilities.length);
        for (uint256 i = 0; i < probabilities.length; i++) {
            normalizedProbabilities[i] = (probabilities[i] * 100) / totalProbability;
        }

        // Ensure probabilities account for all outcomes (sum to ~100)
        uint256 normalizedTotal = 0;
        for (uint256 i = 0; i < normalizedProbabilities.length; i++) {
            normalizedTotal += normalizedProbabilities[i];
        }
        require(normalizedTotal == 100, "Probabilities must account for all outcomes");

        // Generate random value
        bytes memory randomData = Sapphire.randomBytes(
            32,
            abi.encodePacked(blockhash(block.number - 1), block.timestamp, msg.sender)
        );
        uint256 randomValue = uint256(keccak256(randomData)) % 100;

        // Determine the selected item
        string memory selectedItem;
        uint256 probabilitySum = 0;
        for (uint256 i = 0; i < normalizedProbabilities.length; i++) {
            probabilitySum += normalizedProbabilities[i];
            if (randomValue < probabilitySum) {
                selectedItem = items[i];
                break;
            }
        }

        // Emit event with loot box result
        emit LootBoxOpened(msg.sender, items, probabilities, selectedItem);
    }

}
