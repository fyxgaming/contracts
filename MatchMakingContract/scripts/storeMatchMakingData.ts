import { ethers } from "ethers";
import 'dotenv/config';

// Contract ABI
const abi = [
  "function storeData(string inviteCode, string encryptedOwnerData) external",
  "event MatchMakingDataStored(address indexed admin, string inviteCode, string encryptedOwnerData)"
];

// Contract address
const contractAddress = "0xDEFCF6d78044187cc8f6dDa1ce5B0D7d5646a1b1"; // Replace with your contract address

// Provider and signer setup
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");
const privateKey = process.env.SAPPHIRE_TESTNET_PRIVATE_KEY as string; // Replace with your private key
const signer = new ethers.Wallet(privateKey, provider);

// Function to store data
async function storeData(inviteCode: string, encryptedOwnerData: string) {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Storing data...");
    const tx = await contract.storeData(inviteCode, encryptedOwnerData);
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Error storing data:", error);
  }
}

// Replace with your data
const inviteCode = "sample-invite-code";
const encryptedOwnerData = "encrypted-owner-data-example";
storeData(inviteCode, encryptedOwnerData);
