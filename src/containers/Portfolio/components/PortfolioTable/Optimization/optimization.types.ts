export interface IData {
  coin: string
  percentage: number | string
}

export interface IState {
  loading: boolean
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
