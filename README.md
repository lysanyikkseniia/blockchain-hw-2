Develop own version of publishing poetry text in Ethereum blockchain
Based on https://docs.alchemy.com/docs/hello-world-smart-contract
Functional requirements: NFT need to be declared, issued and returned as
a result of publishing to author.

`deploy.js` is based on tutorial with added `await poetryNFT.deployTransaction.wait()` line, which ensures that the deployment process is complete.

### Smart Contract

For NFT we use `ERC721` implementation.

In `PoetryNFT.sol` contract we have private variable `_tokenIdCounter`, which ensures that each minted NFT has a unique identifier.

When a new poem is published and minted as an NFT, a custom event gets emitted. It includes:
- `author`: The address of the NFT’s minter/owner (the sender of the transaction).
- `tokenId`: The unique ID of the minted NFT.
- `poemText`: The actual content of the poem (stored in the event, not on-chain).
This function mints the NFT and transfers it to the author's wallet. 

Anyone can publish a poem as an NFT using `publishPoem`. There is also a view function `getCurrentTokenId` to check the current value of the `_tokenIdCounter` (namely the ID of the next token to be minted). 

### Deployment instruction
`npm install --save-dev hardhat`
`npx hardhat`
`npm install dotenv`
`npm install @nomiclabs/hardhat-ethers ethers`

Create a `.env` file and add the required values:
`API_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY"
PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"`

`npx hardhat compile`
`npx hardhat run scripts/deploy.js --network sepolia`