import { IActiveExchange } from '@containers/Chart/CommonTypes.types'

export interface IProps {
  activeExchange: IActiveExchange
  view: string
  currencyPair: string
  isShownMocks: boolean
  showTableOnMobile: string
  selectExchange: Function
  toggleView: Function
  selectCurrencies: Function
  setOrders: Function
  theme: any
}

export interface IState {
  view: string
  orders: []
  exchangeTableCollapsed: boolean
  aggregation: number
  showTableOnMobile: string
  activeChart: string
  exchanges: []
  tradeHistory: []
}