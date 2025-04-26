// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract PoetryNFT is ERC721 {uint256 private _tokenIdCounter;

    event PoemPublished(address indexed author, uint256 indexed tokenId, string poemText);

    constructor() ERC721("PoetryNFT", "POEM") {}

    function publishPoem(string memory poemText) public returns (uint256) {uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _mint(msg.sender, tokenId);

        emit PoemPublished(msg.sender, tokenId, poemText);
        return tokenId;}

    function getCurrentTokenId() public view returns (uint256) {return _tokenIdCounter;}}