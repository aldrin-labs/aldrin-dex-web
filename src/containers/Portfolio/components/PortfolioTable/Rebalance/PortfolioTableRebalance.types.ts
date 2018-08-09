export type ISortArgs = 'exchange' | 'symbol' | 'portfolioPerc' | 'price' | 'trade';

// TODO: We should have one type for price & portfolioPerc in IRow

export interface IRow {
  exchange: string
  symbol: string
  price: number | string
  portfolioPerc: number | string | null
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

export interface IShapeOfRebalancePortfolioRow {
  id: string
  _id: { exchange: string; coin: string }
  percent: { $numberDecimal: string }
  amount: { $numberDecimal: string }
  diff: { $numberDecimal: string }
}

export interface IShapeOfCurrentPortolioRow {
  value: number
  exchange: { name: string }
  asset: { symbol: string; priceUSD: string }
}

export interface IGetMyRebalanceQuery {

}
