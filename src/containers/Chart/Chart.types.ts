export interface IOrder {
  price: number | string
  size: number | string
  type: 'ask' | 'bid'
}

export interface IProps {
  activeExchange: {index: number, exchange: {name: string, symbol: string}}
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