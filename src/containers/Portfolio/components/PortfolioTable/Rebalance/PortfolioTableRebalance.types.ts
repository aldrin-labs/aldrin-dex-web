export enum ISortArgs {
  exchange = 'exchange',
  symbol = 'symbol',
  portfolioPerc = 'portfolioPerc',
  price = 'price',
  trade = 'trade',
}

export interface IRow {
  exchange: string
  symbol: string
  price: number
  portfolioPerc?: number | string
  deltaPrice?: number
  editable?: boolean
}

export interface IProps {
  children: object
  isUSDCurrently: boolean
  isShownMocks: boolean
  filterValueSmallerThenPercentage: number
}

export interface IState {
  selectedActive: number[] | null
  areAllActiveChecked: boolean
  rows: IRow[]
  staticRows: IRow[]
  savedRows: IRow[]
  addMoneyInputValue: number | string
  currentSortForStatic: { key: string; arg: 'ASC' | 'DESC' } | null
  currentSortForDynamic: { key: string; arg: 'ASC' | 'DESC' } | null
  isEditModeEnabled: boolean
  undistributedMoney: number
  undistributedMoneySaved: number
  totalRows: number
  totalStaticRows: number
  totalSavedRows: number
  totalTableRows: number
  totalTableStaticRows: number
  totalTableSavedRows: number
  isPercentSumGood: boolean
  totalPercents: number | string
  leftBar: string
  rightBar: string
}
