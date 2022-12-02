import axios from 'axios'

import React, {useState, useEffect} from 'react'
import { columns } from '../components/columns'
import DataTable from 'react-data-table-component';
import Web3 from 'web3'

function Index({ blockNativeWonBlocksJson, remainingBidsJson }) {
  console.log(remainingBidsJson)
  const [data,setData] = useState(blockNativeWonBlocksJson)
  const [isLoaded, setIsLoaded] = useState(false)
  const [secondBid, setSecondBid] = useState([])

  const w3 = new Web3(new Web3.providers.HttpProvider("https://necessary-newest-waterfall.quiknode.pro/048d029a37818e6a8dfb4dc4eeeebc8db889913e/"))
  
  
  const getSecondHighestBid = async (arrayOfBlocksWon) => {
    const bidArray = []
    for(var x=0; x< arrayOfBlocksWon?.length; x++){
      const bids = []
      const winningBlockHash = await axios(`https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?slot=${arrayOfBlocksWon[x].slot}`).then(response => response?.data[0]?.block_hash)
      const winningBlockBid = await axios(`https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => response.data.filter(block =>block.block_hash===winningBlockHash ? block.timestamp: null))
      const ts = (await w3.eth.getBlock(winningBlockHash)).timestamp
      // var flashbotsBid= await axios(`https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => bids.push(filterForHighestBid(response?.data, ts, winningBlockBid)))
      var bloxRoutebid = await axios(`https://bloxroute.max-profit.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts, winningBlockBid[0].value))))
      console.log(bloxRoutebid)
      // var bloxrouteEthicalBid = await axios(`https://bloxroute.ethical.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
      // var bloxrouteRegulatedBid= await axios(`https://bloxroute.regulated.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
      // var edenBid= await axios(`https://relay.edennetwork.io/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
      const indexOfSlot = data.findIndex(({slot}) => slot === arrayOfBlocksWon[x].slot)
      const updatedTodo = {...data[indexOfSlot], secondHighBid: Math.max(...bids)};
      data[indexOfSlot] = updatedTodo;
      bidArray.push(updatedTodo)
    }
    setSecondBid(bidArray)
  }
  
  const filterForHighestBid = (bidArray, ts, winningBlockBid) => {
    if(bidArray.length > 0){
      const bidArrayFiltered = bidArray.filter(response => response.timestamp < ts)
      return bidArrayFiltered.length > 0 ? bidArrayFiltered[bidArrayFiltered.length-1].value : 0
    } else {
      return 0;
    }
    // const arrayOfBids = []
    // for(var i=0; i <bidArrayFiltered.length; i++) {
    //   if(bidArrayFiltered[i].value < winningBlockBid[0].value) {
    //     arrayOfBids.push(bidArrayFiltered[i].value)
    //   }
    // }
    // return (arrayOfBids.length>0 ? Math.max(...arrayOfBids) : 0)
  }
  
  useEffect(() =>{
    setIsLoaded(false)
    getSecondHighestBid(data)
    setIsLoaded(true)
  },[data])

  const titleStyle= {  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'}
    
  return(data && isLoaded &&
    <div>
      <header style={titleStyle}>
      <p>DreamBoat Won Blocks</p>
      </header>
      <div className="container">
      <DataTable
      columns={columns}
      data={secondBid}
      />
      </div>
      
      </div>
      )
    }
    const w3 = new Web3(new Web3.providers.HttpProvider("https://necessary-newest-waterfall.quiknode.pro/048d029a37818e6a8dfb4dc4eeeebc8db889913e/"))
    const getSecondHighestBids = async () => {
      const bidArray = []
    const url = `https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?limit=5`
    const arrayOfBlocksWon = await axios({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'get',
        url:url })

    for(var x=0; x< arrayOfBlocksWon?.data.length; x++){
        const bids = []
        const winningBlockHash = await axios(`https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?slot=${arrayOfBlocksWon.data[x].slot}`).then(response => response?.data[0]?.block_hash)
        const winningBlockBid = await axios(`https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon.data[x].slot}`).then(response => response.data.filter(block =>block.block_hash===winningBlockHash ? block.timestamp: null))
        const ts = (await w3.eth.getBlock(winningBlockHash)).timestamp
        // var flashbotsBid= await axios(`https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon.data[x].slot}`).then(response => bids.push(filterForHighestBids(response?.data, ts, winningBlockBid)))
        var bloxRoutebid = await axios(`https://bloxroute.max-profit.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon.data[x].slot}`).then(response => (bids.push(filterForHighestBids(response?.data, ts, winningBlockBid))))
        // var bloxrouteEthicalBid = await axios(`https://bloxroute.ethical.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
        // var bloxrouteRegulatedBid= await axios(`https://bloxroute.regulated.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
        // var edenBid= await axios(`https://relay.edennetwork.io/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
        const indexOfSlot = arrayOfBlocksWon.data.findIndex(({slot}) => slot === arrayOfBlocksWon.data[x].slot)
        const updatedTodo = {...arrayOfBlocksWon.data[indexOfSlot], secondHighBid: Math.max(...bids)};
        arrayOfBlocksWon.data[indexOfSlot] = updatedTodo;
        bidArray.push(updatedTodo)
      }
      return bidArray
    }
    const filterForHighestBids = (bidArray, ts, winningBlockBid) => {
      console.log(bidArray)
      if(bidArray.length > 0) {
        const bidArrayFiltered = bidArray.filter(response => response.timestamp < ts)
        return bidArrayFiltered.length > 0 ? bidArrayFiltered[bidArrayFiltered.length-1].value : 0
      } else{
        return 0;
      }
      const arrayOfBids = []
    }
    export async function getServerSideProps({req, res}) {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
      )
      // Fetch data from external API
      const blockNativeWonBlocks = await (await fetch(`https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?limit=20`))
      const blockNativeWonBlocksJson = await blockNativeWonBlocks.json()
      // const remainingBids = await 
      const remainingBidsJson = await getSecondHighestBids()
      // const remainingBidsJson = await remainingBids.json()
      // Pass data to the page via props
      return { props: { blockNativeWonBlocksJson, remainingBidsJson } }
    }
export default Index