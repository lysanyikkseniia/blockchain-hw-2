import { ethers } from "hardhat";

async function main() {
    const PoetryNFT = await ethers.getContractFactory("PoetryNFT");

   // Start deployment, returning a promise that resolves to a contract object
    const poetryNFT = await PoetryNFT.deploy();
    await poetryNFT.deployTransaction.wait(); // add this

    console.log("PoetryNFT deployed to address:", poetryNFT.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
