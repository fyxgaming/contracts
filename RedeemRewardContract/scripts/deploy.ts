import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying the contract with the account:", await deployer.getAddress());

  // Get the contract factory
  const MatchMakingData = await ethers.getContractFactory("MatchMakingData");

  // Deploy the contract
  const matchMakingData = await MatchMakingData.deploy();
  await matchMakingData.deployed();

  console.log(`MatchMakingData deployed to: ${matchMakingData.address}`);
}

// Execute the deployment script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
