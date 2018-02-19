import nanoid from 'nanoid'
import React from 'react'
import styled from 'styled-components'

import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

import * as T from './types'

const CoinsListPaper = styled(Paper)`
  width: 100%;
  margin-top: 5px;
  overflow-x: auto;
`

const CoinsListTable = styled(Table)`
  min-width: 700px;
  max-width: 1100px;
  margin: 0 auto;
`

const Test = styled.span`
  font-size: 14px;
  font-weight: 500;
`

const tableRows = [
  '#',
  'Name',
  'Price (USD)',
  'Chg (24h)',
  'Chg (7d)',
  'Price (BTC)',
  'Market Cap',
  'Total Supply',
  'Volume (24h)'
]


// TODO: fix types
export const CoinsListHead = ({ tableRows }: T.ICoinsTableList[]) => (
  <TableHead>
    <TableRow>
    {tableRows.map((row: T.ICoinsTableCell) => (
      <TableCell padding={'none'} key={nanoid()} numeric>
            <Test>{row}</Test>
      </TableCell>
    ))}
    </TableRow>
  </TableHead>
)

export const CoinsListBody = ({ tableData }: any) => (
  <TableBody>
    {tableData.map((coin: any) => (
      <TableRow key={nanoid()}>
        <TableCell>{coin.rank}</TableCell>
        <TableCell numeric>{coin.name}</TableCell>
        <TableCell numeric>{coin.price_usd}</TableCell>
        <TableCell numeric>{coin.percent_change_24}</TableCell>
        <TableCell numeric>{coin.percent_change_7d}</TableCell>
        <TableCell numeric>{coin.price_btc}</TableCell>
        <TableCell numeric>{coin.market_cap_usd}</TableCell>
        <TableCell numeric>{coin.total_supply}</TableCell>
        <TableCell numeric>{coin['24h_volume_usd']}</TableCell>
      </TableRow>
    ))}
  </TableBody>
)


export const CoinsList = () => (
  <CoinsListPaper>
    <CoinsListTable>
      <CoinsListHead tableRows={tableRows} />
      {/* <CoinsListBody /> */}
    </CoinsListTable>
  </CoinsListPaper>
)
