import * as React from 'react'
import { format } from 'date-fns'

import { queryRendererHoc } from '@components/QueryRenderer'
import { MyTradesQuery } from './api'
import {
  formatNumberToUSFormat,
  onSortTableFull,
  roundAndFormatNumber,
} from '@utils/PortfolioTableUtils'
import TablePlaceholderLoader from '@components/TablePlaceholderLoader'
import {
  IProps,
  IState,
  ICurrentSort,
  ITradeOrderHistoryTableData,
} from './TradeOrderHistoryTable.types'

import Table from '@components/Tables/WithCheckboxesAndSummary'

const tableHeadings = [
  { name: 'Coin', value: 'coin' },
  { name: 'Type', value: 'type' },
  { name: 'Cost', value: 'cost' },
  { name: 'Account', value: 'Account' },
  { name: 'Datetime', value: 'datetime' },
]

const arrayOfStringHeadings = ['type', 'where', 'coin']

const arrayOfDateHeadings = ['datetime']

const mapPortfolioActions = (pA) => {
  const values = Object.values(pA)
  values.pop()
  values[2] = +roundAndFormatNumber(values[2], 8, false)
  // console.log(values[4])
  values[4] = {
    text: format(
      new Date(values[4]).toLocaleString('en-US'),
      'HH:m:s - MM/DD/YYYY'
    ),
    isNumber: false,
  }

  return values
}

class TradeOrderHistoryTable extends React.Component<IProps, IState> {
  state: IState = {
    currentSort: null,
    rows: [],
  }

  componentDidMount() {
    const { isUSDCurrently, data } = this.props

    if (data && data.myPortfolios && data.myPortfolios[0]) {
      this.setState({
        rows: data.myPortfolios[0].portfolioActions.map(mapPortfolioActions),
      })
    }
  }

  componentWillReceiveProps() {
    const { isUSDCurrently, data } = this.props

    if (data && data.myPortfolios && data.myPortfolios[0]) {
      this.setState({
        rows: data.myPortfolios[0].portfolioActions.map(mapPortfolioActions),
      })
    }
  }

  putDataInTable = () => {
    const { rows } = this.state
    if (!rows) return

    const res = {
      head: tableHeadings.map((heading, index: number) => ({
        isNumber: index === 2 ? true : false,
        text: heading.name,
      })),
      body: rows,
    }

    return res
  }

  render() {
    return <Table title="Portfolio actions" rows={this.putDataInTable()} />
  }
}

export default queryRendererHoc({
  placeholder: TablePlaceholderLoader,
  query: MyTradesQuery,
})(TradeOrderHistoryTable)
