// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title PoetryNFT
 * @dev A contract for publishing poems as NFTs with on-chain metadata
 */
contract PoetryNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;
    
    // State variables
    uint256 private _tokenIdCounter;
    uint256 public maxPoemLength = 500; // Maximum length of poem in characters
    bool public paused = false; // Emergency pause functionality
    
    // Mapping to store poem text
    mapping(uint256 => string) private _poemTexts;
    
    // Events
    event PoemPublished(address indexed author, uint256 indexed tokenId, string poemText);
    event PausedStateChanged(bool paused);
    
    /**
     * @dev Constructor initializes the NFT collection
     */
    constructor() ERC721("PoetryNFT", "POEM") Ownable(msg.sender) {}
    
    /**
     * @dev Modifier to check if contract is not paused
     */
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    /**
     * @dev Publish a poem and mint an NFT to the caller
     * @param poemText The text of the poem to publish
     * @return tokenId The ID of the minted NFT
     */
    function publishPoem(string memory poemText) public whenNotPaused returns (uint256) {
        require(bytes(poemText).length > 0, "Poem text cannot be empty");
        require(bytes(poemText).length <= maxPoemLength, "Poem exceeds maximum length");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        
        _poemTexts[tokenId] = poemText;
        _safeMint(msg.sender, tokenId);
        
        // Generate and set token URI
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Poetry NFT #', 
                        tokenId.toString(), 
                        '", "description": "A poem published on the blockchain", "poem": "', 
                        poemText, 
                        '"}'
                    )
                )
            )
        );
        
        string memory uri = string(abi.encodePacked("data:application/json;base64,", json));
        _setTokenURI(tokenId, uri);
        
        emit PoemPublished(msg.sender, tokenId, poemText);
        return tokenId;
    }
    
    /**
     * @dev Get poem text by tokenId
     * @param tokenId The ID of the poem to retrieve
     * @return The poem text
     */
    function getPoemText(uint256 tokenId) public view returns (string memory) {
        require(tokenId < _tokenIdCounter, "Poem does not exist");
        return _poemTexts[tokenId];
    }
    
    /**
     * @dev Get the current token ID counter
     * @return The current token ID counter
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Set the maximum allowed poem length
     * @param newMaxLength The new maximum poem length
     */
    function setMaxPoemLength(uint256 newMaxLength) public onlyOwner {
        require(newMaxLength > 0, "Max length must be positive");
        require(newMaxLength <= 10000, "Max length too large");
        maxPoemLength = newMaxLength;
    }
    
    /**
     * @dev Toggle the paused state of the contract
     * @param _paused New paused state
     */
    function setPaused(bool _paused) public onlyOwner {
        paused = _paused;
        emit PausedStateChanged(_paused);
    }
}