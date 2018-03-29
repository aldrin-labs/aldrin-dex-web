export interface RowT {
  currency: string
  symbol: string
  percentage: number
  price: number
  quantity: number
  priceUSD: number
  priceBTC: number
  usdDaily: number
  btcDaily: number
  usdpl: number
  btcpl: number
  [key: string]: string | number
}

export interface State {
  tableData: RowT[] | null
  selectedBalances: string[] | null
  selectedSum: RowT
  currentSort: { arg: SortArgs; key: Args } | null
  isShownChart: boolean
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
  priceUSD = 'priceUSD',
  priceBTC = 'priceBTC',
  usdDaily = 'usdDaily',
  btcDaily = 'btcDaily',
  usdpl = 'usdpl',
  btcpl = 'btcpl',
}
