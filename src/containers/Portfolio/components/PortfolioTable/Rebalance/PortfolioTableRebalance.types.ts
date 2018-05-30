export interface IRow {

}

export interface IProps {
  children: object
}

export interface IState {
  selectedBalances: number[] | null
  selectedActive: number[] | null
  areAllChecked: boolean
  areAllActiveChecked: boolean
  rows: IRow[]
  staticRows: IRow[]
  savedRows: IRow[]
  addMoneyInputValue: number
  activePercentInput: number | null
  activePercentInputValue: number
  currentSort: { key: string; arg: 'ASC' | 'DESC' } | null
}
