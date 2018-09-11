export interface IProps {
  subscribeToMore: Function
  activeExchange: { index: number }
  currencyPair: string
  digitsAfterDecimalForAsksPrice: number
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForBidsPrice: number
  digitsAfterDecimalForBidsSize:number
  setOrders: Function
  data: 
}

export interface IState {
  asks: []
  bids: []
  spread: number
  digitsAfterDecimalForAsksPrice: number
  digitsAfterDecimalForAsksSize: number
  i: 0,
}