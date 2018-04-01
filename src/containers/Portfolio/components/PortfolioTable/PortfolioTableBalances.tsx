import * as React from 'react'
import styled from 'styled-components'
import PortfolioTableMain from './PortfolioTableMain'
import PortfolioTableSum from './PortfolioTableSum'
import PortfolioTableHead from './PortfolioTableHead'

export default class PortfolioTableBalances extends React.Component {
  render() {
    const {
      isUSDCurrently,
      isSelectAll,
      selectedSum,
      onSelectAll,
      onSortTable,
      tableData,
      selectedBalances,
      onSelectBalance,
    } = this.props

    return (
      <PTable>
        <PortfolioTableHead
          isUSDCurrently={isUSDCurrently}
          isSelectAll={isSelectAll}
          onSelectAll={onSelectAll}
          onSortTable={onSortTable}
        />

        <PortfolioTableMain
          tableData={tableData}
          selectedBalances={selectedBalances}
          isUSDCurrently={isUSDCurrently}
          onSelectBalance={onSelectBalance}
        />
        <PortfolioTableSum selectedSum={selectedSum} />
      </PTable>
    )
  }
}

const PTable = styled.table`
  width: 95%;
  border-collapse: collapse;
`
