import {
  SortArgs,
  Args,
} from '@containers/Portfolio/components/PortfolioTable/types'
import { Theme } from '@material-ui/core'

export interface IProps {
  isUSDCurrently: boolean
  isSelectAll: boolean
  theme: Theme
  onSelectAll: Function
  onSortTable: Function
  currentSort: { arg: SortArgs; key: Args }
}

export interface IState {
  tableHeadings: { name: string; value: Args }[]
}
