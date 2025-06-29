const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CCIP Token Sender contract...");

  // CCIP Router addresses for testnets
  const CCIP_ROUTER_ADDRESSES = {
    sepolia: "0xD0daae2231E9CB96b94C8512223533293C3693Bf",
    mumbai: "0x70499c328e1E2a3c41108bd3730F6670a44595D1",
  };

  // LINK token addresses for testnets
  const LINK_TOKEN_ADDRESSES = {
    sepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    mumbai: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  };

  // Get the contract factory
  const CCIPTokenSender = await ethers.getContractFactory("CCIPTokenSender");

  // Deploy on Sepolia
  console.log("Deploying on Sepolia...");
  const sepoliaSender = await CCIPTokenSender.deploy(
    CCIP_ROUTER_ADDRESSES.sepolia,
    LINK_TOKEN_ADDRESSES.sepolia
  );
  await sepoliaSender.deployed();

  console.log("CCIP Token Sender deployed on Sepolia at:", sepoliaSender.address);

  // Deploy on Mumbai (if you have Mumbai network configured)
  try {
    console.log("Deploying on Mumbai...");
    const mumbaiSender = await CCIPTokenSender.deploy(
      CCIP_ROUTER_ADDRESSES.mumbai,
      LINK_TOKEN_ADDRESSES.mumbai
    );
    await mumbaiSender.deployed();
    console.log("CCIP Token Sender deployed on Mumbai at:", mumbaiSender.address);
  } catch (error) {
    console.log("Mumbai deployment skipped (network not configured)");
  }

  console.log("Deployment completed!");
  console.log("Sepolia CCIP Token Sender:", sepoliaSender.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 