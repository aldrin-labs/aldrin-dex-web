export interface IProps {
  optimizationPeriod: string
  isShownMocks: boolean
  startDate: number
  endDate: number
  data?: { getProfile: object }
  optimizedData: IData[]
  storeData: IData[]
  updateData: Function
  setPeriod: Function
  optimizedToState: Function
  transformData: Function
  expectedReturn: string
  optimizePortfolio: Function
  handleChange: Function
  onBtnClick: Function
  percentages: number[]
  activeButton: number
  showSwitchButtons: boolean
}

export interface IData {
  coin: string
  percentage: number | string
}
