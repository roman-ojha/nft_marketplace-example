import React, { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Buffer } from "buffer";

// Setup IPFs:
// https://docs.infura.io/infura/networks/ipfs/how-to/make-requests#ipfs-http-client
// allow to update metadata about the newly created NFTs to IPFS for this component
const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const infuraProjectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;
const auth =
  "Basic " +
  Buffer.from(infuraProjectId + ":" + infuraProjectSecret).toString("base64");
// const client = ipfsHttpClient({
//   host: "localhost",
//   port: 5001,
//   protocol: "http",
// });
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const uploadToIPFS = async (event) => {
    // function to Upload metadata of item to IPFS

    event.preventDefault();

    // image file
    const file = event.target.files[0];

    if (typeof file !== "undefined") {
      // if file exist
      try {
        //  add file into client
        const result = await client.add(file);
        console.log(result);
        // store Image url to state
        setImage(`https://roman.infura-ipfs.io/ipfs/${result.path}`);
        console.log(`https://roman.infura-ipfs.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };

  const createNFT = async () => {
    // function to create NFT

    // first this will upload all the metadata of the item to IPFs
    if (!image || !price || !name || !description) return;

    // after done interacting with IPFs this function will Mint and then List the NFTs for sell on the marketplace
    try {
      console.log({ image, price, name, description });

      // add metadata to IPFS into JSON object format
      const result = await client.add(
        JSON.stringify({ image, price, name, description })
      );

      console.log(result);

      // call the function that will mint the NFT
      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };

  // this function will mint the nft and the list that NFT as item
  const mintThenList = async (result) => {
    const uri = `https://roman.infura-ipfs.io/ipfs/${result.path}`;
    console.log(uri);
    // mint nft
    await (await nft.mint(uri)).wait();
    // get tokenId of new nft
    const id = await nft.tokenCount();
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            {/* For that will take metadata to create New NFTs */}
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(parseInt(e.target.value))}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
