import axios from "axios";

import React, { useState, useEffect } from "react";
import { columns } from "../components/columns";
import DataTable from "react-data-table-component";
import Web3 from "web3";

function Index({ remainingBidsJson }) {
  console.log(remainingBidsJson);
  const [bidData, setBidData] = useState(remainingBidsJson);
  const [isLoaded, setIsLoaded] = useState(true);
  const [secondBid, setSecondBid] = useState([]);

  const w3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://necessary-newest-waterfall.quiknode.pro/048d029a37818e6a8dfb4dc4eeeebc8db889913e/"
    )
  );

  const titleStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  };

  return (
    bidData &&
    isLoaded && (
      <div>
        <header style={titleStyle}>
          <p>DreamBoat Won Blocks</p>
        </header>
        <div className="container">
          <DataTable columns={columns} data={bidData} />
        </div>
      </div>
    )
  );
}
const w3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://necessary-newest-waterfall.quiknode.pro/048d029a37818e6a8dfb4dc4eeeebc8db889913e/"
  )
);
const getSecondHighestBids = async () => {
  const bidArray = [];
  const url = `https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?limit=20`;
  const arrayOfBlocksWon = await axios({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "get",
    url: url,
  });

  for (var x = 0; x < arrayOfBlocksWon?.data.length; x++) {
    const bids = [];
    const winningBlockHash = await axios(
      `https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?slot=${arrayOfBlocksWon.data[x].slot}`
    ).then((response) => response?.data[0]?.block_hash);
    const winningBlockBid = await axios(
      `https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon.data[x].slot}`
    ).then((response) =>
      response.data.filter((block) =>
        block.block_hash === winningBlockHash ? block.timestamp : null
      )
    );
    const ts = (await w3.eth.getBlock(winningBlockHash)).timestamp;
    var flashbotsBid = await axios
      .get(
        `https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon.data[x].slot}`,
        {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "identity",
          },
        }
      )
      .then((response) =>
        bids.push(filterForHighestBids(response?.data, ts, winningBlockBid))
      );
    var bloxRoutebid = await axios(
      `https://bloxroute.max-profit.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon.data[x].slot}`
    ).then((response) =>
      bids.push(filterForHighestBids(response?.data, ts, winningBlockBid))
    );
    // var bloxrouteEthicalBid = await axios(`https://bloxroute.ethical.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
    // var bloxrouteRegulatedBid= await axios(`https://bloxroute.regulated.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
    // var edenBid= await axios(`https://relay.edennetwork.io/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
    const indexOfSlot = arrayOfBlocksWon.data.findIndex(
      ({ slot }) => slot === arrayOfBlocksWon.data[x].slot
    );
    const updatedTodo = {
      ...arrayOfBlocksWon.data[indexOfSlot],
      secondHighBid: Math.max(...bids),
    };
    arrayOfBlocksWon.data[indexOfSlot] = updatedTodo;
    bidArray.push(updatedTodo);
  }
  return bidArray;
};
const filterForHighestBids = (bidArray, ts, winningBlockBid) => {
  if (bidArray.length > 0) {
    const bidArrayFiltered = bidArray.filter(
      (response) => response.timestamp < ts
    );
    return bidArrayFiltered.length > 0 ? bidArrayFiltered[0].value : 0;
  } else {
    return 0;
  }
};
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  // Fetch data from external API
  const remainingBidsJson = await getSecondHighestBids();
  // Pass data to the page via props
  return { props: { remainingBidsJson } };
}
export default Index;
