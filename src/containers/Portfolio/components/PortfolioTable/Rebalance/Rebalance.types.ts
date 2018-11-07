import { WithTheme } from '@material-ui/core'

export type ISortArgs = 'exchange' | 'symbol' | 'portfolioPerc' | 'price' | 'trade';

// TODO: We should have one type for price & portfolioPerc, deltaPrice in IRow

export interface IRow {
  exchange: string
  symbol: string
  price: string
  portfolioPerc: number | string | null
  deltaPrice?: number | string
  editable?: boolean
}

export interface IProps extends WithTheme {
  children: object
  isUSDCurrently: boolean
  isShownMocks: boolean
  baseCoin: string
  filterValueSmallerThenPercentage: number
  getMyPortfolio: IGetMyPortfolioQuery
  updateRebalanceMutationQuery: Function
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
  undistributedMoney: string
  undistributedMoneySaved: string
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
  run: boolean
  key: number
  loading: boolean
}

export interface ICurrentSort {
  key: string
  arg: 'ASC' | 'DESC'
}

export interface IShapeOfRebalancePortfolioRow {
  id: string
  // _id: { exchange: string; coin: string }
  exchange: string
  coin: string
  percent: { $numberDecimal: string }
  amount: { $numberDecimal: string }
  diff: { $numberDecimal: string }
}

export interface IShapeOfCurrentPortolioRow {
  quantity: number | string
  exchange: { name: string }
  asset: { symbol: string; priceUSD: string }
}


/* tslint:disable */
// This file was automatically generated and should not be edited.


//==============================================================
// START Enums and Input Objects
//==============================================================

export interface rebalanceInput {
  assets?: assetList | null;
  total?: string | null;
}

export interface assetList {
  input?: (asset | null)[] | null;
}

export interface asset {
  _id?: _id | null;
  percent?: string | null;
  amount?: string | null;
  diff?: string | null;
}

export interface _id {
  exchange?: string | null;
  coin?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================



// ====================================================
// GraphQL mutation operation: IUpdateRebalanceMutation
// ====================================================

export interface IUpdateRebalanceMutation_updateRebalance {
  total: any | null;
}

export interface IUpdateRebalanceMutation {
  updateRebalance: IUpdateRebalanceMutation_updateRebalance | null;
}

export interface IUpdateRebalanceMutationVariables {
  input?: rebalanceInput | null;
}
