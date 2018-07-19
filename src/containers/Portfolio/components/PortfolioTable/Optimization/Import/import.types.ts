export interface IProps {
  isShownMocks: boolean
  startDate: number
  endDate: number
  data?: object
  storeData: IData[]
  updateData: Function
  transformData: Function
  expectedReturn: string
  optimizePortfolio: Function
  handleChange: Function
}

export interface IData {
  coin: string
  percentage: number | string
}
