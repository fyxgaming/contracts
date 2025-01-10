import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying the contracts with the account:", await deployer.getAddress());

  const LootBoxesOpen = await ethers.getContractFactory("LootBoxesOpen");
  const lootBoxesOpen = await LootBoxesOpen.deploy();
  await lootBoxesOpen.deployed();

  console.log(`LootBoxesOpen deployed to ${lootBoxesOpen.address}`);
}

// Execute the deployment script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});