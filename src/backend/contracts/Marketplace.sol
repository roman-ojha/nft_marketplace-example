// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// import ERC721 interface
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// implement a reentrancy guard contract that will protect the marketplace from reentrancy attacks
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    // State variable

    // fee taken by the deployer
    address payable public immutable feeAccount; // the account that receives fees
    uint256 public immutable feePercent; // the fee percentage on sales
    // immutable means that can't change after they got assigned
    uint256 public itemCount;

    constructor(uint256 _feePercent) {
        // assigning to 'feeAccount' & 'feePercentage' while contract is been deployed
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // function to list NFTs for sale
}
