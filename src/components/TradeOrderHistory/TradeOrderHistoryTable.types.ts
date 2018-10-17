import { Theme } from '@material-ui/core'

export interface IProps {
  theme: Theme
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

export interface RowProps {
  background: string
  evenBackground: string
}
