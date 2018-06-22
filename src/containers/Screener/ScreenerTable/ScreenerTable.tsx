import * as React from 'react'
import styled, { css } from 'styled-components'
import { IProps, IState } from './ScreenerTable.types'
// import sortIcon from '@icons/arrow.svg'
// import SvgIcon from '../../../components/SvgIcon/SvgIcon'
// import { tableData } from './MarketSummaryTable/mocks'
import {
  onSortTableFull
} from '../../../utils/PortfolioTableUtils'
import MarketSummaryTable from './MarketSummaryTable/MarketSummaryTable'

export default class ScreenerTable extends React.Component<IProps, IState> {

  render() {
    const {searchText, tab} = this.props

    if (tab === 'marketSummary') {
      return <MarketSummaryTable searchText={searchText} />
    }
    else
      return null

  }
}
