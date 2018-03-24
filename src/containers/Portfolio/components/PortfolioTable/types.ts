export interface RowT {
  currency: string
  symbol: string
  available: number
  held: number
  total: number
  exchangeRate: number
  usdValue: number
  btcValue: number
  [key: string]: string | number
}

export interface State {
  tableData: RowT[]
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
  available = 'available',
  held = 'held',
  total = 'total',
  exchangeRate = 'exchangeRate',
  usdValue = 'usdValue',
  btcValue = 'btcValue',
}
