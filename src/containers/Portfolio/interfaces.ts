import { getPortfolioQuery } from './annotations'

export interface IProps {
  data: { getProfile: getPortfolioQuery; loading: boolean; error?: string }
}

export interface IPortfolio {
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
      priceBTC: string | null
    } | null
    exchange: {
      name: string | null
    } | null
    key: {
      name: string | null
      apiKey: string | null
    } | null
  } | null> | null
}

export interface IndProps {
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
          priceBTC: string | null
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

  checkboxes: number[]
  isUSDCurrently: boolean
}

export interface ITableProps {
  isShownChart: boolean
  loading: boolean
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
          priceBTC: string | null
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

  checkboxes: number[]
  subscription: any
}
