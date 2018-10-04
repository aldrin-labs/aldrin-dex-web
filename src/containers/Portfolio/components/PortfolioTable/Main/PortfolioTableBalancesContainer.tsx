import React, { Component } from 'react'
import nanoid from 'nanoid'

import { getPortfolioMainQuery } from '@containers/Portfolio/api'
import QueryRenderer from '@components/QueryRenderer'
import PortfolioMain from './PortfolioTableBalances'
import {
  onValidateSum,
  onSortStrings,
  roundPercentage,
  calcAllSumOfPortfolioAsset,
  calcSumOfPortfolioAssetProfitLoss,
  dustFilter,
} from '@utils/PortfolioTableUtils'
import { MOCK_DATA } from '@containers/Portfolio/components/PortfolioTable/dataMock'
import { Args } from '@containers/Portfolio/components/PortfolioTable/types'
import { IPortfolio } from '@containers/Portfolio/interfaces'

const createColumn = (
  id: string | number = nanoid(),
  exchange: string = '',
  coin: string = '',
  portfolioPercentage: number = 0,
  price: number = 0,
  quantity: number = 0,
  currentPrice: number = 0,
  daily: number = 0,
  dailyPerc: number = 0,
  realizedPL: number = 0,
  unrealizedPL: number = 0,
  totalPL: number = 0
) => ({
  id,
  exchange,
  coin,
  portfolioPercentage,
  price,
  quantity,
  currentPrice,
  daily,
  dailyPerc,
  realizedPL,
  unrealizedPL,
  totalPL,
})

class Container extends Component {
  state: IState = {
    tableData: null,
    selectedBalances: null,
    selectedSum: createColumn(),
    currentSort: null,
    activeKeys: null,
    activeWallets: null,
    portfolio: null,
    checkedRows: [0, 1],
  }
  componentDidMount() {
    const {
      data: { getProfile: data },
      isShownMocks,
      switchToUsd,
    } = this.props

    switchToUsd()

    if (!data && isShownMocks) {
      this.setState({ portfolio: { assets: MOCK_DATA } }, () =>
        this.combineTableData({ assets: MOCK_DATA })
      )

      this.setState({ activeKeys: this.props.activeKeys })

      return
    } else if (!data) {
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

    this.setState({ portfolio: composeWithMocks }, () =>
      this.combineTableData(composeWithMocks)
    )

    this.setState({ activeKeys: this.props.activeKeys })
  }

  // rewrite into gdsfp
  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.data) {
      if (!nextProps.data.getProfile) return

      const { portfolio } = nextProps.data.getProfile

      if (!portfolio || portfolio === null) {
        return
      }

      const composeWithMocks = nextProps.isShownMocks
        ? {
            ...portfolio,
            assets: portfolio!.assets!.concat(MOCK_DATA),
            cryptoWallets: portfolio!.cryptoWallets!.concat([]),
          }
        : portfolio

      this.setState({ portfolio: composeWithMocks })
      this.combineTableData(composeWithMocks)
    }

    if (nextProps.subscription && nextProps.subscription.data) {
      const portfolio = Object.assign(
        this.state.portfolio,
        JSON.parse(nextProps.subscription.data.portfolioUpdate)
      )
      const composeWithMocks = nextProps.isShownMocks
        ? {
            ...portfolio,
            assets: portfolio.assets.concat(MOCK_DATA),
            cryptoWallets: portfolio.cryptoWallets.concat([]),
          }
        : portfolio

      this.setState({ portfolio: composeWithMocks })
      this.combineTableData(composeWithMocks)
    }

    if (nextProps.activeKeys) {
      this.setState({ activeKeys: nextProps.activeKeys }, () =>
        this.combineTableData(this.state.portfolio)
      )
    }

