import axios from 'axios'

import React, {useState, useEffect} from 'react'
import { columns } from '../components/columns'
import DataTable from 'react-data-table-component';

function index() {
  const [data,setData] = useState()
  const [isLoaded, setIsLoaded] = useState(false)
  
  const getSecondHighestBid = async (arrayOfBlocksWon) => {
    for(var x=0; x< arrayOfBlocksWon?.length; x++){
      const bids = []
      const winningBlockHash = await axios(`https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?slot=${arrayOfBlocksWon[x].slot}`).then(response => response?.data[0]?.block_hash)
      const winningBlockBid = await axios(`https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => response.data.filter(block =>block.block_hash===winningBlockHash ? block.timestamp: null))
      const ts = winningBlockBid[0]['timestamp'] 
      var flashbotsBid= await axios(`https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => bids.push(filterForHighestBid(response?.data, ts)))
      var bloxRoutebid = await axios(`https://bloxroute.max-profit.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
      var bloxrouteEthicalBid = await axios(`https://bloxroute.ethical.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
      var bloxrouteRegulatedBid= await axios(`https://bloxroute.regulated.blxrbdn.com/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
      var edenBid= await axios(`https://relay.edennetwork.io/relay/v1/data/bidtraces/builder_blocks_received?slot=${arrayOfBlocksWon[x].slot}`).then(response => (bids.push(filterForHighestBid(response?.data, ts))))
      data[x].secondHighestBid= Math.max(...bids).toString()

    }
  }

  const filterForHighestBid = (bidArray, ts) => {
    var arrayOfBids = []
    for(var i=0; i <bidArray.length; i++) {
      if( bidArray[i].timestamp <= ts || bidArray[i].timestamp_ms <= ts)
      arrayOfBids.push(bidArray[i].value)
    }
    return (arrayOfBids.length>0 ? Math.max(...arrayOfBids).toString() : 0)
  }

  const blocknativeRelayApi = async () => {
    const responseLimit = 5
    await axios.get(`https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/proposer_payload_delivered?limit=5`)
    .then(response =>(
      setData(response.data),
      setIsLoaded(true)
      ),
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }

  useEffect(() =>{
     blocknativeRelayApi()
  },[])

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
      data={[...data]}
      pagination
      paginationServer
      />
      </div>
      
      </div>
      )
    }
export default index