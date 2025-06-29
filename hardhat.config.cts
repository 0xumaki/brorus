require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/48ea4bb6184940eca8870e134d4711df",
      accounts: ["f699108536c289306018cee86cc7e70f135bd0400f7de12d5e63263353138e6e"],
    },
  },
}; 