import { IRow } from '../Rebalance.types'

export interface IProps {
  rows: IRow[]
  staticRows: IRow[]
  currentSortForDynamic: { key: string; arg: 'ASC' | 'DESC' } | null
  totalRows: number | string
  selectedActive: number[] | null
  areAllActiveChecked: boolean
  totalTableRows: number | string
  totalPercents: number | string
  isPercentSumGood: boolean
  undistributedMoney: number | string
  isUSDCurrently: boolean
  addMoneyInputValue: number | string
  isEditModeEnabled: boolean
  onSortTable: Function
  onSaveClick: Function
  onReset: Function
  onEditModeEnable: Function
  updateState: Function
}

export interface IState {

}
