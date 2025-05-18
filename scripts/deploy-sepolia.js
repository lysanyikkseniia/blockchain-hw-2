const hre = require("hardhat");

async function main() {
  try {
    console.log("Deploying PoetryNFT to Sepolia testnet...");
    
    // Check environment variables
    if (!process.env.API_URL || !process.env.PRIVATE_KEY) {
      throw new Error("Missing environment variables. Make sure API_URL and PRIVATE_KEY are set in your .env file");
    }
    
    // Get the signer account
    const [deployer] = await hre.ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const balance = await deployer.getBalance();
    
    console.log(`Deploying from address: ${deployerAddress}`);
    console.log(`Account balance: ${hre.ethers.utils.formatEther(balance)} ETH`);
    
    if (balance.eq(0)) {
      throw new Error("Deployer account has no ETH. Please fund your account with Sepolia testnet ETH to proceed.");
    }
    
    // Deploy the contract
    const PoetryNFT = await hre.ethers.getContractFactory("PoetryNFT");
    const poetryNFT = await PoetryNFT.deploy();
    await poetryNFT.deployed();
    
    console.log(`\nPoetryNFT deployed successfully!`);
    console.log(`Contract address: ${poetryNFT.address}`);
    console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${poetryNFT.address}`);
    
    // Wait for 5 block confirmations
    console.log("\nWaiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Verify the contract if Etherscan API key is available
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("\nVerifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: poetryNFT.address,
          constructorArguments: [],
        });
        console.log("Contract verified successfully!");
      } catch (error) {
        if (error.message.includes("already verified")) {
          console.log("Contract is already verified!");
        } else {
          console.error("Error verifying contract:", error.message);
        }
      }
    } else {
      console.log("\nSkipping contract verification: ETHERSCAN_API_KEY not found in .env");
    }
    
    // Suggest next steps
    console.log("\n----------");
    console.log("Next steps:");
    console.log("1. Add this line to your .env file:");
    console.log(`   CONTRACT_ADDRESS="${poetryNFT.address}"`);
    console.log("2. Interact with your contract:");
    console.log("   npm run interact -- publish \"Your poem text here\"");
    console.log("----------");
    
    return poetryNFT.address;
  } catch (error) {
    console.error("\n⚠️ DEPLOYMENT FAILED ⚠️");
    console.error(error);
    process.exitCode = 1;
  }
}

main();