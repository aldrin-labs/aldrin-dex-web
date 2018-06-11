export interface IData {
  coin: string
  percentage: number | string
}

export interface IState {
  activePercentageButton: number
  risk: string[]
  data: IData[]
  optimizedData: IData[]
  expectedReturn: string
  activeButton: number
  percentages: number[]
}

export interface IProps {
  data: IData[]
  isShownMocks: boolean
  updateData: Function
}
