import React, { Component } from 'react'

import { getPortfolioMainQuery } from '@containers/Portfolio/api'
import QueryRenderer from '@components/QueryRenderer'
import PortfolioMain from './PortfolioTableBalances/PortfolioTableBalances'
import {
  combineTableData,
  roundAndFormatNumber,
  composePortfolioWithMocks,
} from '@utils/PortfolioTableUtils'
import { MOCK_DATA } from '@containers/Portfolio/components/PortfolioTable/dataMock'
import { zip, isObject } from 'lodash-es'

class Container extends Component {
  state: IState = {
    currentSort: null,
    activeKeys: null,
    activeWallets: null,
    portfolio: null,
    checkedRows: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data) {
      if (!nextProps.data.getProfile) return

      const { portfolio } = nextProps.data.getProfile

      if (!portfolio || portfolio === null) {
        return
      }

      const composeWithMocks = composePortfolioWithMocks

      return { portfolio: composeWithMocks }
    }

    if (nextProps.activeKeys) {
      return { activeKeys: nextProps.activeKeys }
    }

    if (nextProps.activeKeys && nextProps.activeKeys.length === 0) {
      return { checkedRows: [] }
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

    if (!data) {
      return
    }
    const { portfolio } = data

    const composeWithMocks = isShownMocks
      ? {
          ...portfolio,
          assets: portfolio.assets.concat(MOCK_DATA),
          cryptoWallets: portfolio.cryptoWallets.concat([]),
        }
      : portfolio

    this.setState({
      activeKeys,
      portfolio: composeWithMocks,
      tableData: combineTableData(
        composeWithMocks,
        activeKeys,
        filterValueSmallerThenPercentage,
        isUSDCurrently
      ),
    })
  }

  calculateTotal = () => {
    const { checkedRows, tableData } = this.state
    //  footer of table
    let total: any[] | null = null
    if (tableData && checkedRows.length !== 0) {
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
          })

          total.push(sum)
        } else {
          total.push(' ')
        }
      })
    }

    return total
  }

  transformData = (data: any[] = [], red: string = '', green: string = '') => {
    const numberOfDigitsAfterPoint = this.props.isUSDCurrently ? 2 : 8

    return data.map((row) => [
      row.exchange,
      { text: row.coin, style: { fontWeight: 700 } },
      row.portfolioPercentage,
      +roundAndFormatNumber(row.price, numberOfDigitsAfterPoint, false),
      row.quantity,
      +roundAndFormatNumber(
        row.price * row.quantity,
        numberOfDigitsAfterPoint,
        false
      ),
      {
        text: +roundAndFormatNumber(
          row.realizedPL,
          numberOfDigitsAfterPoint,
          false
        ),
        color: row.realizedPL > 0 ? green : red,
      },
      {
        text: +roundAndFormatNumber(
          row.unrealizedPL,
          numberOfDigitsAfterPoint,
          false
        ),
        color: row.unrealizedPL > 0 ? green : red,
      },
      {
        text: +roundAndFormatNumber(
          row.totalPL,
          numberOfDigitsAfterPoint,
          false
        ),
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

  onSelectAllClick = (e: Event) => {
    if (e && e.target && e.target.checked) {
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
    {...props}
  />
)
