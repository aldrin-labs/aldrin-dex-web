export interface IProps {
  children: object
}

export interface IState {
  selectedBalances: number[] | null
  selectedActive: number[] | null
  areAllChecked: boolean
  areAllActiveChecked: boolean
  rows: any[]
  staticRows: any[]
  savedRows: any[]
}
