// const {expect} = require("chai");

// describe("NFTMarketplace",function(){
//     let deployer,addr1,addr2,nft,marketplace
//     let feePercent = 1;

//     beforeEach(await function(){
//         // first need to get contract factory
//         const NFT = await ethers.getContractFactory("NFT");
//         const Marketplace = await ethers.getContractFactory("Marketplace");

//         // need to fetch the signers for each of these test account on hardhat development blockchain
//         [deployer,addr1,addr2] = await ethers.getSigners();

//         // deploy contract
//         nft = await NFT.deploy();
//         marketplace = await Marketplace.deploy(feePercent);

//     });

//      describe("Deployment", function () {
//         it("Should track name and symbol of the nft collection", async function () {
//         // This test expects the owner variable stored in the contract to be equal
//         // to our Signer's owner.
//         const nftName = "DApp NFT"
//         const nftSymbol = "DAPP"
//         expect(await nft.name()).to.equal(nftName);
//         expect(await nft.symbol()).to.equal(nftSymbol);
//         });

//         // it("Should track feeAccount and feePercent of the marketplace", async function () {
//         // expect(await marketplace.feeAccount()).to.equal(deployer.address);
//         // expect(await marketplace.feePercent()).to.equal(feePercent);
//         // });
//     });

// })
