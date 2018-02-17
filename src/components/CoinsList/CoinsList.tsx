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

const tableRows = [
  '#',
  'Name',
  'Price (USD)',
  'Chg (24h)',
  'Chg (7d)',
  'Price (BTC)',
  'Market Cap',
  'Circulating Supply',
  'Volume (24h)'
]

export const CoinsList = () => (
  <CoinsListPaper>
    <CoinsListTable>
      <CoinsListHead tableRows={tableRows} />
      <TableBody>
          {/* {data.map(n => (
            <TableRow key={n.id}>
              <TableCell>{n.rank}</TableCell>
              <TableCell numeric>{n.name}</TableCell>
              <TableCell numeric>{n.market_cap_usd}</TableCell>
              <TableCell numeric>{n.price_usd}</TableCell>
              <TableCell numeric>{n.percent_change_24h}</TableCell>
              <TableCell numeric>{n.total_supply}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
    </CoinsListTable>
  </CoinsListPaper>
)
