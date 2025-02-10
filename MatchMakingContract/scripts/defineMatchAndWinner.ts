import { ethers } from "ethers";
import 'dotenv/config';

// For Hardhat
const contractJSON = require("../artifacts/contracts/MatchMakingContract.sol/MatchMakingData.json");

// Contract ABI
const abi = contractJSON.abi;

const contractAddress = "0xf341Aa3414b19b971157F17b3e0AFE7fB1A200F8"; // Replace with your contract address

// Provider and signer setup
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");
const privateKey = process.env.SAPPHIRE_TESTNET_PRIVATE_KEY as string; // Replace with your private key
const signer = new ethers.Wallet(privateKey, provider);

// Function to define match
async function defineMatch(
  inviteCode: string,
  ownerData: string
) {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Defining match...");
    const tx = await contract.defineMatch(
      inviteCode,
      ownerData
    );
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Error defining match:", error);
  }
}

// Function to define winner and lock the match
async function defineWinnerAndLockMatch(
  inviteCode: string,
  winnerData: string,
  encryptedPlayersData: string,
  encryptedOwnerData: string,
  encryptedRewardData: string,
  voucherCode: string
) {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Defining winner and locking match...");
    const tx = await contract.defineWinnerAndLockMatch(
      inviteCode,
      winnerData,
      encryptedPlayersData,
      encryptedOwnerData,
      encryptedRewardData,
      voucherCode
    );
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Error defining winner and locking match:", error);
  }
}

// Replace with your data
const inviteCode = "sample-invite-code1";
const ownerData = "owner-data-example";  // Owner's data for this invite code

// Step 1: Define match
defineMatch(inviteCode, ownerData)
  .then(() => {
    // Step 2: Once match is defined, define the winner and lock the match
    const winnerData = "winner-data-example";
    const encryptedPlayersData = "encrypted-players-data-example";
    const encryptedOwnerData = "encrypted-owner-data-example";
    const encryptedRewardData = "encrypted-reward-data-example";
    const voucherCode = "voucher-code-example";
    
    defineWinnerAndLockMatch(
      inviteCode,
      winnerData,
      encryptedPlayersData,
      encryptedOwnerData,
      encryptedRewardData,
      voucherCode
    );
  })
  .catch((error) => {
    console.error("Error while defining match and winner:", error);
  });
