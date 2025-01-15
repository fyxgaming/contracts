import { ethers } from "ethers";
import 'dotenv/config';

// Contract ABI
const abi = [
  "event MatchMakingDataStored(address indexed admin, string inviteCode, string encryptedOwnerData)"
];

// Provider setup
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");

// Function to read events by transaction hash
async function readEventByTxHash(txHash: string): Promise<void> {
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
        if (parsedLog.name === "MatchMakingDataStored") {
          const { admin, inviteCode, encryptedOwnerData } = parsedLog.args;
          console.log("Data stored by admin:", admin);
          console.log("Invite Code:", inviteCode);
          console.log("Encrypted Owner Data:", encryptedOwnerData);
        }
      } catch (error) {
        // Ignore logs that don't match the event
      }
    });
  } catch (error) {
    console.error("Error reading event by transaction hash:", error);
  }
}

// Replace with the transaction hash to read
const txHash: string = "0x1fd45041a9cb71605964fe466a4d2d0e92ae88e257ab4eeba58c0f6aaa734f4e"; // Replace with actual transaction hash
readEventByTxHash(txHash);
