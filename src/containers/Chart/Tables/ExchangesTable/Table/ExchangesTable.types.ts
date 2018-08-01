export interface IExchange {
  name: string
  symbol: string
}

export interface IProps {
  onButtonClick: Function
  changeExchange: Function
  activeExchange: { index: number; exchange: IExchange }
  exchanges: IExchange[]
  theme: any
}
