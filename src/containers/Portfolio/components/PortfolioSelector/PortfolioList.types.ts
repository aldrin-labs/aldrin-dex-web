import { IPortfolio } from '../../interfaces'

export interface IProps {
  portfolio: IPortfolio
  onLoad: Function
  selectAllKeys: Function
  selectAccount: Function
  selectedAccounts: any[]
  keys: {
    loading: any
    error: any
    getProfile: any
  }
  theme: any
}

export interface IState {
  allKeysSelected: boolean
}
