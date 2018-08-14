import { IOrder } from '../../../Chart.types'

export interface IProps {
  data: { marketOrders?: IOrder[] }
}
export interface IState {
  asks: IOrder[]
  bids: IOrder[]
}
