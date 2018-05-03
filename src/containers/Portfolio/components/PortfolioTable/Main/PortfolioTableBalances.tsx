import * as React from 'react'
import styled from 'styled-components'
import PortfolioTableMain from './PortfolioTableMain'
import PortfolioTableSum from '../PortfolioTableSum'
import PortfolioTableHead from './PortfolioTableHead'
import {
  onValidateSum,
  onSortStrings,
  calcPercentage,
} from '../../../../../utils/PortfolioTableUtils'
import { MOCK_DATA } from '../dataMock'
import { State, Args } from '../types'
import { TableProps, Portfolio } from '../../../interfaces'
import { IProps, IState } from 'PortfolioTableBalances.types'

const defaultSelectedSum = {
  currency: '',
  symbol: '',
  percentage: 0,
  price: 0,
  quantity: 0,
  currentPrice: 0,
  daily: 0,
  dailyPerc: 0,
  realizedPL: 0,
  realizedPLPerc: 0,
  unrealizedPL: 0,
  unrealizedPLPerc: 0,
  totalPL: 0,
}

export default class PortfolioTableBalances extends React.Component<
  IProps,
  IState
> {
  state: IState = {
    tableData: null,
    selectedBalances: null,
    selectedSum: defaultSelectedSum,
    currentSort: null,
    activeKeys: null,
    portfolio: null,
  }

  componentDidMount() {
    const { data } = this.props
    if (!data) {
      const portfolio = { assets: MOCK_DATA }
      this.setState({ portfolio })
      this.combineTableData(portfolio)
    }
  }

  componentWillReceiveProps(nextProps: TableProps) {
    if (nextProps.data) {
      const { portfolio } = nextProps.data
      console.log(portfolio)

      if (!portfolio) return
      const composeWithMocks = {
        ...portfolio,
        assets: portfolio.assets.concat(MOCK_DATA),
      }

      this.setState({ portfolio: composeWithMocks })
      this.combineTableData(composeWithMocks)
    }

    if (nextProps.subscription && nextProps.subscription.data) {
      const portfolio = Object.assign(
        this.state.portfolio,
        JSON.parse(nextProps.subscription.data.portfolioUpdate)
      )
      const composeWithMocks = {
        ...portfolio,
        assets: portfolio.assets.concat(MOCK_DATA),
      }
      this.setState({ portfolio: composeWithMocks })
      this.combineTableData(composeWithMocks)
    }

    if (nextProps.checkboxes) {
      this.setState({ activeKeys: nextProps.checkboxes }, () =>
        this.combineTableData(this.state.portfolio)
      )
    }

    if (nextProps.checkboxes && nextProps.checkboxes.length === 0) {
      this.setState({ selectedBalances: null, selectedSum: defaultSelectedSum })
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.isUSDCurrently !== this.props.isUSDCurrently) {
      const { portfolio } = this.state
      this.combineTableData(portfolio)
    }
  }

  combineTableData = (portfolio?: Portfolio) => {
    const { activeKeys } = this.state
    const { isUSDCurrently } = this.props
    if (!portfolio || !portfolio.assets || !activeKeys) return
    const { assets } = portfolio

    const allSums = assets.filter(Boolean).reduce((acc, curr) => {
      const { value = 0, asset = { priceUSD: 0 } } = curr || {}
      if (!value || !asset || !asset.priceUSD || !asset.priceBTC) return null
      const price = isUSDCurrently ? asset.priceUSD : asset.priceBTC
      return acc + value * Number(price)
    }, 0)

    const tableData = assets
      .map((row) => {
        const {
          asset = { symbol: '', priceUSD: 0, priceBTC: 0, percentChangeDay: 0 },
          value = 0,
          key = { name: '' },
          exchange = '',
          usdRealizedProfit = 0,
          btcRealizedProfit = 0,
          usdUnrealizedProfit = 0,
          btcUnrealizedProfit = 0,
        } =
          row || {}
        if (activeKeys.indexOf(key.name) === -1) return null
        const { symbol, priceUSD, priceBTC, percentChangeDay } = asset || {}
        const { name } = exchange

        const mainPrice = isUSDCurrently ? priceUSD : priceBTC
        const realizedProfit = isUSDCurrently
          ? usdRealizedProfit
          : btcRealizedProfit
        const unrealizedProfit = isUSDCurrently
          ? usdUnrealizedProfit
          : btcUnrealizedProfit

        const currentPrice = mainPrice * value
        const col = {
          currency: name || '',
          symbol,
          percentage: calcPercentage(currentPrice / allSums * 100),
          price: mainPrice || 0,
          quantity: value || 0,
          currentPrice: currentPrice || 0,
          daily: calcPercentage(mainPrice / 100 * percentChangeDay),
          dailyPerc: percentChangeDay,
          realizedPL: realizedProfit,
          realizedPLPerc: 0,
          unrealizedPL: unrealizedProfit + currentPrice,
          unrealizedPLPerc: 0,
          totalPL: realizedProfit + currentPrice + unrealizedProfit,
        }

        return col
      })
      .filter(Boolean)
    this.setState({ tableData }, () =>
      this.calculateSum(this.state.selectedBalances)
    )
  }

  onSelectAll = () => {
    const { selectedBalances, tableData } = this.state
    if (!tableData) return

    if (selectedBalances && selectedBalances.length === tableData.length) {
      this.setState({ selectedBalances: null, selectedSum: defaultSelectedSum })
    } else {
      const allRows = tableData.map((ck, idx) => idx)

      this.setState({ selectedBalances: allRows }, () =>
        this.calculateSum(allRows)
      )
    }
  }

  calculateSum = (selectedRows: number[] | null) => {
    const { tableData } = this.state
    if (!tableData) return

    if (!selectedRows) {
      this.setState({ selectedSum: defaultSelectedSum })
      return
    }

    const sum = tableData.filter((td, idx) => selectedRows.indexOf(idx) >= 0)
    const reducedSum = sum.reduce(
      (acc, val) => {
        return {
          currency: val.currency,
          symbol: val.symbol,
          percentage: Number(acc.percentage) + Number(val.percentage),
          price: '',
          quantity: '',
          currentPrice: Number(acc.currentPrice) + Number(val.currentPrice),
          // daily: Number(acc.daily) + Number(val.daily),
          // dailyPerc: Number(acc.dailyPerc) + Number(val.dailyPerc),
          realizedPL: Number(acc.realizedPL) + Number(val.realizedPL),
          // realizedPLPerc:
          //   Number(acc.realizedPLPerc) + Number(val.realizedPLPerc),
          unrealizedPL: Number(acc.unrealizedPL) + Number(val.unrealizedPL),
          totalPL: Number(acc.totalPL) + Number(val.totalPL),
          // unrealizedPLPerc:
          //   Number(acc.unrealizedPLPerc) + Number(val.unrealizedPLPerc),
        }
      },
      {
        currency: '',
        symbol: '',
        percentage: 0,
        price: 0,
        quantity: 0,
        currentPrice: 0,
        daily: 0,
        dailyPerc: 0,
        realizedPL: 0,
        totalPL: 0,
        realizedPLPerc: 0,
        unrealizedPL: 0,
        unrealizedPLPerc: 0,
        totalPL: 0,
      }
    )
    const { selectedBalances } = this.state
    const { isUSDCurrently } = this.props

    const validateSum = onValidateSum(
      reducedSum,
      selectedBalances,
      tableData,
      isUSDCurrently
    )
    console.log('validateSum: ', validateSum)
    this.setState({ selectedSum: validateSum })
  }

  onSelectBalance = (index: number) => {
    const selectedBalances =
      (this.state.selectedBalances && this.state.selectedBalances.slice()) || []

    const hasIndex = selectedBalances.indexOf(index)
    if (hasIndex >= 0) {
      selectedBalances.splice(hasIndex, 1)
    } else {
      selectedBalances.push(index)
    }

    this.setState({ selectedBalances }, () =>
      this.calculateSum(selectedBalances)
    )
  }

  onSortTable = (key: Args) => {
    const { tableData, currentSort } = this.state
    if (!tableData) return

    const stringKey =
      key === 'currency' || key === 'symbol' || key === 'industry'

    const newData = tableData.slice().sort((a, b) => {
      if (currentSort && currentSort.key === key) {
        if (currentSort.arg === 'ASC') {
          this.setState({ currentSort: { key, arg: 'DESC' } })

          if (stringKey) {
            return onSortStrings(b[key], a[key])
          }
          return b[key] - a[key]
        } else {
          this.setState({ currentSort: { key, arg: 'ASC' } })

          if (stringKey) {
            return onSortStrings(a[key], b[key])
          }
          return a[key] - b[key]
        }
      }
      this.setState({ currentSort: { key, arg: 'ASC' } })

      if (stringKey) {
        return onSortStrings(a[key], b[key])
      }
      return a[key] - b[key]
    })

    this.setState({ tableData: newData })
  }

  render() {
    const { isShownChart, isUSDCurrently } = this.props

    const { selectedSum, currentSort, tableData, selectedBalances } = this.state

    const isSelectAll =
      (tableData &&
        selectedBalances &&
        selectedBalances.length === tableData.length) ||
      false

    return (
      <Wrapper style={isShownChart ? { height: '30vh' } : {}}>
        <PTable>
          <PortfolioTableHead
            isUSDCurrently={isUSDCurrently}
            isSelectAll={isSelectAll}
            onSelectAll={this.onSelectAll}
            onSortTable={this.onSortTable}
            currentSort={currentSort}
          />
          <PortfolioTableMain
            tableData={tableData}
            selectedBalances={selectedBalances}
            isUSDCurrently={isUSDCurrently}
            onSelectBalance={this.onSelectBalance}
          />
          {selectedSum.currency && (
            <PortfolioTableSum
              selectedSum={selectedSum}
              isUSDCurrently={isUSDCurrently}
            />
          )}
        </PTable>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  background-color: #393e44;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`

const PTable = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
`
