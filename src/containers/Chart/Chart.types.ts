import { IActiveExchange } from '@containers/Chart/CommonTypes.types'

export interface IProps {
  isNoCharts: boolean
  activeExchange: IActiveExchange
  view: string
  currencyPair: string
  isShownMocks: boolean
  showTableOnMobile: string
  selectExchange: Function
  toggleView: Function
  selectCurrencies: Function
  setOrders: Function
  addChart: (currencyPair: string) => void
  theme: any
}

export interface IState {
  view: string
  orders: any[]
  exchangeTableCollapsed: boolean
  aggregation: number
  showTableOnMobile: string
  activeChart: string
  exchanges: any[]
  tradeHistory: any[]
  joyride: boolean
}