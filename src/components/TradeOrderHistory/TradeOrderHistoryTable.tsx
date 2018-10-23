import * as React from 'react'
import { isEqual } from 'lodash-es'

import { queryRendererHoc } from '@components/QueryRenderer'
import { MyTradesQuery } from './api'
import { roundAndFormatNumber } from '@utils/PortfolioTableUtils'
import TablePlaceholderLoader from '@components/TablePlaceholderLoader'
import { IProps, IState } from './TradeOrderHistoryTable.types'
import Table from '@components/Tables/WithCheckboxesAndSummary'
import { formatDate } from '@utils/dateUtils'

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
    render: formatDate(values[4]),
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
  }

  shouldComponentUpdate(nextProps: IProps) {
    return isEqual(
      this.props.data.myPortfolios[0].portfolioActions,
      nextProps.data.myPortfolios[0].portfolioActions
    )
      ? false
      : true
  }

  putDataInTable = (rows) => {
    if (!rows) return

    const res = {
      head: tableHeadings.map((heading, index: number) => ({
        isNumber: index === 2,
        render: heading.name,
      })),
      body: rows,
    }

    return res
  }

  render() {
    const { data } = this.props

    let rows = []
    if (data && data.myPortfolios && data.myPortfolios[0]) {
      rows = this.putDataInTable(
        data.myPortfolios[0].portfolioActions.map(mapPortfolioActions)
      )
    }

    return <Table title="Portfolio actions" rows={rows} />
  }
}

export default queryRendererHoc({
  placeholder: TablePlaceholderLoader,
  query: MyTradesQuery,
})(TradeOrderHistoryTable)
