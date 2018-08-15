export interface IProps {
  activeExchange: { exchange: { name: string; symbol: string }; index: number }
  animated: boolean
  base: string
  quote: string
  theme: any
}
