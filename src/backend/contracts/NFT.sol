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
