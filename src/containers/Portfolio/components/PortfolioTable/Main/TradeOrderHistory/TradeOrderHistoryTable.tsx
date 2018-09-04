import * as React from 'react'
import QueryRenderer from '@components/QueryRenderer'

import { MyTradesQuery } from '@containers/Portfolio/components/PortfolioTable/Main/TradeOrderHistory/api'
import {
  formatNumberToUSFormat,
  onSortTableFull,
} from '@utils/PortfolioTableUtils'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import TablePlaceholderLoader from '@components/TablePlaceholderLoader'
// import { tradeOrderHistoryTableData } from '@containers/Portfolio/components/PortfolioTable/Main/TradeOrderHistory/mocks'
import {
  IProps,
  IState,
  ICurrentSort,
  ITradeOrderHistoryTableData,
} from '@containers/Portfolio/components/PortfolioTable/Main/TradeOrderHistory/TradeOrderHistoryTable.types'
import {
  Wrapper,
  Table,
  PT,
  PTH,
  PTHC,
  PTHead,
  PTR,
  PTD,
  PTDC,
  PTBody,
  Icon,
} from './TradeOrderHistroryTable.styles'

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
