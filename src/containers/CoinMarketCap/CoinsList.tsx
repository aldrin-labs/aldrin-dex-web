import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import React, { SFC } from 'react'
import styled from 'styled-components'

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

// TODO: types for coinmarketcap data
export const CoinsList: SFC<{}> = props => {
  const { data } = props
  return (
    <SPaper>
      <STable>
        <TableHead>
          <TableRow>
            <TableCell numeric>Rank</TableCell>
            <TableCell numeric>Name</TableCell>
            <TableCell numeric>Market Cap</TableCell>
            <TableCell numeric>Price</TableCell>
            <TableCell numeric>Volume 24h</TableCell>
            <TableCell numeric>Change 24h</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => (
            <TableRow key={n.id}>
              <TableCell>{n.rank}</TableCell>
              <TableCell numeric>{n.name}</TableCell>
              <TableCell numeric>{n.market_cap_usd}</TableCell>
              <TableCell numeric>{n.price_usd}</TableCell>
              <TableCell numeric>{n['24h_volume_usd']}</TableCell>
              <TableCell numeric>{n.percent_change_24h}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </STable>
    </SPaper>
  )
}
