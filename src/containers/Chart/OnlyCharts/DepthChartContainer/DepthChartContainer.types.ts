import { IExchange } from '@containers/Chart/Tables/ExchangesTable/Table/ExchangesTable.types'

export interface IProps {
  activeExchange: { exchange: IExchange; index: number }
  animated: boolean
  base: string
  quote: string
  theme: any
}
