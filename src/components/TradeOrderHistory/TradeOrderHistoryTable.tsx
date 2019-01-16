import * as React from 'react'
import { isEqual } from 'lodash-es'
import { TableWithSort } from '@storybook-components/index'

import { queryRendererHoc } from '@components/QueryRenderer'
import { MyTradesQuery } from './api'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { IProps, IState } from './TradeOrderHistoryTable.types'
import { formatDate } from '@utils/dateUtils'
import { withErrorFallback } from '@hoc/'
import Loader from '@storybook-components/TablePlaceholderLoader/newLoader'

const tableHeadings = [
  { isNumber: false, name: 'Coin', id: 'coin' },
  { isNumber: false, name: 'Type', id: 'type' },
  { isNumber: true, name: 'Cost', id: 'cost' },
  { isNumber: false, name: 'Account', id: 'where' },
  { isNumber: false, name: 'Datetime', id: 'date' },
]

const mapPortfolioActions = (pA, index) => {
  const newpA = { ...pA }
  newpA.id = `${index}`
  newpA.cost = +roundAndFormatNumber(newpA.cost, 8, false)
  newpA.date = { render: formatDate(newpA.date), contentToSort: newpA.date }
  // dont want to render it
  delete newpA.__typename

  return newpA
}

class TradeOrderHistoryTable extends React.Component<IProps, IState> {
  state: IState = {
    currentSort: null,
  }

  shouldComponentUpdate(nextProps: IProps) {
    const res = !isEqual(
      this.props.data &&
        this.props.data.myPortfolios &&
        this.props.data.myPortfolios[0].portfolioActions.slice(0, 99),
      nextProps.data &&
        nextProps.data.myPortfolios &&
        nextProps.data.myPortfolios[0].portfolioActions.slice(0, 99)
    )

    return res
  }

  putDataInTable = (rows) => {
    if (!rows) return

    const res = {
      head: tableHeadings.map((heading) => ({
        isNumber: heading.isNumber,
        id: heading.id,
        label: heading.name,
      })),
      body: rows,
    }

    return res
  }

  render() {
    const { data } = this.props

    let rows = { body: [] }
    if (data && data.myPortfolios && data.myPortfolios[0]) {
      rows = this.putDataInTable(
        data.myPortfolios[0].portfolioActions.map(mapPortfolioActions)
      )
    }

    if (rows.body.length === 0) {
      return <Loader />
    }

    return (
      <TableWithSort
        id="PortfolioActionsTable"
        padding="dense"
        title="Portfolio Actions"
        data={{ body: rows.body }}
        columnNames={rows.head}
      />
    )
  }
}

export default withErrorFallback(
  queryRendererHoc({
    query: MyTradesQuery,
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
  })(TradeOrderHistoryTable)
)
