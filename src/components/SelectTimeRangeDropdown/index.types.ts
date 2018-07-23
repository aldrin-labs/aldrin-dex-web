export interface IProps {
  style?: object
  period: 'lastWeek' | 'lastDay' | 'lastMonth'
  setPeriodToStore: Function
}
