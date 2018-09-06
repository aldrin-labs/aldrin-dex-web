
export interface IProps {

}

export interface IState {
  currentSort: { key: string; arg: 'ASC' | 'DESC' } | null
}

export interface ICurrentSort {
  key: string
  arg: 'ASC' | 'DESC'
}

export interface ITradeOrderHistoryTableData {
  amount: number
  cost: number
  datetime: string
  symbol: string
  side: string
}
