import { Portfolio } from '../../interfaces'

export interface IProps {
  portfolio: Portfolio
  onLoad: Function
  selectAllKeys: Function
  selectAccount: Function
  selectedAccounts: any[]
}

export interface IState {
  allKeysSelected: boolean
}
