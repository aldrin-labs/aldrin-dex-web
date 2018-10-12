import * as React from 'react'

import QueryRenderer from '@components/QueryRenderer'
import { MyTradesQuery } from './api'
import {
  formatNumberToUSFormat,
  onSortTableFull,
} from '@utils/PortfolioTableUtils'
import TablePlaceholderLoader from '@components/TablePlaceholderLoader'
import {
  IProps,
  IState,
  ICurrentSort,
  ITradeOrderHistoryTableData,
} from './TradeOrderHistoryTable.types'

import Table from '@components/Tables/WithCheckboxesAndSummary'

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
  render() {
    return <Table />
  }
}

export default (props: any) => {
  return (
    <QueryRenderer
      placeholder={TablePlaceholderLoader}
      component={TradeOrderHistoryTable}
      query={MyTradesQuery}
      {...props}
    />
  )
}
