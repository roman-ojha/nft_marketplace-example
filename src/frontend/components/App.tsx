import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "./App.css";

// Import contract ABI and its address
import MarketplaceAbi from "../contractsData/Marketplace.json";
import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import NFTAbi from "../contractsData/NFT.json";
import NFTAddress from "../contractsData/NFT-address.json";

// so here we will use ether to connect to metamask and metamask is connect to blockchain
// we can create new network inside metamask to connect to hardhat development blockchain node
// so we don't have to directly connect to blockchain from ethers.js
// we will use metamask as ethereum provider
// there are different type of provider but provider offered by metamask is called web3Provider
//
import { ethers } from "ethers";

// import Component
import Navigation from "./Navbar";
import Home from "./Home";
import Create from "./Create";
import MyListedItems from "./MyListenItems";

function App() {
  // account will contain the account that is connected to the app
  const [account, setAccount] = useState(null);

  // store each contract instance as state
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  // loading state
  const [loading, setLoading] = useState(true);

  // function to make connection to the blockchain
  const web3Handler = async (): Promise<void> => {
    // Get Provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // windows.ethereum is the object injected into the browser by metamask

    // Get account listed on Metamask wallet
    const accounts = await window.ethereum.request({
      // first account listed on list of account is the account that is connected to the app
      method: "eth_requestAccounts",
    });

    // store connected account
    setAccount(accounts[0]);

    // get the signer of the connected account from the provider
    const signer = provider.getSigner();

    loadContract(signer);
  };

  const loadContract = async (signer: ethers.providers.JsonRpcSigner) => {
    // function to load the contract instance

    // Fetch/Get the deployed copies of contracts
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );
    // Contract(<contract_address>,<abi>,<singer>);
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);

    // set loading false when contract had loaded
    setLoading(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} />
        {loading ? (
          // while loading load this component
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
            }}
          >
            <Spinner animation="border" style={{ display: "flex" }} />
            <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
          </div>
        ) : (
          // after get loaded open routed component
          <Routes>
            <Route
              path="/"
              element={<Home marketplace={marketplace} nft={nft} />}
            />
            <Route
              path="/create"
              element={<Create marketplace={marketplace} nft={nft} />}
            />
            <Route
              path="/my-listed-items"
              element={
                <MyListedItems
                  marketplace={marketplace}
                  nft={nft}
                  account={account}
                />
              }
            />
            {/* <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } /> */}
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
