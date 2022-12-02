export const columns = [
    {
        name: 'Slot',
        selector: row => row.slot,
        width: '100px',
        cell: (row) => <a link="google.com">{row.slot}</a>
        // cell: row => <a href="url">link text</a>
        // <link>https://beaconcha.in/block/{row.slot}</link>
    },
    {
        name: 'Builder Address',
        selector: row => row.builder_pubkey,
        width: '100px'
    },
    {
        name: 'Block Hash',
        selector: row => row.block_hash,
        width: 'auto-fit',
        maxWidth: '550px'

    },
    {
        name: 'Second Highest Bid',
        selector: row => row?.secondHighBid,
        width: '200px',
        // cell: row => (<div>{row.secondHighestBid}</div>)
        cell: row => (<div>{((row.secondHighBid))}</div>)
    },
    {
        name: 'Value',
        selector: row => row.value,
        width: '200px',
        cell: row => (<div>{(row.value/(10**18)).toFixed(5)}</div>)
    },
    // {
    //     name: 'longitude',
    //     selector: row => row.longitude,
    //     width: '100px'
    // },
  ];