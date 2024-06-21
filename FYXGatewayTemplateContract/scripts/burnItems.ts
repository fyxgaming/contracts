import {
    ERC1155BurnFacet__factory,
} from '../typechain-types';
import fs from 'fs/promises';
import { BigNumber, ethers } from 'ethers';
import 'dotenv/config';

export type Network =
    | 'bsv'
    | 'ethereum'
    | 'sepolia'
    | 'mumbai'
    | 'bscTestnet'
    | 'polygon'
    | 'bsv';

export const paramsForNetwork = (network: string) => {
    switch (network) {
        case 'bscTestnet': // doesn't support EIP1559
            return {
                gasPrice: 100000000000,
                gasLimit: 1000000,
                type: 0,
            };
        case 'polygon':
            return {
                type: 2,
                maxFeePerGas: 300000000000,
                maxPriorityFeePerGas: 100000000000,
                gasLimit: 1000000,
            };
        default:
            return {
                type: 2,
                maxFeePerGas: 100000000000,
                maxPriorityFeePerGas: 100000000000,
                gasLimit: 1000000,
            };
    }
};

export function calculateGasLimit(numItems: number, defaultGasLimitPerItem: number) {

    let gasLimit = 0;

    if (numItems > 0 && numItems === 1) {
        gasLimit = defaultGasLimitPerItem                     // 100%
    } else if (numItems > 1 && numItems <= 10) {
        gasLimit = numItems * (defaultGasLimitPerItem * 0.5); // 50%
    } else if (numItems > 10 && numItems <= 20) {
        gasLimit = numItems * (defaultGasLimitPerItem * 0.3); // 30%
    } else {
        gasLimit = numItems * (defaultGasLimitPerItem * 0.2); // 20%
    }

    return gasLimit

}

export type NetworkConfig = {
    chainId: number;
};

export const networkConfig: Partial<Record<Network, NetworkConfig>> = {
    sepolia: {
        chainId: 11155111,
    },
    polygon: {
        chainId: 137,
    },
    ethereum: {
        chainId: 1,
    },
};


async function main() {

    const DEFAULT_VALUE_X_SAFE_GAS_LIMIT = 1;
    const contractAddress = '0x0916e21FC385ad72402aC4d22eE01FEfd9b88F1a';
    const fromAddress = '0x3324D4129De9cDb54e54Fe16789E64D978ABFA05';
    const network = 'sepolia'; // 'sepolia' | 'polygon' | 'ethereum'
    const amounts = [1];
    const networkConfigUsed = networkConfig[network]

    const provider = new ethers.providers.JsonRpcProvider(
        process.env[`${network.toUpperCase()}_RPC_URL`]
    );

    const signer = new ethers.Wallet(
        process.env[`${network.toUpperCase()}_PRIVATE_KEY`] || '',
        provider
    );

    // Read item JSON file
    const gameItems = JSON.parse(await fs.readFile('./scripts/sample/item.json', 'utf-8'));

    // @ts-ignore

    const ids = gameItems.map((gameItem: any) => {
        if (!gameItem.id) throw new Error('no game item');
        return gameItem.id;
    });

    const nonce = await signer.getTransactionCount();
    const from = await signer.getAddress();

    let totalAmount = amounts.reduce((acc: any, curr: any) => acc + curr, 0);

    let dataGas = paramsForNetwork(network);
    dataGas = {
        ...dataGas,
        gasLimit: calculateGasLimit(totalAmount, dataGas?.gasLimit)
    }

    let unsignedTx: any

    const burnOmniscapeInstance = await ERC1155BurnFacet__factory.connect(
        contractAddress,
        signer
    )
    // we use burner because we are not the owner of the contract
    unsignedTx = await burnOmniscapeInstance.populateTransaction.devBurnBatchWithBurner(
        fromAddress,
        ids,
        amounts,
        {
            from,
            nonce,
            ...dataGas,
        }
    )

    unsignedTx.chainId = networkConfigUsed?.chainId!;

    try {
        // For more precision estimate gas we use alchemy estimate gas
        // to ensure we never hit the Gas Limit

        // Currently we only use ether and not alchemy to estimate gases
        // because it would be more correct since we are using a signer from ethers
        const resEstimateGas = await signer.estimateGas(unsignedTx)

        if (resEstimateGas?._hex) {
            unsignedTx.gasLimit = BigNumber.from(Math.floor((Number(resEstimateGas?._hex) * DEFAULT_VALUE_X_SAFE_GAS_LIMIT)).toString())
        }
    } catch (errEstGasLimit) {
        // Sometimes this line generates an error due to insufficient balance; we need to prevent it
        // since the actual gas payment may not be the same
        console.log("errEstGasLimit : ", errEstGasLimit)
    }

    const signedTx = await signer.signTransaction(unsignedTx);
    const transactionHash = ethers.utils.keccak256(signedTx);
    const tx = await signer.provider.sendTransaction(signedTx);
    console.log('THE TRANSACTION: ', transactionHash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
