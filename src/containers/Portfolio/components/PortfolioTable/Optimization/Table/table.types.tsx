export interface IData {
  coin: string
  percentage: number | string
}

export interface IProps {
  withInput: boolean
  onClickDeleteIcon?: Function
  onClickDeleteAllIcon?: Function
  onPlusClick?: Function
  data: IData[]
}
export interface IState {
  name: string
  value: string | null
}
