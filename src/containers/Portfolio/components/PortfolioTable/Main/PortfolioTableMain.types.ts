import { IRowT } from '@containers/Portfolio/components/PortfolioTable/types'

export interface IProps {
  tableData: IRowT[] | null
  selectedBalances: number[] | null
  onSelectBalance: Function
  isUSDCurrently: boolean
}
