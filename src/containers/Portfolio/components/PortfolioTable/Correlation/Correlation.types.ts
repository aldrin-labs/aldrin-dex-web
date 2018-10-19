export interface IProps {
  children: object
  toggleFullscreen: Function
  isFullscreenEnabled: boolean
  data: object
  portfolio: object
  setCorrelationPeriodToStore: Function
  period: string
  startDate: number
  endDate: number
  filterValueSmallerThenPercentage: number
}
