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
  "https://necessary-newest-waterfall.quiknode.pro/048d029a37818e6a8dfb4dc4eeeebc8db889913e/";
const provider = new ethers.providers.JsonRpcProvider(node);

function Index({ remainingBidsJson, blockData, builderProfit }) {
  console.log(remainingBidsJson)
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
        label: "Margin lost by %",
        data: bidData.map((label) =>
        Math.abs(((label.blocknativeBid-label.winningBid)/ label.winningBid) * 100)
        // Math.abs(((label.secondHighBid - label.value) / label.value) * 100)
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
          minInlineSize: "fit-content",
        }}
      >
       <header style={titleStyle}>
          <p>DreamBoat Won Blocks</p>
        </header>
        {/* <div style={accountDataBox}>
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
        </div> */}
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
  console.log('hello')
  const bidArray = [];
  const builder_pubkey_flashbots= "0xb7535857fb9559a6858fadecb069b8430053d02e8d5fc35ebde576f8d28c8f3b10e1316ad9a3f13fb80ad5a27dd293f6"
  const url = `https://boost-relay.flashbots.net/relay/v1/data/bidtraces/proposer_payload_delivered`;
  const blocknativeFlashbotsBuilderBids= `https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received?builder_pubkey=${builder_pubkey_flashbots}`
  fetch(blocknativeFlashbotsBuilderBids).then(response => response.json()).then(response => console.log(response.slot))
  const arrayOfBlocksWon = await fetch(`https://boost-relay.flashbots.net/relay/v1/data/bidtraces/proposer_payload_delivered`).then(response => response.json())
  console.log(arrayOfBlocksWon)
  // console.log(arrayOfBlocksWon)
  for (var x = 0; x < 40; x++) {
    const bids = [];
    const currentSlotBlocknativeBid=await fetch(`https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received?builder_pubkey=${builder_pubkey_flashbots}&slot=${arrayOfBlocksWon[x].slot}`)
    .then(response =>(response.json()))
    // console.log("higher", currentSlotBlocknativeBid)
    if(currentSlotBlocknativeBid.length === 0){
      bidArray.push(
        { slot: arrayOfBlocksWon[x].slot,
          blocknativeBid: 0,
          winningBid: arrayOfBlocksWon[x].value,
        inTime: "false",
        blockSubmitted: "no block submitted",
      builder_address: arrayOfBlocksWon[x].builder_pubkey})
    }
    if(currentSlotBlocknativeBid != [] && currentSlotBlocknativeBid != undefined)
    {
      // console.log('if', currentSlotBlocknativeBid)
      const winningBlock = await fetch(`https://boost-relay.flashbots.net/relay/v1/data/bidtraces/proposer_payload_delivered?slot=${arrayOfBlocksWon[x].slot}`).then(response => response.json())
      const winningBlockHash = winningBlock[0]?.block_hash;

      const winningBidTS = await fetch(`https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received?block_hash=${winningBlockHash}`)
      .then(response =>(response.json()))
      .then(response => response[0].timestamp_ms)
      for(var i = 0; i<currentSlotBlocknativeBid.length - 1; i++){
        if(currentSlotBlocknativeBid[x]?.timestamp_ms <= winningBidTS) {
          console.log('wonbid', currentSlotBlocknativeBid[x].slot)
          bidArray.push(
            { slot: winningBlock[0].slot,
              blocknativeBid: currentSlotBlocknativeBid[x].value,
              winningBid: winningBlock[0].value,
            inTime: "true",
            blockSubmitted:"Submitted",
            builder_address: winningBlock[0].builder_pubkey
          }
              )
              break;
              // console.log(bids, "bids")
            } else if(i == currentSlotBlocknativeBid.length-1) {
              bidArray.push(
                { slot: winningBlock[0].slot,
                  blocknativeBid: currentSlotBlocknativeBid[x].value,
                  winningBid: winningBlock[0].value,
                inTime: "false",
                blockSubmitted:"Late",
                builder_address: winningBlock[0].builder_pubkey
              })
            } 
        }
      }
  }


  return bidArray;
}

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
  const gnosisWalletSafe = await provider.getBalance(
    "0xA273ee8946e0f058bdFAfD6Ae04b1517F5245f11"
  );
  const walletBalanceConvertedToEther = ethers.utils.formatEther(walletBalance);
  const gnosisWalletSafeConvertedToEther =
    ethers.utils.formatEther(gnosisWalletSafe);
  const startingBalanceInEther = 1.5;
  console.log(walletBalanceConvertedToEther, gnosisWalletSafeConvertedToEther);
  const balanceDiff =
    parseFloat(walletBalanceConvertedToEther) +
    parseFloat(gnosisWalletSafeConvertedToEther) -
    startingBalanceInEther;
  return balanceDiff;
};

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
