export interface IProps {
  onButtonClick: Function
  changeExchange: Function
  activeExchange: number
  exchanges: { name: string; symbol: string }[]
  theme: any
}
