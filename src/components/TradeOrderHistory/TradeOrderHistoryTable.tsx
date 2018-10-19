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
  values[4] = {
    text: format(
      new Date(values[4] * 1000).toLocaleString('en-US'),
      ' MM/DD/YYYY - hh:m:s A'
    ),
    isNumber: false,
    style: {
      fontSize: 11,
    },
  }

  return values
}

class TradeOrderHistoryTable extends React.Component<IProps, IState> {
  state: IState = {
    currentSort: null,
    rows: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps

    if (data && data.myPortfolios && data.myPortfolios[0]) {
      return {
        rows: data.myPortfolios[0].portfolioActions.map(mapPortfolioActions),
      }
    }

    return null
  }

  putDataInTable = () => {
    const { rows } = this.state
    if (!rows) return

    const res = {
      head: tableHeadings.map((heading, index: number) => ({
        isNumber: index === 2,
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
