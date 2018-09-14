import { IRow } from '../Rebalance.types'

export interface IProps {
  isUSDCurrently: boolean
  currentSortForStatic: { key: string; arg: 'ASC' | 'DESC' } | null
  totalStaticRows: string | number
  staticRows: IRow[]
  filterValueSmallerThenPercentage: number
  onSortTable: Function
}

export interface IState {

}
