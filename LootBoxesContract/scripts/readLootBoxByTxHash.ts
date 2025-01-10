const { ethers } = require("ethers");
import 'dotenv/config';

// Contract ABI
const abi = [
  "function openLootBox(string[] memory items, uint256[] memory probabilities) external",
  "event LootBoxOpened(address indexed user, string[] items, uint256[] probabilities, string resultItem)"
];

// RPC URL and signer setup
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");

async function readEventByTxHash(txHash: string) {
  try {
    // Get the transaction receipt by hash
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      console.log("Transaction not found or not yet confirmed.");
      return;
    }

    console.log("Transaction receipt found:", receipt);

    // Parse events from the receipt
    const iface = new ethers.utils.Interface(abi); // Create an Interface for decoding
    receipt.logs.forEach((log:any) => {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog.name === "LootBoxOpened") {
          const { user, items, probabilities, resultItem } = parsedLog.args;
          console.log("Loot box opened by:", user);
          console.log("Items:", items);
          console.log("Probabilities:", probabilities);
          console.log("Result item:", resultItem);
        }
      } catch (error) {
        // Ignore logs that don't match the event signature
      }
    });
  } catch (error) {
    console.error("Error reading event by transaction hash:", error);
  }
}

// Replace with the actual transaction hash to read the event
const txHash = "0x3123e280f41049e90b681b2b6cd660bc4a19a6657e98d111230c28bb641e3697";
readEventByTxHash(txHash);