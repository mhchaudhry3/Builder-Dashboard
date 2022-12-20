import axios from "axios";
import React, { useState } from "react";
import { columns } from "../components/columns";
import DataTable from "react-data-table-component";
import { ethers } from "ethers";
import {
  RowStyle,
  tableStyle,
  accountDataBox,
  titleStyle,
  TitleHeader,
} from "../components/styles";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const node =
  "https://white-hidden-brook.discover.quiknode.pro/fd442d08c67ae0a6267689dcf8d3f3e8c08f4aa5/";
const provider = new ethers.providers.JsonRpcProvider(node);

function Index({ remainingBidsJson, blockData, builderProfit }) {
  const [bidData, setBidData] = useState(remainingBidsJson);
  const [isLoaded, setIsLoaded] = useState(true);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Block Win by %",
      },
    },
  };

  const data = {
    labels: bidData.map((data) => data.slot),
    datasets: [
      {
        label: "Margin win by %",
        data: bidData.map((label) =>
          Math.abs(((label.secondHighBid - label.value) / label.value) * 100)
        ),
        borderColor: "rgb(30,144,255)",
      },
    ],
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  return (
    bidData &&
    isLoaded && (
      <div
        style={{
          clear: "left",
          backgroundColor: "black",
          minInlineSize: "fit-content"
        }}
      >
        <header style={titleStyle}>
          <p>DreamBoat Won Blocks</p>
        </header>
        <div style={accountDataBox}>
          <div>
            <div style={TitleHeader}>Current BaseFee</div>
            <div style={RowStyle}>
              <div>BaseFee: {blockData.blockPrices[0].baseFeePerGas}</div>
            </div>
          </div>
          <div>
            <div style={TitleHeader}>Builder Profit(eth)</div>
            <div style={RowStyle}>Eth: {builderProfit.toFixed(7)}</div>
          </div>
        </div>
        <div style={tableStyle}>
          <div>
            <DataTable
              style={{ overflow: "wrap" }}
              columns={columns}
              data={bidData}
            />
            <Line options={options} data={data} />
          </div>
        </div>
      </div>
    )
  );
}

const secondHighestBids = async () => {
  const bidArray = [];
  const url = `https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?limit=21`;
  const arrayOfBlocksWon = await axios({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "get",
    url: url,
  });
  for (var x = 0; x < arrayOfBlocksWon?.data.length - 1; x++) {
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
    const ts = winningBlockBid[0].timestamp;
    var flashbotsBid = await fetch(
      `https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon.data[x].slot}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(
        (resp) => resp.json() // this returns a promise
      )
      .then((response) =>
        bids.push(filterForHighestBids(response, ts, winningBlockBid))
      );
    var bloxRoutebid = await fetch(
      `https://bloxroute.max-profit.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon.data[x].slot}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(
        (resp) => resp.json() // this returns a promise
      )
      .then((response) =>
        bids.push(filterForHighestBids(response, ts, winningBlockBid))
      );
    // var bloxrouteEthicalBid = await axios(`https://bloxroute.ethical.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
    // var bloxrouteRegulatedBid= await axios(`https://bloxroute.regulated.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
    // var edenBid= await axios(`https://relay.edennetwork.io/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
    const indexOfSlot = arrayOfBlocksWon.data.findIndex(
      ({ slot }) => slot === arrayOfBlocksWon.data[x].slot
    );
    const sinceLastWonSlot =
      arrayOfBlocksWon.data[x].slot - arrayOfBlocksWon.data[x + 1].slot;
    const updatedTodo = {
      ...arrayOfBlocksWon.data[indexOfSlot],
      secondHighBid: Math.max(...bids),
      sinceLastWonBlock: sinceLastWonSlot,
    };
    arrayOfBlocksWon.data[indexOfSlot] = updatedTodo;
    bidArray.push(updatedTodo);
  }
  return bidArray;
};
const filterForHighestBids = (bidArray, ts, winningBlockBid) => {
  if (bidArray !== null) {
    if (bidArray?.length > 0) {
      const bidArrayTimeFiltered = bidArray?.filter(
        (response) =>
          response.timestamp < ts && response.value < winningBlockBid[0].value
      );
      return bidArrayTimeFiltered?.length > 0
        ? bidArrayTimeFiltered[0].value
        : 0;
    } else {
      return 0;
    }
  }
};

const getBlockPrices = async () => {
  const blockPriceResponse = await fetch(
    `https://api.blocknative.com/gasprices/blockprices`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((resp) => resp.json())
    .then((result) => {
      return result;
    });
  return blockPriceResponse;
};

const getBlocknativeBuilderBalance = async () => {
  const walletBalance = await provider.getBalance(
    "0xBaF6dC2E647aeb6F510f9e318856A1BCd66C5e19"
  );
  const walletBalanceConvertedToEther = ethers.utils.formatEther(walletBalance);
  const startingBalanceInEther = 1.5;
  const balanceDiff = walletBalanceConvertedToEther - startingBalanceInEther;
  return balanceDiff;
};

const getCurrentSlotNumber = async () => {};

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const builderProfit = await getBlocknativeBuilderBalance();
  // Fetch data from external API
  const remainingBidsJson = await secondHighestBids();
  const blockData = await getBlockPrices();
  // Pass data to the page via props
  return {
    props: {
      remainingBidsJson,
      blockData,
      builderProfit,
    },
  };
}
export default Index;
