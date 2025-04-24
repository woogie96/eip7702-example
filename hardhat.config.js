require('@nomicfoundation/hardhat-network-helpers');
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      evmVersion: "prague"
    }
  },
  networks: {
    sepolia: {
      url: process.env.RPC_URL
    },
  },
};
