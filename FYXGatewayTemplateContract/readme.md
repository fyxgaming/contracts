## Hardhat 

Hardhat is the most popular Ethereum dev environment, some helper commands include:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## Smart Contracts Overview

The smart contracts make use of a proxy pattern called the [diamond standard](https://eips.ethereum.org/EIPS/eip-2535) to allow for more modular smart contract development.

The contracts are 1155 contracts based on [solid state solidity's](https://github.com/solidstate-network/solidstate-solidity) diamond and 1155 implementation.

Each smart contract module is held within the `contracts/facets` directory, the facet to look out for is `ERC1155TokenUriSignatureMint`.

## How the Minting Process "From Handcash to Polygon" Works:

1. The user initiates the minting process via the FYX Gateway UI.
2. The FYX Gateway back end destroys the provided assets on the Universal Handcash side by calling the appropriate Universal Handcash APIs.
3. The FYX Gateway Scheduler verifies that the items are truly destroyed and begins the minting process to the user's Polygon wallet.

Note: The reason for the signature flow is that it is important for the items to appear in the OpenSea profile section. If tokens are airdropped to the end user, they don't show up in OpenSea by default.

## How the Burning Process "From Polygon to Handcash" Works:

1. The user initiates the burn process via the UI.
2. The FYX Gateway back end burns their tokens via the admin `devBurn` function.
3. The FYX Gateway Scheduler ensures the transaction burn is successful, then creates an ordinal and transfers the items to the user's Handcash wallet.

## Contract Deployment

Ensure you have first compiled the contracts locally:

`yarn hardhat compile`

You can also test the contract code with the following command:

`yarn hardhat test`

Ensure your .env file is filled out (see `.env.example` for reference). Environment variables can also be found in Vercel hosting under the "Settings" section.

Run the deployment script (also verifies on Etherscan):

`yarn hardhat run ./scripts/deploy.ts --network sepolia`

By running the command above, we also set the owner address as both burner and minter.

We have some functions for this contract:

1. Add Minter Role to an address (./scripts/setMinterRole.ts)
2. Add Burner Role to an address (./scripts/setBurnerRole.ts)
3. Revoke Minter Role from an address (./scripts/revokeMinterRole.ts)
4. Revoke Burner Role from an address (./scripts/revokeBurnerRole.ts)
5. Transfer Ownership from the current address to another address (./scripts/transferOwnership.ts)
6. Sample Minting to an address
7. Sample Burning to an address

To run these functions, you can use the following command, replacing [./scripts/setMintSigner.ts] with the function you want to run:
`yarn hardhat run ./scripts/setMintSigner.ts --network sepolia`

