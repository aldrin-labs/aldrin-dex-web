import { Theme } from '@material-ui/core'
import { IExchange } from '@containers/Chart/Tables/ExchangesTable/Table/ExchangesTable.types'

export interface IProps {
  activeExchange: { exchange: IExchange; index: number }
  currencyPair: string
  aggregation: number
  spread: number
  theme: Theme
  quote: string
  data: any
  digitsAfterDecimalForSpread: number
  digitsAfterDecimalForBidsSize: number
  digitsAfterDecimalForBidsPrice: number
}
