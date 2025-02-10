# Match Making and Winner Declaration Contract

This contract allows for the management of matchmaking data and winner declarations in a decentralized manner. The data is stored through events to minimize on-chain storage costs.

## Usage

1. Deploy the contract. The deployer automatically becomes the owner and an admin.
2. Add administrators by calling the `addAdmin` function (only the owner can do this).
3. Store matchmaking data using the `storeData` function (admins only).
4. Declare winners using the `declareWinner` function (admins only).
5. Retrieve data through emitted events by parsing transaction logs.

## Functions

### `addAdmin`

Adds an administrator to the contract. Only callable by the owner.

* `admin`: The address of the administrator to add.

### `removeAdmin`

Removes an administrator from the contract. Only callable by the owner.

* `admin`: The address of the administrator to remove.

### `storeData`

Stores matchmaking data (invite code and encrypted player data) in an event. Only callable by admins.

* `inviteCode`: A unique string representing the matchmaking session.
* `encryptedPlayerData`: Encrypted JSON containing player data and preferences.

### `declareWinner`

Declares the winner of a matchmaking session. Only callable by admins.

* `inviteCode`: A unique string representing the matchmaking session.
* `winnerData`: Encrypted JSON containing winner details.

## Events

### `AdminAdded`

Emitted when an admin is added.

* `admin`: The address of the admin added.

### `AdminRemoved`

Emitted when an admin is removed.

* `admin`: The address of the admin removed.

### `MatchMakingDataStored`

Emitted when matchmaking data is stored.

* `admin`: The address of the admin storing the data.
* `inviteCode`: The unique invite code for the matchmaking session.
* `encryptedPlayerData`: The encrypted player data stored.

### `WinnerStored`

Emitted when a winner is declared.

* `admin`: The address of the admin declaring the winner.
* `inviteCode`: The unique invite code for the matchmaking session.
* `winnerData`: The encrypted winner data stored.

## Development

This contract is written in Solidity and designed to be deployed on the Sapphire network. To compile the contract, run `npx hardhat compile`. To deploy the contract, run `npx hardhat run scripts/deploy.ts --network sapphire`.

### Scripts

#### `deploy.ts`

This script deploys the contract. To run the script, use `npx hardhat run scripts/deploy.ts`. The script will output the deployed contract address.

#### `addAdmin.ts`

This script calls the `addAdmin` function to add a new admin. To run the script, use `npx hardhat run scripts/addAdmin.ts`.

#### `storeMatchMakingData.ts`

This script calls the `storeData` function to store matchmaking data. To run the script, use `npx hardhat run scripts/storeMatchMakingData.ts`. The script will print the transaction hash to the console.

#### `storeMatchMakingWinner.ts`

This script calls the `declareWinner` function to store winner data. To run the script, use `npx hardhat run scripts/storeMatchMakingWinner.ts`. The script will print the transaction hash to the console.

#### `readMatchMakingData.ts`

This script reads events emitted by `storeData` for specific matchmaking data. Use it to retrieve stored data. To run the script, use `node scripts/readMatchMakingData.ts` with the transaction hash as input.

#### `readMatchMakingWinner.ts`

This script reads events emitted by `declareWinner` for specific winner data. Use it to retrieve stored winner data. To run the script, use `node scripts/readMatchMakingWinner.ts` with the transaction hash as input.

#### `getMatchData.ts`

This script reads events emitted by `storeData` for specific matchmaking data. Use it to retrieve stored data. To run the script, use `npx hardhat run scripts/getMatchData.ts` with the transaction hash as input. This script will return the invite code, winner data, encrypted player data, encrypted owner data, and a boolean indicating if the match is filled.