export interface IRow { }

export interface IProps {
  children: object
  isUSDCurrently: boolean
}

export interface IState {
  selectedBalances: number[] | null
  selectedActive: number[] | null
  areAllChecked: boolean
  areAllActiveChecked: boolean
  rows: any[]
  staticRows: any[]
  savedRows: any[]
  addMoneyInputValue: number
  activePercentInput: number | null
  activePercentInputValues: any[]
  currentSort: { key: string; arg: 'ASC' | 'DESC' } | null
  isEditModeEnabled: boolean
  isUSDCurrently: boolean
  isPercentSumGood: boolean
  totalRows: number
  undistributedMoney: number
}
