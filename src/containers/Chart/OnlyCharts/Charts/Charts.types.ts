export interface IChartProps {
  currencyPair: string
  removeChart: Function
  index: number
  chartsCount: number
  theme: any
}
export interface IChartState {
  ordersData: IExchange[]
  spreadData: IExchange[]
  activeChart: 'candle' | 'depth'
}

interface IExchange {
  price: string | number
  size: string | number
}
