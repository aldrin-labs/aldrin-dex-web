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

export interface IProps {
  children: object
  isUSDCurrently: boolean
  isShownMocks: boolean
  filterValueSmallerThenPercentage: number
  getMyRebalance: IGetMyRebalanceQuery
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

export interface ICurrentSort {
  key: string
  arg: 'ASC' | 'DESC'
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


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IGetMyRebalanceQuery
// ====================================================

export interface IGetMyRebalanceQuery_getProfile_myRebalance_assets {
  id: any | null;
  _id: any | null;
  percent: any | null;
  amount: any | null;
  diff: any | null;
}

export interface IGetMyRebalanceQuery_getProfile_myRebalance {
  total: any | null;
  assets: (IGetMyRebalanceQuery_getProfile_myRebalance_assets | null)[] | null;
}

export interface IGetMyRebalanceQuery_getProfile {
  myRebalance: IGetMyRebalanceQuery_getProfile_myRebalance | null;
}

export interface IGetMyRebalanceQuery {
  getProfile: IGetMyRebalanceQuery_getProfile | null;
}



/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IGetMyPortfolioQuery
// ====================================================

export interface IGetMyPortfolioQuery_getProfile_portfolio_assets_exchange {
  name: string | null;
}

export interface IGetMyPortfolioQuery_getProfile_portfolio_assets_asset {
  symbol: string | null;
  priceUSD: string | null;
}

export interface IGetMyPortfolioQuery_getProfile_portfolio_assets {
  value: number | null;
  exchange: IGetMyPortfolioQuery_getProfile_portfolio_assets_exchange | null;
  asset: IGetMyPortfolioQuery_getProfile_portfolio_assets_asset | null;
}

export interface IGetMyPortfolioQuery_getProfile_portfolio {
  assetIds: (any | null)[] | null;
  assets: (IGetMyPortfolioQuery_getProfile_portfolio_assets | null)[] | null;
}

export interface IGetMyPortfolioQuery_getProfile {
  portfolio: IGetMyPortfolioQuery_getProfile_portfolio | null;
}

export interface IGetMyPortfolioQuery {
  getProfile: IGetMyPortfolioQuery_getProfile | null;
}

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
