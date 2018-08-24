export interface IProps {
  quote: string
  data: any[]
  numbersAfterDecimalForPrice: number
  theme: Object
}
export interface ITicker {
  size: number
  price: string
  time: string
  fall: boolean
}
