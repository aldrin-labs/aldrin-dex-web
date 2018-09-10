import { IRowT } from '@containers/Portfolio/components/PortfolioTable/types'
import { Theme } from '@material-ui/core'

export interface IProps {
  tableData: IRowT[] | null
  selectedBalances: number[] | null
  onSelectBalance: Function
  isUSDCurrently: boolean
  theme: Theme
}
