import { IRowT } from '../types'

export interface IProps {
  tableData: IRowT[] | null
  selectedBalances: number[] | null
  onSelectBalance: Function
  isUSDCurrently: boolean
}
