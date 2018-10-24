export interface IPortfolio {
  name: string | null
  processing: boolean | null
  assetIds: T<string | null> | null
  assets: T<{
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
}

export interface IObj {
  currency: string
  symbol: string
  industry: string
  price: number
  portfolioPerf: number
  industryPerf: number
  [key: string]: any
}

export interface IState {
  expandedRows: number[]
  chartData: any[]
  industryData: IObj[] | null
  portfolio: IPortfolio | null
  activeKeys: number[] | null
  currentSort: { key: string; arg: 'ASC' | 'DESC' } | null
}
