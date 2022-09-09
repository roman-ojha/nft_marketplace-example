import React, { useState } from "react";
import logo from "./logo.png";
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
    <div>
      <Navigation web3Handler={web3Handler} account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mx-auto mt-5">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} className="App-logo" alt="logo" />
              </a>
              <h1 className="mt-5">Dapp University Starter Kit</h1>
              <p>
                Edit <code>src/frontend/components/App.js</code> and save to
                reload.
              </p>
              <a
                className="App-link"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                LEARN BLOCKCHAIN{" "}
                <u>
                  <b>NOW! </b>
                </u>
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
