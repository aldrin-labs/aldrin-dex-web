import { IRowT, SortArgs, Args, IPortfolio } from '../types'

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
  isUSDCurrently: boolean
  checkboxes: number[]
  subscription: any
  tab: string
  data: {
    portfolioId: string | null
    portfolio: {
      name: string | null
      processing: boolean | null
      assetIds: Array<string | null> | null
      assets: Array<{
        _id: string
        assetId: string | null
        exchangeId: string | null
        keyId: string | null
        value: number | null
        realizedProfit: number | null
        unrealizedProfit: number | null
        totalProfit: number | null
        asset: {
          name: string | null
          symbol: string | null
          priceUSD: string | null
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


export interface InewRowT {
  _id: string
  asset: {
    name: string | null
    priceUSD: number | null
    priceBTC: number | null
    symbol: string | null
    percentChangeDay: number | null
  },
  assetId: string | null
  btcRealizedProfit: number | null
  btcTotalProfit: number | null
  btcUnrealizedProfit: number | null
  exchange: {
    name: string | null
  },
  exchangeId: string | null
  key: {
    apiKey: string | null
    name: string | null
  },
  keyId: string | null
  usdRealizedProfit: number | null
  usdTotalProfit: number | null
  usdUnrealizedProfit: number | null
  value: number | null
}
