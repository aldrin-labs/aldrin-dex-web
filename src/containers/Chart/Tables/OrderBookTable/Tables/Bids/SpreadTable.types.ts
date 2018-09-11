import { Theme } from '@material-ui/core'
import { IActiveExchange } from '@containers/Chart/CommonTypes.types'

export interface IProps {
  activeExchange: IActiveExchange
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
