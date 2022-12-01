import { NextApiRequest, NextApiResponse } from 'next'
// import { User } from '../../interfaces'

// Fake users data
const users = [{ id: 1 }, { id: 2 }, { id: 3 }]

export default function handler(_req, res) {
  const data = fetch('https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received')
  console.log(data)

    return res.status(200).json(data)
    // return res.status(400)
  }