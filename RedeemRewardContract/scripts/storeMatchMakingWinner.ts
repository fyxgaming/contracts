import { ethers } from "ethers";
import 'dotenv/config';

// Contract ABI
const abi = [
  "function declareWinner(string inviteCode, string winnerData, string encryptedPlayersData, string encryptedOwnerData) external",
  "event WinnerStored(address indexed admin, string inviteCode, string winnerData, string encryptedPlayersData, string encryptedOwnerData)"
];

// Contract address
const contractAddress = "0xDEFCF6d78044187cc8f6dDa1ce5B0D7d5646a1b1"; // Replace with your contract address

// Provider and signer setup
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");
const privateKey = process.env.SAPPHIRE_TESTNET_PRIVATE_KEY as string; // Replace with your private key
const signer = new ethers.Wallet(privateKey, provider);

// Function to declare a winner
async function declareWinner(
  inviteCode: string,
  winnerData: string,
  encryptedPlayersData: string,
  encryptedOwnerData: string
): Promise<void> {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Declaring winner...");
    const tx = await contract.declareWinner(inviteCode, winnerData, encryptedPlayersData, encryptedOwnerData);
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Error declaring winner:", error);
  }
}

// Replace with your data
const inviteCode = "sample-invite-code";
const winnerData = "winner-data-example";
const encryptedPlayersData = "encrypted-players-data-example";
const encryptedOwnerData = "encrypted-owner-data-example";

// Call the function
declareWinner(inviteCode, winnerData, encryptedPlayersData, encryptedOwnerData);
