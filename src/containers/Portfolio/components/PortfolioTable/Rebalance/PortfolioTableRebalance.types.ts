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
}

export interface IRow {
  currency: string
  symbol?: string
  portfolioPerc?: number
  price: number
  undistributedMoney?: number
}
