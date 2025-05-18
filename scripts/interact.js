const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Interacting with contract using the account:", deployer.address);

  // Get the contract instance
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("Please set CONTRACT_ADDRESS in your .env file");
    process.exit(1);
  }

  console.log(`Using contract at address: ${contractAddress}`);
  const PoetryNFT = await hre.ethers.getContractFactory("PoetryNFT");
  const poetryNFT = await PoetryNFT.attach(contractAddress);

  // Display contract info
  console.log("\nContract Information:");
  console.log("Name:", await poetryNFT.name());
  console.log("Symbol:", await poetryNFT.symbol());
  console.log("Current Token ID:", (await poetryNFT.getCurrentTokenId()).toString());
  console.log("Max Poem Length:", (await poetryNFT.maxPoemLength()).toString());
  console.log("Paused:", await poetryNFT.paused());

  // Publish a poem
  const args = process.argv.slice(2);
  const command = args[0] || "";

  if (command === "publish") {
    const poemText = args[1] || "This is a default test poem published via script.";
    console.log("\nPublishing poem:", poemText);

    try {
      const tx = await poetryNFT.publishPoem(poemText);
      console.log("Transaction hash:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);
      
      // Find and parse the PoemPublished event
      const event = receipt.events.find(e => e.event === "PoemPublished");
      if (event) {
        const tokenId = event.args.tokenId.toString();
        console.log("\nSuccess! Poem published as NFT #" + tokenId);
        console.log("Owner:", await poetryNFT.ownerOf(tokenId));
        console.log("Token URI:", await poetryNFT.tokenURI(tokenId));
      }
    } catch (error) {
      console.error("Error publishing poem:", error.message);
    }
  } 
  else if (command === "get") {
    const tokenId = args[1];
    if (!tokenId) {
      console.error("Please provide a token ID");
      process.exit(1);
    }

    try {
      const poemText = await poetryNFT.getPoemText(tokenId);
      console.log(`\nPoem #${tokenId}:`);
      console.log("-".repeat(40));
      console.log(poemText);
      console.log("-".repeat(40));
      console.log("Owner:", await poetryNFT.ownerOf(tokenId));
    } catch (error) {
      console.error("Error retrieving poem:", error.message);
    }
  }
  else if (command === "setMaxLength" && args[1]) {
    try {
      const newLength = parseInt(args[1]);
      const tx = await poetryNFT.setMaxPoemLength(newLength);
      await tx.wait();
      console.log(`Maximum poem length updated to ${newLength} characters`);
    } catch (error) {
      console.error("Error updating max length:", error.message);
    }
  }
  else if (command === "setPaused" && (args[1] === "true" || args[1] === "false")) {
    try {
      const paused = args[1] === "true";
      const tx = await poetryNFT.setPaused(paused);
      await tx.wait();
      console.log(`Contract paused state set to: ${paused}`);
    } catch (error) {
      console.error("Error updating paused state:", error.message);
    }
  }
  else {
    console.log("\nAvailable Commands:");
    console.log("  publish [poem text] - Publish a new poem as NFT");
    console.log("  get [tokenId] - Get the poem text for a specific token ID");
    console.log("  setMaxLength [length] - Set the maximum poem length (owner only)");
    console.log("  setPaused [true|false] - Set the paused state (owner only)");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });