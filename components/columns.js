export const columns = [
  {
    name: "Slot",
    selector: (row) => row.slot,
    width: "100px",
    cell: (row) => <a link="google.com">{row.slot}</a>,
  },
  {
    name: "Builder Address",
    selector: (row) => row.builder_pubkey,
    width: "100px",
  },
  {
    name: "Block Hash",
    selector: (row) => row.block_hash,
    width: "auto-fit",
    maxWidth: "550px",
  },
  {
    name: "Value(eth)",
    selector: (row) => row.value,
    width: "150px",
    cell: (row) => <div>{(row.value / 10 ** 18).toFixed(7)}</div>,
  },
  {
    name: "Won by(eth)",
    selector: (row) => row?.secondHighBid,
    width: "200px",
    // cell: row => (<div>{row.secondHighestBid}</div>)
    cell: (row) => (
      <div>{((row.value - row.secondHighBid) / 10 ** 18).toFixed(7)}</div>
    ),
  },
];
