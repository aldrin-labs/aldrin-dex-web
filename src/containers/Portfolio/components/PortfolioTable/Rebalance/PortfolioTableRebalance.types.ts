export interface IRow {
  currency: string
  symbol: string
  price: number
  portfolioPerc?: number
  deltaPrice?: number
  editable?: boolean
}

export interface IProps {
  children: object
  isUSDCurrently: boolean
}

export interface IState {
  selectedActive: number[] | null
  areAllActiveChecked: boolean | null
  rows: IRow[] | null
  staticRows: IRow[] | null
  savedRows: IRow[] | null
  addMoneyInputValue: number | null
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
}
