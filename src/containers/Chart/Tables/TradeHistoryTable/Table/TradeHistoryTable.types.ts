import { Theme } from '@material-ui/core'

export interface IProps {
  quote: string
  data: any[]
  numbersAfterDecimalForPrice: number
  theme: Theme
}
export interface ITicker {
  size: number
  price: string
  time: string
  fall: boolean
}
