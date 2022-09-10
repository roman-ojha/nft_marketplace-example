// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

/*
    *) ERC-721:
        -> https://docs.openzeppelin.com/contracts/4.x/erc721
        -> ERC721 Standard define the set of all function that a NFTs contract should have in minimum
        -> This standard is design so that any NFT contract is compatible to any Dapps and wallets
        -> ERC-721 Function / Api
        -> https://docs.openzeppelin.com/contracts/4.x/api/token/erc721
        -> this contract have a lot of function we don't need a lot of function for this project but that function that we have to understand for this project are:
            1) transferFrom(from, to, tokenId)
                -> this function will transfer NFTs(tokenId) from one account to another
            2) approve(address to, uint256 tokenId)
                -> Give permission to transfer tokenId token to another account. 
                -> whenever we transfer NFTs to a marketplace the user have to call this 'approve' function first
*/

// Import ERC-721 URI storage contract from OpenZeppelin library
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    // first we have to Inherit 'ERC-21' contract into our Contract

    // state variable to keep track of number of tokens
    uint256 public tokenCount;

    constructor() ERC721("DApp NFT", "DAPP") {
        // we will first call the constructor of the 'ERC721' smart contract
        // ERC721("<name_of_the_NFT> <symbol_of_the_NFT>","<name_of_the_NFT_on_caps")
    }

    // function to mint New NFTs
    function mint(string memory _tokenURI) external returns (uint256) {
        // _tokenURI: metadata of NFT (content of the NFT that we can find on IPFS)
        //

        tokenCount++;
        // Mint new NFT
        _safeMint(msg.sender, tokenCount);
        // _safeMint(<sender>,<tokenId>)

        // function to set TokenURI
        _setTokenURI(tokenCount, _tokenURI);

        // function return current token count which is correspond to new Id of the invented token
        return tokenCount;
    }
}
