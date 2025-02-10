import { ethers } from "ethers";
import 'dotenv/config';

// For Hardhat
const contractJSON = require("../artifacts/contracts/RedeemRewardContract.sol/RedeemRewardContract.json");

// Contract ABI
const abi = contractJSON.abi;

const contractAddress = "0x9E0E24613C99d502F61552ecfA85aC60e63BEa69"; // Replace with your contract address

// Provider and signer setup
const provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev");
const privateKey = process.env.SAPPHIRE_TESTNET_PRIVATE_KEY as string; // Replace with your private key
const signer = new ethers.Wallet(privateKey, provider);

// Function to define voucher and items
async function defineVoucherAndItems(
  voucherCode: string,
  userRedeemable: string,
  encryptedAddressNFT: string,
  encryptedAddressGame: string,
  isMisteryBox: boolean,
  items: string[],
  numberOfItems: number,
  probabilities: number[],
  matchCode: string,
) {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Defining voucher and items...");
    const tx = await contract.defineVoucherAndItems(
      voucherCode,
      userRedeemable,
      isMisteryBox,
      items,
      numberOfItems,
      probabilities,
      matchCode
    );
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    // Call redeemAndOpenMysteryBox function after defining voucher and items
    const tx2 = await contract.redeemAndOpenMysteryBox(voucherCode, encryptedAddressGame, encryptedAddressNFT);
    console.log("Transaction sent to redeem and open mystery box:", tx2.hash);

    const receipt2 = await tx2.wait();
    console.log("Transaction confirmed:", receipt2.transactionHash);

    return receipt2.transactionHash;
  } catch (error) {
    console.error("Error defining voucher and items:", error);
  }
}

// Replace with your data
const voucherCode = "voucher-code-example1";
const userRedeemable = "user-redeemable-example";
const encryptedAddressNFT = "";
const encryptedAddressGame = "0x0000000000000000000000000000000000000000";
const isMisteryBox = true;
const items = ["item-1", "item-2", "item-3"];
const probabilities = [33, 33, 34]; // Adjusted to sum to 100
const matchCode = "match-code-example";
const numberOfItems = 2;
defineVoucherAndItems(
  voucherCode,
  userRedeemable,
  encryptedAddressNFT,
  encryptedAddressGame,
  isMisteryBox,
  items,
  numberOfItems,
  probabilities,
  matchCode
);
