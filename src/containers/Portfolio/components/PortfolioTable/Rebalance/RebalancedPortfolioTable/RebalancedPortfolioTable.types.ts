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
  onAddRowButtonClick: Function
  onDeleteRowClick: Function
  onPercentInputChange: Function
  onBlurPercentInput: Function
  onFocusPercentInput: Function
  onAddMoneyInputChange: Function
  onFocusAddMoneyInput: Function
  onAddMoneyButtonPressed: Function
  onDeleteUndistributedMoney: Function
  handleSelectChange: Function
  onSelectActiveBalance: Function
  onSelectAllActive: React.ChangeEventHandler
  onSaveClick: Function
  onReset: Function
  onDistribute: Function
  onEditModeEnable: Function
  updateState: Function
}

export interface IState {

}
