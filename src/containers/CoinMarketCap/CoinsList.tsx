import React, { SFC } from 'react'
import styled from 'styled-components'

import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

const SPaper = styled(Paper)`
  width: 100%;
  margin-top: 5px;
  overflow-x: auto;
`

const STable = styled(Table)`
  min-width: 700px;
  max-width: 1100px;
  margin: 0 auto;
`
/*

    price_usd
    price_btc
    market_cap_usd
    available_supply
    total_supply
*/
// TODO: types for coinmarketcap data
// export const CoinsList: SFC<{}> = props => {
//   const { data } = props
//   return (
//     <SPaper>
//       <STable>
//         {/* <TableHead>
//           <TableRow>
//             <TableCell numeric>Rank</TableCell>
//             <TableCell numeric>Name</TableCell>
//             <TableCell numeric>Market Cap</TableCell>
//             <TableCell numeric>Price</TableCell>
//             <TableCell numeric>Change 24h</TableCell>
//             <TableCell numeric>Total Supply</TableCell>
//           </TableRow>
//         </TableHead> */}
//         <TableBody>
//           {data.map(n => (
//             <TableRow key={n.id}>
//               <TableCell>{n.rank}</TableCell>
//               <TableCell numeric>{n.name}</TableCell>
//               <TableCell numeric>{n.market_cap_usd}</TableCell>
//               <TableCell numeric>{n.price_usd}</TableCell>
//               <TableCell numeric>{n.percent_change_24h}</TableCell>
//               <TableCell numeric>{n.total_supply}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </STable>
//     </SPaper>
//   )
// }
