import { IExchange } from '@containers/Chart/CommonTypes.types'

export interface IExchangesTable {
  data: {marketByName: [{exchanges: IExchange[]}]}
  isShownMocks: boolean
}