export interface IProps {
  data: {marketTickers: []}
  subscribeToMore: () => any
  activeExchange: {index: number}
  currencyPair: string
}

export interface IState {
  data: []
  numbersAfterDecimalForPrice: number
}