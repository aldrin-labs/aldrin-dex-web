import * as React from 'react'
import styled, { css } from 'styled-components'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '@components/SvgIcon/SvgIcon'

import TablePlaceholderLoader from '@components/TablePlaceholderLoader'
import { tradeOrderHistoryTableData } from '@containers/Portfolio/components/PortfolioTable/Main/TradeOrderHistory/mocks'
import {
  formatNumberToUSFormat,
  onSortTableFull,
} from '@utils/PortfolioTableUtils'
import { customAquaScrollBar } from '@utils/cssUtils'
import {
  IProps,
  IState,
  ICurrentSort,
  ITradeOrderHistoryTableData,
} from '@containers/Portfolio/components/PortfolioTable/Main/TradeOrderHistory/TradeOrderHistoryTable.types'

import QueryRenderer from '@components/QueryRenderer'

import gql from 'graphql-tag'

export const MyTradesQuery = gql`
  query MyTrades {
    myTrades {
      exchangeId
      exchange {
        name
      }
      amount
      cost
      datetime
      symbol
      side
    }
  }
`
const tradeOrderHistoryTableHeadings = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Amount', value: 'amount' },
  { name: 'Cost', value: 'cost' },
  { name: 'Symbol', value: 'symbol' },
  { name: 'Side', value: 'side' },
  { name: 'Datetime', value: 'datetime' },
]

const arrayOfStringHeadings = ['exchange', 'symbol', 'side']

const arrayOfDateHeadings = ['datetime']

class TradeOrderHistoryTable extends React.Component<IProps, IState> {
  state: IState = {
    currentSort: null,
    rows: [],
  }
  componentDidMount() {
    const { isUSDCurrently, data } = this.props

    if (data) {
      const dataFromServer = data.myTrades.map((x) => ({
        ...x,
        exchange: x.exchange.name,
      }))
      this.setState({
        rows: dataFromServer,
      })
    }
  }

  componentWillReceiveProps() {
    const { isUSDCurrently, data } = this.props

    if (data) {
      const dataFromServer = data.myTrades.map((x) => ({
        ...x,
        exchange: x.exchange.name,
      }))
      this.setState({
        rows: dataFromServer,
      })
    }
  }

  onSortTable = (key: string) => {
    const { currentSort, rows } = this.state

    const {
      newData,
      newCurrentSort,
    }: {
      newData: ITradeOrderHistoryTableData
      newCurrentSort: ICurrentSort
    } = onSortTableFull(
      key,
      rows,
      currentSort,
      arrayOfStringHeadings,
      arrayOfDateHeadings
    )

    this.setState({
      currentSort: newCurrentSort,
      rows: newData,
    })
  }

  render() {
    const { currentSort, rows } = this.state

    return (
      <Wrapper>
        <Table>
          <PTHead>
            <PTR>
              {tradeOrderHistoryTableHeadings.map((heading) => {
                const isSorted =
                  currentSort && currentSort.key === heading.value

                return (
                  <PTHC
                    key={heading.name}
                    onClick={() => this.onSortTable(heading.value)}
                  >
                    {heading.name}

                    {isSorted && (
                      <SvgIcon
                        src={sortIcon}
                        width={12}
                        height={12}
                        style={{
                          verticalAlign: 'middle',
                          marginLeft: '4px',
                          transform:
                            currentSort && currentSort.arg === 'ASC'
                              ? 'rotate(180deg)'
                              : null,
                        }}
                      />
                    )}
                  </PTHC>
                )
              })}
            </PTR>
          </PTHead>

          <PTBody>
            {rows.map((row, idx) => {
              const { exchange, amount, datetime, symbol, side } = row

              const mainSymbol = symbol.includes('/USDT') ? (
                <Icon className="fa fa-usd" key={`${idx}usd`} />
              ) : (
                <Icon className="fa fa-btc" key={`${idx}btc`} />
              )

              const cost = Number(row.cost).toFixed(
                symbol.includes('/USDT') ? 2 : 8
              )

              const cols = [
                exchange,
                formatNumberToUSFormat(parseFloat(amount)),
                [mainSymbol, cost],
                symbol,
                side,
                new Date(datetime).toLocaleString('en-US'),
              ]

              return (
                <PTR key={`${symbol}${datetime}${idx}`}>
                  {cols.map((col, index) => {
                    if (String(col).match(/sell|buy/g)) {
                      const color = col === 'sell' ? '#4caf50' : '#f44336'

                      return (
                        <PTDC key={`${col}${index}`} style={{ color }}>
                          {col}
                        </PTDC>
                      )
                    }

                    return <PTDC key={`${col}${index}`}>{col}</PTDC>
                  })}
                </PTR>
              )
            })}
          </PTBody>
        </Table>
      </Wrapper>
    )
  }
}

export default function(props: any) {
  return (
    <QueryRenderer
      placeholder={TablePlaceholderLoader}
      component={TradeOrderHistoryTable}
      query={MyTradesQuery}
      {...props}
    />
  )
}

const Wrapper = styled.div`
  ${customAquaScrollBar};
`
const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
`

const PT = css`
  display: table;
  width: 100%;
  position: sticky;

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }
`

const PTH = css`
  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: left;
  font-weight: 500;
  position: relative;
  padding: 10px 16px 10px 10px;
  user-select: none;
`

const PTHC = styled.th`
  ${PTH};
  min-width: 100px;
  padding-right: 0;

  &:nth-child(1) {
    min-width: 80px;
  }

  &:nth-child(2) {
    min-width: 70px;
  }

  &:nth-child(4) {
    min-width: 80px;
  }

  &:nth-child(5) {
    min-width: 50px;
  }
  
  &:nth-child(6) {
    min-width: 150px;
  }
`

const PTHead = styled.thead`
  ${PT};
  top: 0;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};

  &:nth-child(even) {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }
`

const PTD = css`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;

  & svg {
    width: 15px;
    height: 15px;
  }
`
const PTDC = styled.td`
  ${PTD};
  min-width: 100px;
  padding-right: 0;

  &:nth-child(1) {
    min-width: 80px;
    text-overflow: ellipsis;
  }

  &:nth-child(2) {
    min-width: 70px;
    text-overflow: ellipsis;
  }

  &:nth-child(4) {
    min-width: 80px;
  }

  &:nth-child(5) {
    min-width: 50px;
  }
  
  &:nth-child(6) {
    min-width: 150px;
    text-overflow: ellipsis;
  }
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
  border-bottom: 1px solid #fff;
`

const Icon = styled.i`
  padding-right: 5px;
`
