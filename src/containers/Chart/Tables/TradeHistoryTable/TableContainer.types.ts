import { IActiveExchange } from '@containers/Chart/CommonTypes.types'

export interface IProps {
  data: {marketTickers: []}
  subscribeToMore: Function
  activeExchange: IActiveExchange
  currencyPair: string
}

export interface IState {
  data: []
  numbersAfterDecimalForPrice: number
}