import { IRow } from '../PortfolioTableRebalance.types'

export interface IProps {
  isUSDCurrently: boolean
  currentSortForStatic: { key: string; arg: 'ASC' | 'DESC' } | null
  totalStaticRows: string | number
  staticRows: IRow[]
  filterValueSmallerThenPercentage: Function
  onSortTable: Function
}

export interface IState {

}
