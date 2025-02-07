import { ethers } from "ethers";
import 'dotenv/config';

// Contract ABI
const abi = [
  "event WinnerStored(address indexed admin, string inviteCode, string winnerData, string encryptedPlayersData, string encryptedOwnerData)"
];

// Provider setup
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");

// Function to read winner data by transaction hash
async function readWinnerByTxHash(txHash: string) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      console.log("Transaction not found or not yet confirmed.");
      return;
    }

    console.log("Transaction receipt found:", receipt);

    // Parse the logs to find the event
    const iface = new ethers.utils.Interface(abi);
    receipt.logs.forEach((log) => {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog.name === "WinnerStored") {
          const { admin, inviteCode, winnerData, encryptedPlayersData, encryptedOwnerData } = parsedLog.args;
          console.log("Winner declared by admin:", admin);
          console.log("Invite Code:", inviteCode);
          console.log("Winner Data:", winnerData);
          console.log("Encrypted Players Data:", encryptedPlayersData);
          console.log("Encrypted Owner Data:", encryptedOwnerData);
        }
      } catch (error) {
        // Ignore logs that don't match the event
      }
    });
  } catch (error) {
    console.error("Error reading winner by transaction hash:", error);
  }
}

// Replace with the transaction hash to read
const txHash = "0xafbd4a63c79cb456706e1263cbe4188fc7ef562e229d125f20399040ff66ea02"; // Replace with actual transaction hash
readWinnerByTxHash(txHash);
