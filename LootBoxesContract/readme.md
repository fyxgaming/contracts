# Loot Boxes Open Contract

This contract allows administrators to open loot boxes and randomly select an item from a list of possible items, with each item having a corresponding probability of being selected.

## Usage

1. Deploy the contract.
2. Add administrators by calling the `addAdmin` function.
3. Call the `openLootBox` function, passing in an array of possible items and their corresponding probabilities.
4. The contract will emit a `LootBoxOpened` event with the selected item and the probabilities used to select it.

## Functions

### `addAdmin`

Adds an administrator to the contract.

* `admin`: The address of the administrator to add.

### `removeAdmin`

Removes an administrator from the contract.

* `admin`: The address of the administrator to remove.

### `openLootBox`

Opens a loot box and randomly selects an item from the list of possible items.

* `items`: An array of possible items.
* `probabilities`: An array of probabilities corresponding to each item, where the probability of each item is specified as a percentage (e.g. 25 for 25%).

## Events

### `LootBoxOpened`

Emitted when a loot box is opened.

* `user`: The address of the user who opened the loot box.
* `items`: The array of possible items.
* `probabilities`: The array of probabilities used to select the item.
* `resultItem`: The item that was randomly selected.

## Development

This contract is written in Solidity and uses the Sapphire library for generating random numbers. To compile the contract, run `npx hardhat compile`. To deploy the contract, run `npx hardhat run scripts/deploy.ts --network sapphire`.

### `openLootBox.ts`

This script calls the `openLootBox` function with example data.

To run the script, use `npx hardhat run scripts/openLootBox.ts`. The script will print the transaction hash to the console.
