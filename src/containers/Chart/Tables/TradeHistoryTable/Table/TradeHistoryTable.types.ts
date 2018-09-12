export interface IState {
  tableExpanded: boolean
}

export interface ITicker {
  size: number
  price: string
  time: string
  fall: boolean
}

export interface IProps {
  quote: string
  data: ITicker[]
  numbersAfterDecimalForPrice: number
  theme: { pallet: any }
}
