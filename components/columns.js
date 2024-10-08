export const columns = [
  {
    name: "Slot",
    width: "100px",
    cell: (row) => (
      <a href={`https://beaconcha.in/slot/${row.slot}`}>{row.slot}</a>
    ),
  },
  {
    name: "Builder Address",
    selector: (row) => row.builder_address,
    width: "100px",
  },
  // {
  //   name: "Block Hash",
  //   // selector: (row) => row.block_hash,
  //   // width: "auto-fit",
  //   cell: (row) => (
  //     <div style={{ whiteSpace: "pre-wrap" }}>{row.block_hash}</div>
  //   ),
  //   maxWidth: "450px",
  // },
  {
    name: "Value(eth)",
    selector: (row) => row.winningBid,
    width: "125px",
    cell: (row) => <div>{(row.winningBid / 10 ** 18).toFixed(7)}</div>,
  },
  {
    name: "Lost by(eth)",
    selector: (row) => ((row.winningBid - row.blocknativeBid) / 10 ** 18).toFixed(7),
    width: "125px",
    cell: (row) => (
      <div>
        {row.blocknativeBid !== 0
          ? ((row.winningBid - row.blocknativeBid) / 10 ** 18).toFixed(7)
          : "N/A"}
      </div>
    ),
  },
  {
    name: "Bid status",
    selector: (row) => row.blockSubmitted,
    width: "125px",
    cell: (row) =>  <div>
      {row.builder_address === "0xb7535857fb9559a6858fadecb069b8430053d02e8d5fc35ebde576f8d28c8f3b10e1316ad9a3f13fb80ad5a27dd293f6"
        ? "won bid"
        : row.blockSubmitted}
    </div>
  },
  // {
  //   name: <div style={{ overflow: "wrap" }}>Slots since won Block</div>,
  //   selector: (row) => row?.secondHighBid,
  //   width: "120px",
  //   cell: (row) => <div>{row.sinceLastWonBlock}</div>,
  // },
  // // {
  // //   name: "Block Profit",
  // //   selector: (row) => row?.secondHighBid,
  // //   width: "105px",
  // //   cell: (row) => (
  // //     <div>
  // //       {row.builder_pubkey ===
  // //       "0x8000008a03ebae7d8ab2f66659bd719a698b2e74097d1e423df85e0d58571140527c15052a36c19878018aaebe8a6fea"
  // //         ? ((row.value * 0.05) / 10 ** 18).toFixed(7)
  // //         : "N/A"}
  // //         </div>
  // //         ),
  // //       },
  // {
  //   name: "Bid Efficiency",
  //   width: "105px",
  //   cell: (row) =>
  //   calculateEfficiency(row.value, row.secondHighBid, row.builder_pubkey),
  // },
];

const calculateEfficiency = (winningBid, losingBid, pubkey) => {
  if (
    pubkey ===
    "0x8000008a03ebae7d8ab2f66659bd719a698b2e74097d1e423df85e0d58571140527c15052a36c19878018aaebe8a6fea"
    ) {
      const profit = (winningBid / 10 ** 18) * 0.05;
      const blockProfitPlusValidator = winningBid / 10 ** 18 + profit;
      const differenceOfWinningBid =
      blockProfitPlusValidator - losingBid / 10 ** 18;
      return ((profit / differenceOfWinningBid) * 100).toFixed(2) + "%";
    } else if (
      pubkey ===
      "0x9000009807ed12c1f08bf4e81c6da3ba8e3fc3d953898ce0102433094e5f22f21102ec057841fcb81978ed1ea0fa8246"
      ) {
        const profit = (winningBid / 10 ** 18) * 0.001;
        const blockProfitPlusValidator = winningBid / 10 ** 18 + profit;
        const differenceOfWinningBid =
        blockProfitPlusValidator - losingBid / 10 ** 18;
        const blockProfit = winningBid * 0.05;
        return ((profit / differenceOfWinningBid) * 100).toFixed(2) + "%";
      }
};
    // ((row.value * 0.00) / 10 ** 18).toFixed(7)}