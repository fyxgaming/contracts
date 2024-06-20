import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGON_SCANNER_API_KEY || '',
      bscTestnet: process.env.BNB_SCANNER_API_KEY || '',
      polygon: process.env.POLYGON_SCANNER_API_KEY || '',
      mainnet: process.env.ETHERSCAN_API_KEY || '',
    },
  },
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.POLYGON_PRIVATE_KEY || ''],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY || ''],
      // gas: 5000000,
      // gasPrice: 8000000000,
    },
    bscTestnet: {
      url: process.env.BSCTESTNET_RPC_URL,
      accounts: [process.env.BSCTESTNET_PRIVATE_KEY || ''],
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.MUMBAI_PRIVATE_KEY || ''],
    },
    ethereum: {
      url: process.env.ETHEREUM_RPC_URL,
      accounts: [process.env.ETHEREUM_PRIVATE_KEY || ''],
    },
  },
};

export default config;
