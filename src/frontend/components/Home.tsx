import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button } from "react-bootstrap";

interface Item {
  itemId: number;
  //  Instance of the nft contract that we imported
  nft: any;
  tokenId: number;
  price: number;
  seller: string;
  sold: boolean;
}

interface ItemWithMetadata {
  itemId: number;
  seller: string;
  name: string;
  description: string;
  image: any;
  totalPrice: number;
}

const Home = ({ marketplace, nft }) => {
  // now here we need the 'marketplace' & 'nft' contract

  const [loading, setLoading] = useState(true);

  //   store all the items into state
  const [items, setItems] = useState<ItemWithMetadata[]>([]);

  // function to load Marketplace Items
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount();
    let items: ItemWithMetadata[] = [];
    for (let i = 1; i <= itemCount; i++) {
      // get the item one by one
      const item = await marketplace.items(i);
      //   also store item that are not sold
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);

        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();

        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);

        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }
    // set loading false after fetching all the items
    setLoading(false);
    // store all the items into state
    setItems(items);
  };

  const buyMarketItem = async (item: ItemWithMetadata): Promise<void> => {
    //   function by Bue MarketItem

    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    )
      // return transaction response we have to wait to get transaction confirmed
      .wait();

    // after that we will again reload marketplaceItems
    // which will remove recently purchased item from the marketplace
    loadMarketplaceItems();
  };

  useEffect(() => {
    //   load Marketplace items when load
    loadMarketplaceItems();
  }, []);

  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div className="flex justify-center">
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-grid">
                      {/* button to by market Item */}
                      <Button
                        onClick={() => buyMarketItem(item)}
                        variant="primary"
                        size="lg"
                      >
                        {/* show item total price in ETH */}
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
};
export default Home;
