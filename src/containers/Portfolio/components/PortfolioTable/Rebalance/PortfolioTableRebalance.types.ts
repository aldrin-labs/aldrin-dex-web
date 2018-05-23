export interface IProps {
  children: object
}

export interface IState {
  selectedBalances: number[] | null
  areAllChecked: boolean
  rows: any[]
  staticRows: any[]
  savedRows: any[]
}
