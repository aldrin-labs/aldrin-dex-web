import { IData } from './optimizationTypes'
export interface IProps {
  withInput: boolean
  onClickDeleteIcon?: Function
  onPlusClick?: Function
  data: IData[]
}
export interface IState {
  name: string
  value: string | null
}
