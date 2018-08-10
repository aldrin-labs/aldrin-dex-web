export type ISortArgs = 'exchange' | 'symbol' | 'portfolioPerc' | 'price' | 'trade';

// TODO: We should have one type for price & portfolioPerc, deltaPrice in IRow

export interface IRow {
  exchange: string
  symbol: string
  price: number | string
  portfolioPerc: number | string | null
  deltaPrice?: number | string
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
  undistributedMoney: number | string
  undistributedMoneySaved: number | string
  totalRows: number | string
  totalStaticRows: number | string
  totalSavedRows: number | string
  totalTableRows: number | string
  totalTableStaticRows: number | string
  totalTableSavedRows: number | string
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
  value: number | string
  exchange: { name: string }
  asset: { symbol: string; priceUSD: string }
}

export interface IGetMyRebalanceQuery {

}
