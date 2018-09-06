export interface IProps {
  children: object
  toggleFullscreen: Function
  isFullscreenEnabled: boolean
  data: object
  portfolio: object
  setCorrelationPeriodToStore: Function
  period: string
  filterValueSmallerThenPercentage: number
}
