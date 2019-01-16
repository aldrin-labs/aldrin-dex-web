import React, { Component } from 'react'
import { zip, isObject, find, has, isEqual } from 'lodash-es'
import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import { Mutation, Query } from 'react-apollo'

import { getPortfolioMainQuery } from '@containers/Portfolio/api'
import QueryRenderer from '@components/QueryRenderer'
import {
  TableWithSort,
  addMainSymbol,
} from '@storybook/components/index'

import {
  combineTableData,
  roundAndFormatNumber,
  numberOfDigitsAfterPoint,
  roundPercentage,
} from '@utils/PortfolioTableUtils'
import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import { UPDATE_COINS } from '@core/graphql/mutations/portfolio/updateCoins'
import Loader from '@components/TablePlaceholderLoader/newLoader'
import { MOCK_DATA } from '@containers/Portfolio/components/PortfolioTable/dataMock'


const composePortfolioWithMocks = (
  portfolioAssets: any,
  isShownMocks = false
) => {
  if (!portfolioAssets) {
    return
  }

  return isShownMocks ? portfolioAssets.concat(MOCK_DATA) : portfolioAssets
}

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
    tableData: null,
    withOutSpinner: false,
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
      if (!has(data, 'myPortfolios') || !data.myPortfolios[0]) return
      const { portfolioAssets } = data.myPortfolios[0]

      if (!portfolioAssets) {
        return null
      }

      const composePortfolioAssetsWithMocks = composePortfolioWithMocks(
        portfolioAssets,
        isShownMocks
      )

      let checkedRows =
        portfolioAssets.length === 0 ? [] : prevState.checkedRows
      if (prevState.tableData === null && portfolioAssets.length > 0) {
        checkedRows = portfolioAssets.map((row: any, i: number) => row._id)
      }

      return {
        checkedRows,
        numberOfDigitsAfterPoint: numberOfDigitsAfterPoint(isUSDCurrently),
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

  shouldComponentUpdate(prevProps, prevState) {
    // need to be refactored this is not best optimization
    // just temporary fix
    return (
      this.state.tableData === null ||
      !isEqual(
        this.state.tableData.slice(0, 50),
        prevState.tableData.slice(0, 50)
      )
    )
  }

  //  footer of table
  calculateTotal = ({
    checkedRows,
    tableData,
    red,
    green,
    baseCoin,
    numberOfDigitsAfterPoint: round,
  }) => {
    const isUSDCurrently = baseCoin === 'USDT'

    let total: any[] | null = null
    if (tableData && checkedRows.length !== 0) {
      // show footer
      total = []
      // tranfsorm to the old shape this need to be refactored
      const data = this.transformData(tableData).map((row) => {
        const result = Object.values(row)
        // becouse portfolio has %
        result[3] = result[3].render
        return result
      })
      // check lodash docs (transforming rows into columns)
      zip(...data).forEach((column, ind) => {
        let sum: number | { render: string | number; style: object } = 0
        //  skip id, exchange , portfolioPercentages,
        //  coin, price and quantity columns
        if (ind > 3 && ind !== 4 && ind !== 5) {
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
          })

          // coloring text depends on value for P&L
          const formatedSum = roundAndFormatNumber(
            sum,
            round,
            ind === 2 ? false : true
          )

          total.push({
            render: formatedSum,
            isNumber: true,
            // colors for P&L
            style: ind > 6 && {
              color: sum > 0 ? green : sum < 0 ? red : '',
            },
          })
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
          portfolio: { render: '100%', isNumber: true },
          price: total[4],
          quantity: total[5],
          usd: {
            render: addMainSymbol(total[6].render, isUSDCurrently),
            style: total[6].style,
            isNumber: total[6].isNumber,
          },
          reailizedPL: {
            render: addMainSymbol(total[7].render, isUSDCurrently),
            style: total[7].style,
            isNumber: total[7].isNumber,
          },
          unrealizedPL: {
            render: addMainSymbol(total[8].render, isUSDCurrently),
            style: total[8].style,
            isNumber: total[8].isNumber,
          },
          totalPL: {
            render: addMainSymbol(total[9].render, isUSDCurrently),
            style: total[9].style,
            isNumber: total[9].isNumber,
          },
        },
      ]
    )
  }
  updateCoinsInApollo = (checkedRows, tableBody) => {
    const data = {
      data: {
        portfolioMain: {
          __typename: 'portfolioMain',
          coins: checkedRows.map((id: number) => ({
            __typename: id,
            ...find(tableBody, (row) => {
              return row.id === id
            }),
          })),
        },
      },
    }

    this.props.updateCoins({
      variables: {
        coins: data.data.portfolioMain.coins,
      },
    })
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
    const { theme, isUSDCurrently, baseCoin } = this.props
    const {
      checkedRows,
      tableData,
      numberOfDigitsAfterPoint: round,
      red,
      green,
    } = this.state
    if (!tableData) {
      return { head: [], body: [], footer: null }
    }

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
      footer: this.calculateTotal({
        checkedRows,
        tableData,
        baseCoin,
        red,
        green,
        numberOfDigitsAfterPoint: round,
      }),
    }
  }

  onSelectAllClick = (e: React.ChangeEvent<HTMLInputElement> | 'selectAll', selectAll = false) => {
    if ((e !== 'selectAll' && e && e.target && e.target.checked) || selectAll) {
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
    const { putDataInTable } = this
    const { checkedRows, tableData } = this.state
    const { body, head, footer } = putDataInTable()

    if (body.length === 0) {
      return <Loader />
    }

    this.updateCoinsInApollo(checkedRows, tableData)

    return (
      <TableWithSort
        id="PortfolioMainTable"
        title="Portfolio"
        columnNames={head}
        data={{ body, footer }}
        padding="dense"
      />
    )
  }
}

// change to renderProps
const APIWrapper = (props: any) => (
  <Mutation mutation={UPDATE_COINS}>
    {(updateCoins) => (
      <Query query={GET_BASE_COIN}>
        {({ data }) => {
          const baseCoin = (data.portfolio && data.portfolio.baseCoin) || 'USDT'

          return (
            <QueryRenderer
              {...props}
              updateCoins={updateCoins}
              component={Container}
              query={getPortfolioMainQuery}
              variables={{ baseCoin }}
              baseCoin={baseCoin}
              isUSDCurrently={baseCoin === 'USDT'}
              pollInterval={props.tab === 'main' ? 1 * 30 * 1000 : 0}
              withOutSpinner={true}
              fetchPolicy="network-only"
            />
          )
        }}
      </Query>
    )}
  </Mutation>
)

export default withTheme()(APIWrapper)
