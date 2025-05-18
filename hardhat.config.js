require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
   solidity: "0.8.20",
   defaultNetwork: "hardhat",
   networks: {
      hardhat: {
         chainId: 31337,
         gas: 12000000,
         blockGasLimit: 12000000,
         allowUnlimitedContractSize: true,
         accounts: {
           count: 10,
           initialBalance: "10000000000000000000000", // 10000 ETH
           accountsBalance: "10000000000000000000000"
         }
      },
      sepolia: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
   etherscan: {
      apiKey: ETHERSCAN_API_KEY
   },
   paths: {
      artifacts: "./artifacts",
      cache: "./cache",
      sources: "./contracts",
      tests: "./test"
   },
   mocha: {
      timeout: 60000
   }
};