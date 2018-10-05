export interface IRowT {
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

export interface IState {
  tableData: IRowT[] | null
  isShownChart: boolean
  portfolio: IPortfolio | null
  isUSDCurrently: boolean
  tab: 'main' | 'industry' | 'rebalance' | 'correlation' | 'optimization'
}

export interface IPortfolio {
  name: string | null
  processing: boolean | null
  cryptoWalletIds: (string | null)[] | null
  cryptoWallets:
    | ({
        _id: string
        address: string | null
        baseAssetId: string | null
        baseAsset: {
          name: string | null
          symbol: string | null
        } | null
        assetIds: (string | null)[] | null
        assets:
          | ({
              _id: string
              balance: number | null
              assetId: string | null
              asset: {
                name: string | null
                symbol: string | null
                priceUSD: number | null
                priceBTC: number | null
              } | null
            } | null)[]
          | null
      } | null)[]
    | null
  assetIds: (string | null)[] | null
  assets:
    | ({
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
          priceBTC: string | null
        } | null
        exchange: {
          name: string | null
        } | null
        key: {
          name: string | null
          apiKey: string | null
        } | null
      } | null)[]
    | null
}

export enum SortArgs {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum Args {
  industry = 'industry',
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
