import { SortArgs, Args } from '@containers/Portfolio/components/PortfolioTable/types'

export interface IProps {
  isUSDCurrently: boolean
  isSelectAll: boolean
  onSelectAll: Function
  onSortTable: Function
  currentSort: { arg: SortArgs; key: Args }
}

export interface IState {
  tableHeadings: { name: string; value: Args }[]
}
