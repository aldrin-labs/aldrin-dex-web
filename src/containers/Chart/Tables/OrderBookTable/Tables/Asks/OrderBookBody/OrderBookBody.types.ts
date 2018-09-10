import { IExchange } from '@containers/Chart/Tables/ExchangesTable/Table/ExchangesTable.types'
import { IOrder } from '@containers/Chart/Chart.types'
import { Theme } from '@material-ui/core'

export interface IProps {
  action: any
  activeExchange: { exchange: IExchange; index: number }
  background: any
  index: number
  tableExpanded: boolean
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForAsksPrice: number
  data: IOrder[]
  theme: Theme
}
