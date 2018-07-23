export interface IData {
  coin: string
  percentage: number | string
}

export interface IState {
  loading: boolean
  risk: number[]
  returns: number[]
  optimizedData: IData[]
  rawDataBeforeOptimization: IData[]
  expectedReturn: string
  activeButton: number
  percentages: number[]
  rawOptimizedData: object[]
}

export interface IProps {
  storeData: IData[]
  endDate: number
  startDate: number
  isShownMocks: boolean
  updateData: Function
  setPeriod: Function
  optimizationPeriod: string
}
