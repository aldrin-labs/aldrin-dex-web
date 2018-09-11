import { Theme } from '@material-ui/core'
import { IOrder } from '@containers/Chart/Chart.types'
import { IExchange } from '@containers/Chart/Tables/ExchangesTable/Table/ExchangesTable.types'

export interface IProps {
  onButtonClick: () => void
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForAsksPrice: number
  quote: string
  data: IOrder[]
  theme: Theme
  tableExpanded: boolean
  activeExchange: { exchange: IExchange; index: number }
  currencyPair: string
}