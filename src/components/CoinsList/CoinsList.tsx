import nanoid from 'nanoid'
import React from 'react'
import { FormattedNumber } from 'react-intl'
import styled, { css } from 'styled-components'

import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

// TODO: add types
import * as T from './types'

import { CoinLink } from './CoinLink'

const CoinsListPaper = styled(Paper)`
  width: 100%;
  margin-top: 5px;
  overflow-x: auto;
`

const CellTypography = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #000;
  line-height: 20px;
`

const CurrencyGrow = styled.span`
  ${props =>
    props.grow
      ? css`
          color: #00cc81;
        `
      : css`
          color: #ff0047;
        `};
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

const tableRows = ['#', 'Name', 'Price (USD)', 'Chg (24h)', 'Market Cap', 'Total Supply']

// TODO: fix types
export const CoinsListHead = ({ tableRows }: T.ICoinsTableList[]) => (
  <TableHead>
    <TableRow>
      {tableRows.map((row: T.ICoinsTableCell) => (
        <TableCell padding={'none'} key={nanoid()}>
          <Test>{row}</Test>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
)

export const CoinsListBody = ({ tableData }: any) => {
  return (
    <TableBody>
      {tableData.map((coin: any) => (
        <TableRow key={coin._id}>
          <TableCell padding={'none'}>
            <CellTypography>{coin.rank}</CellTypography>
          </TableCell>
          <TableCell padding={'none'}>
            <CellTypography>
              <CoinLink assetId={coin._id} name={coin.name} />
            </CellTypography>
          </TableCell>
          <TableCell padding={'none'}>
            <CellTypography>
              {console.log(coin.priceUSD)}
              $<FormattedNumber value={parseFloat(coin.priceUSD).toFixed(2)} />
            </CellTypography>
          </TableCell>
          {/* <TableCell padding={'none'}>
          <CellTypography>
            <CurrencyGrow grow={!coin.percent_change_24h.toString().includes('-')}>{coin.percent_change_24h}%</CurrencyGrow>
          </CellTypography>
        </TableCell> */}
          <TableCell padding={'none'}>
            <CellTypography>
              $<FormattedNumber value={0} />
            </CellTypography>
          </TableCell>
          <TableCell padding={'none'}>
            <CellTypography>
              $<FormattedNumber value={0} />
            </CellTypography>
          </TableCell>
          <TableCell padding={'none'}>
            <CellTypography>
              $<FormattedNumber value={coin.totalSupply} />
            </CellTypography>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export const CoinsList = ({ data }: any) => (
  <CoinsListPaper>
    <CoinsListTable>
      <CoinsListHead tableRows={tableRows} />
      <CoinsListBody tableData={data} />
    </CoinsListTable>
  </CoinsListPaper>
)
