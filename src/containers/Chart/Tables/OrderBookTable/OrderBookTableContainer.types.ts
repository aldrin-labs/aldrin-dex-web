import { IOrder, IActiveExchange } from '@containers/Chart/CommonTypes.types'

export interface IProps {
  subscribeToMore: Function
  activeExchange: IActiveExchange
  currencyPair: string
  digitsAfterDecimalForAsksPrice: number
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForBidsPrice: number
  digitsAfterDecimalForBidsSize: number
  setOrders: Function
  data: { marketOrders: any[] }
}

export interface IState {
  asks: IOrder[]
  bids: IOrder[]
  spread: number
  digitsAfterDecimalForAsksPrice: number
  digitsAfterDecimalForAsksSize: number
  i: number,
}