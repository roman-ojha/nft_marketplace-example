// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// import ERC721 interface
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// implement a reentrancy guard contract that will protect the marketplace from reentrancy attacks
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard

contract Marketplace is ReentrancyGuard {
    // State variable

    // fee taken by the deployer
    address payable public immutable feeAccount; // the account that receives fees
    uint256 public immutable feePercent; // the fee percentage on sales
    // immutable means that can't change after they got assigned

    uint256 public itemCount;
    // marketPlace NFTs Items
    struct Item {
        uint256 itemId;
        //  Instance of the nft contract that we imported
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool sold;
    }

    // need to create the event so that we can listen to it
    event Offered(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );

    // store all the item into mapping
    // itemId -> Item
    mapping(uint256 => Item) public items;

    constructor(uint256 _feePercent) {
        // assigning to 'feeAccount' & 'feePercentage' while contract is been deployed
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // function that make Item
    function makeItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant {
        // _nft: NFT contract instance of the nft to be listed
        // nonReentrant: modifier prevent bad guy for calling makeItem function
        itemCount++;

        // Price should be greater then zero
        require(_price > 0, "Price must be greater than zero");

        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // transferFrom(<from_address>,<to_address>,<tokenId>);
        // in order for 'transferFrom' function to work, the caller of the makeItem function need to have Approved for this marketplace contract to transfer there nft on their behalf

        // add new item to items mapping
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        // we will also emit the event so that we can listen it after Item had been made
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    // function to list NFTs for sale
}
