import axios from 'axios'

import React, {useState, useEffect} from 'react'
import { columns } from '../components/columns'
import DataTable from 'react-data-table-component';
import Web3 from 'web3'

function Index({hey, blockNativeWonBlocksJson}) {
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
      var flashbotsBid= await axios(`https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => bids.push(filterForHighestBid(response?.data, ts, winningBlockBid)))
      var bloxRoutebid = await axios(`https://bloxroute.max-profit.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts, winningBlockBid[0].value))))
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
    const bidArrayFiltered = bidArray.filter(response => response.timestamp < ts)
    const arrayOfBids = []
    for(var i=0; i <bidArrayFiltered.length; i++) {
      if(bidArrayFiltered[i].value < winningBlockBid[0].value) {
        arrayOfBids.push(bidArrayFiltered[i].value)
      }
    }
    return (arrayOfBids.length>0 ? Math.max(...arrayOfBids) : 0)
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
    export async function getServerSideProps({req, res}) {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
      )
      // Fetch data from external API
      const blockNativeWonBlocks = await (await fetch(`https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?limit=20`))
      const blockNativeWonBlocksJson = await blockNativeWonBlocks.json()
      // Pass data to the page via props
      return { props: { blockNativeWonBlocksJson } }
    }
export default Index