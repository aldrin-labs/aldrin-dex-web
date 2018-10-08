import {
  IRowT,
  SortArgs,
  Args,
  IPortfolio,
} from '@containers/Portfolio/components/PortfolioTable/types'
import { Theme } from '@material-ui/core'

export interface IState {
  tableData: IRowT | null
  selectedBalances: number[] | null
  selectedSum: IRowT | null
  currentSort: { arg: SortArgs; key: Args } | null
  activeKeys: number[] | null
  portfolio: IPortfolio | null
}

export interface IProps {
  isShownChart: boolean
  theme: Theme
  filterValueSmallerThenPercentage: number | undefined
  isUSDCurrently: boolean
  activeKeys: number[]
  subscription: any
  tab: string
  classes: { [key: string]: string }
  data: {
    portfolioId: string | null
    portfolio: {
      name: string | null
      processing: boolean | null
      cryptoWalletIds: Array<string | null> | null
      cryptoWallets: Array<{
        _id: string
        address: string | null
        baseAssetId: string | null
        baseAsset: {
          name: string | null
          symbol: string | null
        } | null
        assetIds: Array<string | null> | null
        assets: Array<{
          _id: string
          balance: number | null
          assetId: string | null
          asset: {
            name: string | null
            symbol: string | null
            priceUSD: number | null
            priceBTC: number | null
          } | null
        } | null> | null
      } | null> | null
      assetIds: Array<string | null> | null
      assets: Array<{
        _id: string
        assetId: string | null
        exchangeId: string | null
        keyId: string | null
        quantity: number | null
        realizedProfit: number | null
        unrealizedProfit: number | null
        totalProfit: number | null
        asset: {
          name: string | null
          symbol: string | null
          priceUSD: number | null
        } | null
        exchange: {
          name: string | null
        } | null
        key: {
          name: string | null
          apiKey: string | null
        } | null
      } | null> | null
    } | null
  } | null
}
