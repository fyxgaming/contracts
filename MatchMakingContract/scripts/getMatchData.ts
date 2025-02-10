import { ethers } from "ethers";
import 'dotenv/config';

// For Hardhat
const contractJSON = require("../artifacts/contracts/MatchMakingContract.sol/MatchMakingData.json");

// Contract ABI
const abi = contractJSON.abi;

const contractAddress = "0xf341Aa3414b19b971157F17b3e0AFE7fB1A200F8"; // Replace with your contract address


// Provider setup
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");
const privateKey = process.env.SAPPHIRE_TESTNET_PRIVATE_KEY as string; // Replace with your private key
const signer = new ethers.Wallet(privateKey, provider);

// Create contract instance
const contract = new ethers.Contract(contractAddress, abi, signer);

// Function to retrieve match data by invite code
async function getMatchData(inviteCode: string): Promise<void> {
  try {
    console.log(`Attempting to fetch match data for invite code: ${inviteCode}`);

    const isInviteCodeValid = await contract.checkInviteCode(inviteCode);
    console.log(`Is the invite code valid? ${isInviteCodeValid}`);

    if (isInviteCodeValid) {
      const matchData = await contract.getMatchData(inviteCode);
      console.log('Match Data:', matchData);
    } else {
      console.log("The invite code does not exist.");
    }
  } catch (error: any) {
    console.error("Error fetching match data:");
    console.error(error);
  }
}

// Example: Fetch match data for a specific invite code
const inviteCode: string = "sample-invite-code1"; // Replace with actual invite code
getMatchData(inviteCode);