    if (nextProps.activeKeys && nextProps.activeKeys.length === 0) {
      this.setState({ selectedBalances: null })
    }
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevProps.isUSDCurrently !== this.props.isUSDCurrently) {
      const { portfolio } = this.state
      this.combineTableData(portfolio)
    }
  }

  combineTableData = (portfolio?: IPortfolio | null) => {
    const { activeKeys } = this.state

    const { isUSDCurrently, filterValueSmallerThenPercentage } = this.props
    if (!portfolio || !portfolio.assets || !activeKeys) {
      return
    }
    // TODO: I guess, filter Boolean should be first before map, because it will reduce the array first, without
    // performance loss by mapping elements that do not pass our requirements
    const { assets: portfolioAssets, cryptoWallets } = portfolio
    // checking that asset is array and have length more then 0
    const exchangeAssetsLength = portfolioAssets.length
      ? portfolioAssets.length + 1
      : 0
    const allSums = calcAllSumOfPortfolioAsset(
      portfolioAssets,
      isUSDCurrently,
      cryptoWallets
    )

    const walletData = cryptoWallets
      .map((row: any) => {
        const {
          baseAsset = {
            symbol: '',
            priceUSD: 0,
            priceBTC: 0,
            percentChangeDay: 0,
          },
          name = '',
          assets = [],
        } = row || {}

        return assets.map((walletAsset: any, i: number) => {
          // checking for props that we need
          if (
            !(
              walletAsset &&
              walletAsset.asset &&
              walletAsset.asset.priceUSD &&
              walletAsset.asset.priceBTC
            )
          ) {
            return {}
          }
          const mainPrice = isUSDCurrently
            ? walletAsset.asset.priceUSD
            : walletAsset.asset.priceBTC

          const currentPrice = mainPrice * walletAsset.balance
          const col = createColumn(
            i + exchangeAssetsLength,
            `${baseAsset.symbol} ${name}`,
            walletAsset.asset.symbol,
            +roundPercentage((currentPrice * 100) / allSums),
            mainPrice,
            +walletAsset.balance.toFixed(5),
            currentPrice
          )

          return col
        })
      })
      .reduce((a: any, b: any) => a.concat(b), [])

    let tableData = [
      portfolioAssets.map((row: any, i) => {
        const {
          asset = {
            symbol: '',
            priceUSD: 0,
            priceBTC: 0,
            percentChangeDay: 0,
          },
          quantity = 0,
          key = { name: '' },
          exchange = '',
        } = row || {}
        if (key === null || key.name === null) {
          return
        }
        if (activeKeys.indexOf(key.name) === -1) {
          return null
        }
        const { symbol = 0, priceUSD = 0, priceBTC = 0, percentChangeDay = 0 } =
          asset || {}
        const { name } = exchange

        const PL = calcSumOfPortfolioAssetProfitLoss(row.PL, isUSDCurrently)
        const mainPrice = isUSDCurrently ? priceUSD : priceBTC

        const currentPrice = mainPrice * quantity
        return createColumn(
          i,
          name,
          symbol,
          +roundPercentage((currentPrice * 100) / allSums),
          mainPrice,
          quantity,
          currentPrice,
          +roundPercentage((mainPrice / 100) * percentChangeDay),
          percentChangeDay,
          PL.realized,
          PL.unrealized,
          PL.total
        )
      }),
      walletData,
    ]
      .reduce((a: any, b: any) => a.concat(b), [])
      .filter(Boolean)

    tableData = dustFilter(tableData, filterValueSmallerThenPercentage)

    const selectAllLinesInTable = tableData.map((el) => el.id)

    this.setState({ tableData, selectedBalances: selectAllLinesInTable }, () =>
      this.calculateSum(this.state.selectedBalances)
    )
  }

  calculateSum = (selectedRows: number[] | null) => {
    const { tableData, defa } = this.state
    if (!tableData) {
      return
    }

    const sum = tableData.filter((elem) => selectedRows.indexOf(elem.id) !== -1)

    const reducedSum = sum.reduce(
      (acc: any, val: IRowT) => ({
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
      }),
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

    this.setState({ selectedSum: validateSum })
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
    const {
      selectedSum,
      checkedRows,
      currentSort,
      tableData,
      selectedBalances,
    } = this.state
    const { onCheckboxClick, onSelectAllClick } = this
    return (
      <PortfolioMain
        {...{
          ...this.props,
          selectedSum,
          onCheckboxClick,
          onSelectAllClick,
          currentSort,
          checkedRows,
          tableData,
          selectedBalances,
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
