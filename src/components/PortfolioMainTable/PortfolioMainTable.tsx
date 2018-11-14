import React, { Component } from 'react'
import { zip, isObject } from 'lodash-es'
import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'

import { getPortfolioMainQuery } from '@containers/Portfolio/api'
import QueryRenderer from '@components/QueryRenderer'
import { TableWithSort } from '@storybook-components/index'
import {
  combineTableData,
  roundAndFormatNumber,
  composePortfolioWithMocks,
  numberOfDigitsAfterPoint,
  roundPercentage,
  onCheckBoxClick,
  transformToNumber,
  addMainSymbol,
} from '@utils/PortfolioTableUtils'
import { Query } from 'react-apollo'
import { GET_BASE_COIN } from '../../queries/portfolio/getBaseCoin'
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
            const num = isObject(el) ? el.contentToSort : el
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
          const formatedSum = roundAndFormatNumber(
            sum,
            round,
            ind === 2 ? false : true
          )
          if (ind > 3) {
            total.push({
              render: formatedSum,
              isNumber: true,
              // colors for P&L
              style: ind > 6 && {
                color: sum > 0 ? green : sum < 0 ? red : '',
              },
            })
          } else {
            // here will be portfolio % column
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
          portfolio: {
            render: `${roundPercentage(+total[3])}%`,
            isNumber: true,
          },
          price: total[4],
          quantity: total[5],
          usd: {
            render: addMainSymbol(total[6].render, true),
            style: total[6].style,
            isNumber: total[6].isNumber,
          },
          reailizedPL: {
            render: addMainSymbol(total[7].render, true),
            style: total[7].style,
            isNumber: total[7].isNumber,
          },
          unrealizedPL: {
            render: addMainSymbol(total[8].render, true),
            style: total[8].style,
            isNumber: total[8].isNumber,
          },
          totalPL: {
            render: addMainSymbol(total[9].render, true),
            style: total[9].style,
            isNumber: total[9].isNumber,
          },
        },
      ]
    )
  }

  transformData = (data: any[] = [], red: string = '', green: string = '') => {
    const { numberOfDigitsAfterPoint: round } = this.state
    const isUSDCurrently = this.props.baseCoin === 'USDT'
    return data.map((row) => ({
      // exchange + coin always uniq
      //  change in future
      id: row.id,
      exchange: row.exchange,
      coin: { render: row.coin, style: { fontWeight: 700 } },
      portfolio: {
        // not formatted value for counting total in footer
        contentToSort: row.portfolioPercentage,
        render: `${roundPercentage(row.portfolioPercentage) || 0}%`,
        isNumber: true,
      },
      price: {
        contentToSort: row.price,
        render: addMainSymbol(
          roundAndFormatNumber(row.price, round, true),
          isUSDCurrently
        ),
        isNumber: true,
      },
      quantity: {
        contentToSort: row.quantity,
        render: roundAndFormatNumber(row.quantity, round, true),
        isNumber: true,
      },
      usd: {
        contentToSort: row.price * row.quantity,
        render: addMainSymbol(
          roundAndFormatNumber(row.price * row.quantity, round, true),
          isUSDCurrently
        ),
        isNumber: true,
      },
      realizedPL: {
        contentToSort: row.realizedPL,
        render: addMainSymbol(
          roundAndFormatNumber(row.realizedPL, round, true),
          isUSDCurrently
        ),
        isNumber: true,
        color: row.realizedPL > 0 ? green : row.realizedPL < 0 ? red : '',
      },
      unrealizedPL: {
        contentToSort: row.unrealizedPL,
        render: addMainSymbol(
          roundAndFormatNumber(row.unrealizedPL, round, true),
          isUSDCurrently
        ),
        isNumber: true,
        color: row.unrealizedPL > 0 ? green : row.unrealizedPL < 0 ? red : '',
      },
      totalPL: {
        contentToSort: row.totalPL,
        render: addMainSymbol(
          roundAndFormatNumber(row.totalPL, round, true),
          isUSDCurrently
        ),
        isNumber: true,
        color: row.totalPL > 0 ? green : row.totalPL < 0 ? red : '',
      },
    }))
  }

  putDataInTable = () => {
    const { theme, isUSDCurrently } = this.props
    const { tableData } = this.state

    return {
      head: [
        { id: 'exchange', label: 'exchange', isNumber: false },
        { id: 'coin', label: 'coin', isNumber: false },
        { id: 'portfolio', label: 'portfolio', isNumber: true },
        { id: 'price', label: 'price', isNumber: true },
        { id: 'quantity', label: 'quantity', isNumber: true },
        { id: 'usd', label: isUSDCurrently ? 'usd' : 'BTC', isNumber: true },
        { id: 'realizedPL', label: 'realized P&L', isNumber: true },
        { id: 'unrealizedPL', label: 'Unrealized P&L', isNumber: true },
        { id: 'totalPL', label: 'Total P&L', isNumber: true },
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
    const { checkedRows } = this.state
    const { onSelectAllClick, putDataInTable, onCheckboxClick } = this
    const { body, head, footer } = putDataInTable()

    return (
      <TableWithSort
        title="Portfolio"
        checkedRows={checkedRows}
        withCheckboxes={true}
        onChange={onCheckboxClick}
        onSelectAllClick={onSelectAllClick}
        data={{ body, footer }}
        columnNames={head}
      />
    )
  }
}

// change to renderProps
const APIWrapper = (props: any) => (
  <Query query={GET_BASE_COIN}>
    {({
      data: {
        portfolio: { baseCoin },
      },
    }) => (
      <QueryRenderer
        {...props}
        component={Container}
        query={getPortfolioMainQuery}
        variables={{ baseCoin }}
        baseCoin={baseCoin}
        isUSDCurrently={baseCoin === 'USDT'}
        // pollInterval={1 * 1 * 1000}
        fetchPolicy="network-only"
      />
    )}
  </Query>
)

export default withTheme()(APIWrapper)
