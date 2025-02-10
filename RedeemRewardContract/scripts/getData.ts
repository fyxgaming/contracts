import { ethers } from "ethers";
import 'dotenv/config';

// For Hardhat
const contractJSON = require("../artifacts/contracts/RedeemRewardContract.sol/RedeemRewardContract.json");

// Contract ABI
const abi = contractJSON.abi;

const contractAddress = "0x9E0E24613C99d502F61552ecfA85aC60e63BEa69"; // Replace with your contract address

// Provider setup
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");
const privateKey = process.env.SAPPHIRE_TESTNET_PRIVATE_KEY as string; // Replace with your private key
const signer = new ethers.Wallet(privateKey, provider);

// Create contract instance
const contract = new ethers.Contract(contractAddress, abi, signer);

// Function to retrieve match data by invite code
async function getData(voucherCode: string): Promise<void> {
  try {
    console.log(`Attempting to fetch match data for invite code: ${voucherCode}`);

    const getData = await contract.getData(voucherCode);
    console.log('Get Data:', getData);

    console.log("Probability : ", getData[8].map((prob:any) => prob.toNumber()));
    console.log("Number Of Items : ", getData[9].toNumber());
    console.log("Result Items: ", getData[10][0]);

  } catch (error: any) {
    console.error("Error fetching match data:");
    console.error(error);
  }
}

// Example: Fetch match data for a specific invite code
const voucherCode: string = "voucher-code-example1"; // Replace with actual invite code
getData(voucherCode);
