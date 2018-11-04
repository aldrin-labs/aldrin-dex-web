import React, { Component } from 'react'
import { zip, isObject } from 'lodash-es'
import { Theme } from '@material-ui/core'
import nanoid from 'nanoid'

import { getPortfolioMainQuery } from '@containers/Portfolio/api'
import { queryRendererHoc } from '@components/QueryRenderer'
import PortfolioMain from './PortfolioTableBalances/PortfolioTableBalances'
import {
  combineTableData,
  roundAndFormatNumber,
  composePortfolioWithMocks,
  numberOfDigitsAfterPoint,
  roundPercentage,
  onCheckBoxClick,
  transformToNumber,
} from '@utils/PortfolioTableUtils'

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
        checkedRows: portfolioAssets.length === 0 ? [] : prevState.checkedRows,
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
      const data = this.transformData(tableData).map((row) => {
        const result = Object.values(row)
        // becouse portfolio has %
        result[3] = transformToNumber(result[3].render)
        return result
      })
      // check lodash docs (transforming rows into columns)
      zip(...data).forEach((column, ind) => {
        let sum: number | { render: string | number; style: object } = 0
        //  skip id, exchange , coin, price and quantity columns
        if (ind > 2 && ind !== 4 && ind !== 5) {
          // sum each column numbers if they were selected
          column.forEach((el, i) => {
            const num = isObject(el) ? el.render : el
            if (
              checkedRows.indexOf(data[i][0]) !== -1 &&
              typeof num === 'number' &&
              typeof sum === 'number'
            ) {
              sum += +num
            }

            // dont calculate sum of portfolio becouse it must always be 100
            // this is cheaty way of doing things and may lead to unexpected behaviour
            if (ind === 3 && selectedAll) sum = 100
          })

          // coloring text depends on value for P&L
          const formatedSum = +roundAndFormatNumber(sum, round, false)
          if (ind > 6) {
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

    return (
      total && [
        {
          id: total[0],
          exchange: total[1],
          coin: total[2],
          portfolio: { render: `${total[3]}%`, isNumber: true },
          price: total[4],
          quantity: total[5],
          usd: total[6],
          reailizedPL: total[7],
          unrealizedPL: total[8],
          totalPL: total[9],
        },
      ]
    )
  }

  transformData = (data: any[] = [], red: string = '', green: string = '') => {
    const { numberOfDigitsAfterPoint: round } = this.state

    return data.map((row) => ({
      // exchange + coin always uniq
      //  change in future
      id: row.id,
      exchange: row.exchange,
      coin: { render: row.coin, style: { fontWeight: 700 } },
      portfolio: {
        render: `${roundPercentage(row.portfolioPercentage) || 0}%`,
        isNumber: true,
      },
      price: +roundAndFormatNumber(row.price, round, false),
      quantity: +roundAndFormatNumber(row.quantity, round, false),
      usd: +roundAndFormatNumber(row.price * row.quantity, round, false),
      reilizedPL: {
        render: +roundAndFormatNumber(row.realizedPL, round, false),
        color: row.realizedPL > 0 ? green : red,
      },
      unreilizedPL: {
        render: +roundAndFormatNumber(row.unrealizedPL, round, false),
        color: row.unrealizedPL > 0 ? green : red,
      },
      totalPL: {
        render: +roundAndFormatNumber(
          row.realizedPL + row.unrealizedPL,
          round,
          false
        ),
        color: row.totalPL > 0 ? green : red,
      },
    }))
  }

  putDataInTable = () => {
    const { theme, isUSDCurrently } = this.props
    const { tableData } = this.state

    return {
      head: [
        { id: nanoid(), label: 'exchange', isNumber: false },
        { id: nanoid(), label: 'coin', isNumber: false },
        { id: nanoid(), label: 'portfolio', isNumber: true },
        { id: nanoid(), label: 'price', isNumber: true },
        { id: nanoid(), label: 'quantity', isNumber: true },
        { id: nanoid(), label: isUSDCurrently ? 'usd' : 'BTC', isNumber: true },
        { id: nanoid(), label: 'realized P&L', isNumber: true },
        { id: nanoid(), label: 'Unrealized P&L', isNumber: true },
        { id: nanoid(), label: 'Total P&L', isNumber: true },
      ],
      body: this.transformData(
        tableData,
        theme.palette.red.main,
        theme.palette.green.main
      ),
      footer: this.calculateTotal(),
    }
  }

  onCheckboxClick = (id: string) =>
    this.setState({ checkedRows: onCheckBoxClick(this.state.checkedRows, id) })

  onSelectAllClick = (e: Event | undefined, selectAll = false) => {
    if ((e && e.target && e.target.checked) || selectAll) {
      this.setState((state) => ({
        checkedRows: state.tableData
          ? state.tableData.map((row: any, i: number) => row.id)
          : [],
      }))
      return
    }
    this.setState({ checkedRows: [] })
  }

  render() {
    const { checkedRows, currentSort, tableData } = this.state
    const { onSelectAllClick, putDataInTable } = this
    return (
      <PortfolioMain
        {...{
          ...this.props,
          onSelectAllClick,
          currentSort,
          putDataInTable,
          checkedRows,
          tableData,
          onCheckboxClick: this.onCheckboxClick,
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
