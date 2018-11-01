import React, { Component } from 'react'

import { getPortfolioMainQuery } from '@containers/Portfolio/api'
import { queryRendererHoc } from '@components/QueryRenderer'
import PortfolioMain from './PortfolioTableBalances/PortfolioTableBalances'
import {
  combineTableData,
  roundAndFormatNumber,
  composePortfolioWithMocks,
  numberOfDigitsAfterPoint,
  roundPercentage,
} from '@utils/PortfolioTableUtils'
import { zip, isObject } from 'lodash-es'
import { Theme } from '@material-ui/core'

const chooseRed = (theme: Theme) =>
  theme.palette.type === 'dark'
    ? theme.palette.red.main
    : theme.palette.red.dark
const chooseGreen = (theme: Theme) =>
  theme.palette.type === 'dark'
    ? theme.palette.green.main
    : theme.palette.green.dark

class Container extends Component {
  state: IState = {
    currentSort: null,
    portfolioAssets: null,
    checkedRows: [],
    red: chooseRed(this.props.theme),
    green: chooseGreen(this.props.theme),
    numberOfDigitsAfterPoint: numberOfDigitsAfterPoint(
      this.props.isUSDCurrently
    ),
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      filterValueSmallerThenPercentage,
      isUSDCurrently,
      isShownMocks,
      data,
      theme,
    } = nextProps
    if (data) {
      if (!data.myPortfolios[0]) return

      const { portfolioAssets } = data.myPortfolios[0]

      if (!portfolioAssets) {
        return
      }

      const composePortfolioAssetsWithMocks = composePortfolioWithMocks(
        portfolioAssets,
        isShownMocks
      )

      return {
        numberOfDigitsAfterPoint: numberOfDigitsAfterPoint(isUSDCurrently),
        checkedRows:
          portfolioAssets.length === 0
            ? []
            : prevState.checkedRows,
        portfolio: composePortfolioAssetsWithMocks,
        tableData: combineTableData(
          composePortfolioAssetsWithMocks,
          filterValueSmallerThenPercentage,
          isUSDCurrently
        ),
        red: chooseRed(theme),
        green: chooseGreen(theme),
      }
    }

    return null
  }

  componentDidMount() {
    this.onSelectAllClick(undefined, true)
  }

  //  footer of table
  calculateTotal = () => {
    const {
      checkedRows,
      tableData,
      numberOfDigitsAfterPoint: round,
      red,
      green,
    } = this.state

    let total: any[] | null = null
    if (tableData && checkedRows.length !== 0) {
      const selectedAll = tableData.length === checkedRows.length

      // show footer
      total = []
      const data = this.transformData(tableData)
      // check lodash docs (transforming rows into columns)
      zip(...data).forEach((column, ind) => {
        let sum: number | { render: string | number; style: object } = 0
        //  skip exchange , coin, price and quantity columns
        if (ind > 1 && ind !== 3 && ind !== 4) {
          // sum each column numbers if they were selected
          column.forEach((el, i) => {
            const num = isObject(el) ? el.render : el

            if (
              checkedRows.indexOf(i) !== -1 &&
              typeof num === 'number' &&
              typeof sum === 'number'
            ) {
              sum += +num
            }

            // dont calculate sum of portfolio becouse it must always be 100
            // this is cheaty way of doing things and may lead to unexpected behaviour
            if (ind === 2 && selectedAll) sum = 100
          })

          // coloring text depends on value for P&L
          const formatedSum = +roundAndFormatNumber(sum, round, false)
          if (ind > 5) {
            total.push({
              render: formatedSum,
              isNumber: true,
              style: { color: formatedSum > 0 ? green : red },
            })
          } else {
            total.push(formatedSum)
          }
        } else {
          total.push(' ')
        }
      })
    }

    return total && [total]
  }

  transformData = (data: any[] = [], red: string = '', green: string = '') => {
    const { numberOfDigitsAfterPoint: round } = this.state

    return data.map((row) => [
      row.exchange,
      { render: row.coin, style: { fontWeight: 700 } },
      {
        render: `${roundPercentage(row.portfolioPercentage) || 0}%`,
        isNumber: true,
      },
      +roundAndFormatNumber(row.price, round, false),
      +roundAndFormatNumber(row.quantity, round, false),
      +roundAndFormatNumber(row.price * row.quantity, round, false),
      {
        render: +roundAndFormatNumber(row.realizedPL, round, false),
        color: row.realizedPL > 0 ? green : red,
      },
      {
        render: +roundAndFormatNumber(row.unrealizedPL, round, false),
        color: row.unrealizedPL > 0 ? green : red,
      },
      {
        render: +roundAndFormatNumber(
          row.realizedPL + row.unrealizedPL,
          round,
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
        { render: 'exchange', isNumber: false },
        { render: 'coin', isNumber: false },
        { render: 'portfolio', isNumber: true },
        { render: 'price', isNumber: true },
        { render: 'quantity', isNumber: true },
        { render: isUSDCurrently ? 'usd' : 'BTC', isNumber: true },
        { render: 'realized P&L', isNumber: true },
        { render: 'Unrealized P&L', isNumber: true },
        { render: 'Total P&L', isNumber: true },
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
        checkedRows: state.tableData
          ? state.tableData.map((n: any, i: number) => i)
          : [],
      }))
      return
    }
    this.setState({ checkedRows: [] })
  }

  onCheckboxClick = (id: number | string) => {
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

export default queryRendererHoc({
  query: getPortfolioMainQuery,
  pollInterval: 5 * 60 * 1000,
  fetchPolicy: 'network-only',
})(Container)
