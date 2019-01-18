import { WithTheme } from '@material-ui/core'
import { Map } from 'typescript'
import moment from 'moment'
import { IRow, PortfolioType } from '@core/types/PortfolioTypes'

// TODO: We should have one type for price & portfolioPerc, deltaPrice in IRow


export type PortfolioWithRebalanceType = {
  name: string
  portfolioAssets: PortfolioType[]
  myRebalance: {
    total: string
    timestampSnapshot: number
    assets: IShapeOfRebalancePortfolioRow[]
  }
}

export interface IProps extends WithTheme {
  data: {
    myPortfolios: PortfolioWithRebalanceType[]
  }
  children: object
  isUSDCurrently: boolean
  isShownMocks: boolean
  baseCoin: string
  filterValueSmallerThenPercentage: number
  tab: string
  updateRebalanceMutationQuery: Function
  refetch: Function
  hideToolTip: Function
}

export interface IState {
  selectedActive: number[] | null
  areAllActiveChecked: boolean
  rows: IRow[]
  staticRows: IRow[]
  savedRows: IRow[]
  addMoneyInputValue: number | string
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
  key: number
  loading: boolean
  staticRowsMap: Map<string, string>
  openWarning: boolean
  isSystemError: boolean
  warningMessage: string
  totalSnapshotRows: string | number
  timestampSnapshot: moment.Moment | null
  timestampSnapshotSaved: moment.Moment | null
  isSaveError: boolean
  isCurrentAssetsChangedError: boolean
}

export interface IShapeOfRebalancePortfolioRow {
  _id: string
  id: string
  exchange: string
  coin: string
  percent: { $numberDecimal: string }
  amount: { $numberDecimal: string }
  diff: { $numberDecimal: string }
  isCustomAsset: boolean
  priceSnapshot: number
  percentSnapshot: number
}
