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
      <Wrapper>
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
          {selectedSum.currency && (
            <PortfolioTableSum selectedSum={selectedSum} />
          )}
        </PTable>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div``

const PTable = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
`
