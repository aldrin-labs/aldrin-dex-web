export interface IData {
  coin: string
  percentage: number | string
}

export interface IState {
  activePercentageButton: number
  risk: string[]
  optimizedData: IData[]
  rawDataBeforeOptimization: IData[]
  expectedReturn: string
  activeButton: number
  percentages: number[]
}

export interface IProps {
  storeData: IData[]
  isShownMocks: boolean
  updateData: Function
}
