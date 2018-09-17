import { IActiveExchange, IExchange } from '@containers/Chart/CommonTypes.types'

export interface IProps {
  onButtonClick: Function
  changeExchange: Function
  activeExchange: IActiveExchange
  exchanges: IExchange[]
  theme: any
}
