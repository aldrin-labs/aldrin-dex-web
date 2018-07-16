export interface IProps {
  isShownMocks: boolean
  data?: object
  updateData: Function
  expectedReturn: string
  optimizePortfolio: Function
  handleChange: Function
}

export interface IData {
  coin: string
  percentage: number | string
}
