export interface IProps {
  withInput: boolean
  onClickDeleteIcon: Function
  onPlusClick: Function
  data: { coin: string; percentage: number }[]
}
export interface IState {
  name: string
  value: string | null
}
