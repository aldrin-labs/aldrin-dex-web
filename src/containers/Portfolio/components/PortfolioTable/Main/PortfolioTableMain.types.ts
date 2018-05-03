import { RowT } from '../types'

export interface IProps {
  tableData: RowT[] | null
  selectedBalances: number[] | null
  onSelectBalance: Function
  isUSDCurrently: boolean
}
