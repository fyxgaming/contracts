const { ethers } = require("ethers");
import 'dotenv/config';

// Contract ABI
const abi = [
  "function openLootBox(string[] memory items, uint256[] memory probabilities) external",
  "event LootBoxOpened(address indexed user, string[] items, uint256[] probabilities, string resultItem)"
];

// Contract address (replace with the actual address)
const contractAddress = "0x19a3703cB8a846D59b1e815253AcE408C8F95c80";

// Example configuration (replace with your RPC URL and private key)
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");
const privateKey = process.env.SAPPHIRE_TESTNET_PRIVATE_KEY; // Replace with your wallet's private key
const signer = new ethers.Wallet(privateKey, provider);

// Loot box items and probabilities
const items = ["Sword", "Shield", "Potion", "Ring"];
const probabilities = [25, 25, 25, 25]; // Must add up to 100

async function openLootBox() {
  try {
    // Connect to the contract
    const lootBoxesContract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Opening loot box...");
    const tx = await lootBoxesContract.openLootBox(items, probabilities);
    console.log("Transaction sent:", tx.hash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    // Parse the emitted event
    const event = receipt.events.find((e:any) => e.event === "LootBoxOpened");
    if (event) {
      const { user, items, probabilities, resultItem } = event.args;
      console.log("Loot box opened by:", user);
      console.log("Items:", items);
      console.log("Probabilities:", probabilities);
      console.log("Result item:", resultItem);
    } else {
      console.log("No LootBoxOpened event found.");
    }
  } catch (error) {
    console.error("Error opening loot box:", error);
  }
}

// Call the function
openLootBox();
