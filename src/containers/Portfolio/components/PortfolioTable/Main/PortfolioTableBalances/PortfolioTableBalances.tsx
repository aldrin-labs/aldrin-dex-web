import * as React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router'

import Chart from '@components/GQLChart'
import {
  IProps,
  IState,
} from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances/PortfolioTableBalances.types'
import { Table } from '@storybook-components'
import {
  TableWrapper,
  ChartWrapper,
  GridContainer,
  TableContainer,
  ChartContainer,
} from './PortfolioTableBalances.styles'
import EmptyTablePlaceholder from '@components/EmptyTablePlaceholder'
import TradeOrderHistoryTable from '@components/TradeOrderHistory/TradeOrderHistoryTable'
import CardHeader from '@components/CardHeader'
import { find } from 'lodash-es'
import { withErrorFallback } from '@hoc/'

class PortfolioTableBalances extends React.Component<IProps, IState> {
  render() {
    const {
      putDataInTable,
      tableData,
      checkedRows,
      onCheckboxClick,
      onSelectAllClick,
    } = this.props

    const { body, head, footer } = putDataInTable()

    const coins =
      checkedRows && checkedRows.length > 0
        ? checkedRows.map((id: number) =>
            find(tableData, (row) => row.id === id)
          )
        : []

    const tableDataHasData = tableData ? Object.keys(tableData).length : false
    return (
      <EmptyTablePlaceholder isEmpty={!tableDataHasData}>
        <GridContainer container={true} spacing={16}>
          <TableContainer item={true} xs={12} md={8}>
            <TableWrapper>
              {Array.isArray(tableData) && (
                <Table
                  title="Portfolio"
                  checkedRows={checkedRows}
                  withCheckboxes={true}
                  onChange={onCheckboxClick}
                  onSelectAllClick={onSelectAllClick}
                  data={{ body, footer }}
                  columnNames={head}
                />
              )}
            </TableWrapper>
          </TableContainer>
          <TableContainer item={true} xs={12} md={4}>
            <TableWrapper>
              <TradeOrderHistoryTable />
            </TableWrapper>
          </TableContainer>

          <ChartContainer item={true} xs={12} md={12}>
            <ChartWrapper>
              <CardHeader
                style={{ position: 'absolute' }}
                title={'Portfolio Value'}
              />
              <Chart
                isShownMocks={this.props.isShownMocks}
                style={{
                  marginLeft: 0,
                  minHeight: '10vh',
                }}
                height="20vh"
                marginTopHr="10px"
                coins={coins}
              />
            </ChartWrapper>
          </ChartContainer>
        </GridContainer>
      </EmptyTablePlaceholder>
    )
  }
}

const mapStateToProps = (store) => ({
  isShownMocks: store.user.isShownMocks,
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

export default compose(
  withRouter,
  connect(mapStateToProps),
  withErrorFallback
)(PortfolioTableBalances)
