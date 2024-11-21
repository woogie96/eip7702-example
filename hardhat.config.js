require('@nomicfoundation/hardhat-network-helpers');
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    mekong: {
      url: process.env.RPC_URL
    },
  },
};
