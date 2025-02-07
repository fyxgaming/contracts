const { ethers } = require("ethers");
require('dotenv').config();

// Contract ABI (only the relevant parts for this script)
const abi = [
  "function addAdmin(address admin) external",
];

// Contract address (replace with your contract's address)
const contractAddress = "0xDEFCF6d78044187cc8f6dDa1ce5B0D7d5646a1b1"; // Replace with actual contract address

// RPC URL (replace with your network's URL)
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");

// Signer setup: Replace with your private key (ensure it's in .env for safety)
const privateKey = process.env.SAPPHIRE_TESTNET_PRIVATE_KEY; 
const signer = new ethers.Wallet(privateKey, provider);

// Target admin address to add (replace with the address you want to add)
const adminAddress = "0x465Fd9d1764b2E3205dC74E4d32AF2CA6364D039"; // Replace with the address to add as admin

async function addAdmin() {
  try {
    // Connect to the MatchMakingData contract
    const matchMakingContract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Adding admin address:", adminAddress);

    // Call the addAdmin function on the contract
    const tx = await matchMakingContract.addAdmin(adminAddress);
    console.log("Transaction sent:", tx.hash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Admin added successfully! Transaction receipt:", receipt);
  } catch (error) {
    console.error("Error adding admin:", error);
  }
}

addAdmin();
