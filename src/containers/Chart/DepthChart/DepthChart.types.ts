import { Theme } from '@material-ui/core'
import { IOrder } from '../Chart.types'

export interface DepthChartProps {
  base: string
  quote: string
  animated: boolean
  asks: IOrder[]
  bids: IOrder[]
  xAxisTickTotal: number
  theme: Theme
  midMarketPrice: number
}

export interface DepthChartState {
  MAX_DOMAIN_PLOT: number
  crosshairValuesForSpread: Array<any>
  crosshairValuesForOrder: Array<any>
  nearestOrderXIndex: number
  nearestSpreadXIndex: number
  transformedAsksData: Array<any>
  transformedBidsData: Array<any>
}