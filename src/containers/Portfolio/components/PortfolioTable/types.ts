export interface RowT {
  currency: string
  symbol: string
  percentage: number
  price: number
  quantity: number
  currentPrice: number
  daily: number
  dailyPerc: number
  realizedPL: number
  realizedPLPerc: number
  unrealizedPL: number
  unrealizedPLPerc: number
  [key: string]: string | number
}

export interface State {
  tableData: RowT[] | null
  selectedBalances: string[] | null
  selectedSum: RowT
  currentSort: { arg: SortArgs; key: Args } | null
  isShownChart: boolean
  activeKeys: number[] | null
  portfolio: Portfolio | null
  isUSDCurrently: boolean
}

export interface Portfolio {
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
}

export enum SortArgs {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum Args {
  currency = 'currency',
  symbol = 'symbol',
  percentage = 'percentage',
  price = 'price',
  quantity = 'quantity',
  currentPrice = 'currentPrice',
  daily = 'daily',
  dailyPerc = 'dailyPerc',
  realizedPL = 'realizedPL',
  realizedPLPerc = 'realizedPLPerc',
  unrealizedPL = 'unrealizedPL',
  unrealizedPLPerc = 'unrealizedPLPerc',
}
