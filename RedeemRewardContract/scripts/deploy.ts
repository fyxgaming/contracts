import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying the contract with the account:", await deployer.getAddress());

  // Get the contract factory
  const RedeemRewardContract = await ethers.getContractFactory("RedeemRewardContract");

  // Deploy the contract
  const redeemRewardContract = await RedeemRewardContract.deploy();
  await redeemRewardContract.deployed();

  console.log(`RedeemRewardContract deployed to: ${redeemRewardContract.address}`);
}

// Execute the deployment script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
