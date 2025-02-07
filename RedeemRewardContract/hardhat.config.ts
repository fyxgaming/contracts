import '@oasisprotocol/sapphire-hardhat';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

const TEST_HDWALLET = {
  mnemonic:
    'test test test test test test test test test test test junk',
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: '',
}

const accounts = process.env.SAPPHIRE_TESTNET_PRIVATE_KEY ?  [process.env.SAPPHIRE_TESTNET_PRIVATE_KEY]: TEST_HDWALLET;
const accountsProd = process.env.SAPPHIRE_MAINNET_PRIVATE_KEY ?  [process.env.SAPPHIRE_MAINNET_PRIVATE_KEY]: TEST_HDWALLET;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337, // @see https://hardhat.org/metamask-issue.html
    },
    hardhat_local:{
      url: 'http://127.0.0.1:8545/',
    },
    'sapphire':{
      url: 'https://sapphire.oasis.io',
      chainId: 0x5afe,
      accounts:accountsProd
    },
    'sapphire_testnet':{
      url: 'https://testnet.sapphire.oasis.dev',
      chainId: 0x5aff,
      accounts
    },
    'sapphire_localnet':{
      url: 'http://127.0.0.1:8545',
      chainId: 0x5afd,
      accounts
    },
  },
};

export default config;