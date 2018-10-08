import React, { Component } from 'react'

import { getPortfolioMainQuery } from '@containers/Portfolio/api'
import QueryRenderer from '@components/QueryRenderer'
import PortfolioMain from './PortfolioTableBalances/PortfolioTableBalances'
import {
  combineTableData,
  roundAndFormatNumber,
  composePortfolioWithMocks,
  numberOfDigitsAfterPoint,
} from '@utils/PortfolioTableUtils'
import { zip, isObject } from 'lodash-es'

class Container extends Component {
  state: IState = {
    currentSort: null,
    activeKeys: null,
    activeWallets: null,
    portfolio: null,
    checkedRows: [],
    numberOfDigitsAfterPoint: numberOfDigitsAfterPoint(
      this.props.isUSDCurrently
    ),
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      activeKeys,
      filterValueSmallerThenPercentage,
      isUSDCurrently,
      isShownMocks,
      data,
    } = nextProps
    if (data && activeKeys) {
      if (!data.getProfile) return

      const { portfolio } = data.getProfile

      if (!portfolio || portfolio === null) {
        return
      }

      const composeWithMocks = composePortfolioWithMocks(
        portfolio,
        isShownMocks
      )

      return {
        activeKeys,
        numberOfDigitsAfterPoint: numberOfDigitsAfterPoint(isUSDCurrently),
        checkedRows:
          nextProps.activeKeys.length === 0 ? [] : prevState.checkedRows,
        portfolio: composeWithMocks,
        tableData: combineTableData(
          composeWithMocks,
          activeKeys,
          filterValueSmallerThenPercentage,
          isUSDCurrently
        ),
      }
    }

    return null
  }

  componentDidMount() {
    const {
      data: { getProfile: data },
      isShownMocks,
      activeKeys,
      filterValueSmallerThenPercentage,
      isUSDCurrently,
    } = this.props

    if (!data || !activeKeys) {
      return
    }
    const { portfolio } = data

    const composeWithMocks = composePortfolioWithMocks(portfolio, isShownMocks)

    this.setState(
      {
        activeKeys,
        portfolio: composeWithMocks,
        tableData: combineTableData(
          composeWithMocks,
          activeKeys,
          filterValueSmallerThenPercentage,
          isUSDCurrently
        ),
      },
      () => {
        // select all checkboxes
        this.onSelectAllClick(undefined, true)
      }
    )
  }

  //  footer of table
  calculateTotal = () => {
    const {
      checkedRows,
      tableData,
      numberOfDigitsAfterPoint: round,
    } = this.state

    let total: any[] | null = null
    if (tableData && checkedRows.length !== 0) {
      const selectedAll = tableData.length === checkedRows.length

      // show footer
      total = []
      const data = this.transformData(tableData)
      // check lodash docs (transforming rows into columns)
      zip(...data).forEach((column, ind) => {
        let sum = 0
        //  skip exchange and coin columns
        if (ind > 1) {
          // sum each column numbers if they were selected
          column.forEach((el, i) => {
            const num = isObject(el) ? el.text : el

            if (checkedRows.indexOf(i) !== -1 && typeof num === 'number') {
              sum += +num
            }

            // dont calculate sum of portfolio becouse it must always be 100
            // this is cheaty way of doing things and may lead to unexpected behaviour
            if (ind === 2 && selectedAll) sum = 100
          })

          total.push(+roundAndFormatNumber(sum, round, false))
        } else {
          total.push(' ')
        }
      })
    }

    return total
  }

  transformData = (data: any[] = [], red: string = '', green: string = '') => {
    const { numberOfDigitsAfterPoint: round } = this.state
    return data.map((row) => [
      row.exchange,
      { text: row.coin, style: { fontWeight: 700 } },
      row.portfolioPercentage,
      +roundAndFormatNumber(row.price, round, false),
      row.quantity,
      +roundAndFormatNumber(row.price * row.quantity, round, false),
      {
        text: +roundAndFormatNumber(row.realizedPL, round, false),
        color: row.realizedPL > 0 ? green : red,
      },
      {
        text: +roundAndFormatNumber(row.unrealizedPL, round, false),
        color: row.unrealizedPL > 0 ? green : red,
      },
      {
        text: +roundAndFormatNumber(row.totalPL, round, false),
        color: row.totalPL > 0 ? green : red,
      },
    ])
  }

  putDataInTable = () => {
    const { theme, isUSDCurrently } = this.props
    const { tableData } = this.state

    return {
      head: [
        { text: 'exchange', number: false },
        { text: 'coin', number: false },
        { text: 'portfolio%', number: true },
        { text: 'price', number: true },
        { text: 'quantity', number: true },
        { text: isUSDCurrently ? 'usd' : 'BTC', number: true },
        { text: 'realized P&L', number: true },
        { text: 'Unrealized P&L', number: true },
        { text: 'Total P&L', number: true },
      ],
      body: this.transformData(
        tableData,
        theme.palette.red.main,
        theme.palette.green.main
      ),
      footer: this.calculateTotal(),
    }
  }

  onSelectAllClick = (e: Event | undefined, selectAll = false) => {
    if ((e && e.target && e.target.checked) || selectAll) {
      this.setState((state) => ({
        checkedRows: state.tableData.map((n: any, i: number) => i),
      }))
      return
    }
    this.setState({ checkedRows: [] })
  }

  onCheckboxClick = (e: Event, id: number | string) => {
    //  from material UI docs
    const { checkedRows: selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected: number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, +id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    this.setState({ checkedRows: newSelected })
  }

  render() {
    const { checkedRows, currentSort, tableData } = this.state
    const { onCheckboxClick, onSelectAllClick, putDataInTable } = this

    return (
      <PortfolioMain
        {...{
          ...this.props,
          onCheckboxClick,
          onSelectAllClick,
          currentSort,
          putDataInTable,
          checkedRows,
          tableData,
        }}
      />
    )
  }
}

export default (props) => (
  <QueryRenderer
    fetchPolicy="network-only"
    component={Container}
    query={getPortfolioMainQuery}
    pollInterval={5000}
    {...props}
  />
)
