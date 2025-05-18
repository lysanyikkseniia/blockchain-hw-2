# PoetryNFT - Publishing Poems as NFTs on Ethereum Blockchain

This project implements a smart contract for publishing poems as NFTs on the Ethereum blockchain. Each poem is minted as an NFT and transferred to the author's wallet, with the poem's text stored on-chain.
**Contract Address (Sepolia Testnet)**: `0x47791fA06De40F4bA6eC8C8C2Fb0eEB234482431`

**Etherscan Link**: [https://sepolia.etherscan.io/address/0x47791fA06De40F4bA6eC8C8C2Fb0eEB234482431](https://sepolia.etherscan.io/address/0x47791fA06De40F4bA6eC8C8C2Fb0eEB234482431)

The `PoetryNFT` contract provides the following functionality:

- Any user can publish a poem as an NFT, which then becomes their property
- Poem text and metadata are stored entirely on-chain using Base64 encoding
- The contract owner can change the maximum poem length and pause the contract if needed

The contract emits the following events:
- `PoemPublished(address indexed author, uint256 indexed tokenId, string poemText)`: Triggered when a poem is published
- `PausedStateChanged(bool paused)`: Triggered when the contract's pause state changes

Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   git clone [repository-url]
   cd hello-world
   npm install
   ```

2. Create and set up the .env file:
   ```bash
   cp .env.example .env
   # Edit .env file with your values
   ```

3. The .env file should include:
   ```
   API_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY"
   PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY_WITHOUT_0x"
   ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
   ```

Compilation and Deployment

1. Compile the contract:
   ```bash
   npm run compile
   ```

2. Deploy to the Sepolia testnet:
   ```bash
   npm run deploy:sepolia
   ```

3. After successful deployment, you will see:
   - Contract address
   - Etherscan link
   - Verification status

4. Add the contract address to your .env file:
   ```
   CONTRACT_ADDRESS="0xYOUR_CONTRACT_ADDRESS"
   ```

```bash
# View contract information
npm run interact

# Publish a poem
npm run interact -- publish "Your poem text here"

# Get a poem by token ID
npm run interact -- get 0

# Set maximum poem length (owner only)
npm run interact -- setMaxLength 1000

# Set paused state (owner only)
npm run interact -- setPaused true
```

Run tests to verify the contract functionality:

```bash
npx hardhat test test/Simple.test.js --network hardhat
```
Main Contract Functions:

```solidity
// Publish a poem as an NFT
function publishPoem(string memory poemText) public whenNotPaused returns (uint256)

// Retrieve a poem's text by token ID
function getPoemText(uint256 tokenId) public view returns (string memory)

// Get the current token ID counter
function getCurrentTokenId() public view returns (uint256)

// Set the maximum poem length (owner only)
function setMaxPoemLength(uint256 newMaxLength) public onlyOwner

// Set the contract's pause state (owner only)
function setPaused(bool _paused) public onlyOwner
```