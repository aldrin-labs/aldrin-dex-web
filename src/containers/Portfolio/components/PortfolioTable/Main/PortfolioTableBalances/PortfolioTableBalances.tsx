import * as React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router'

import * as actions from '@containers/Portfolio/actions'
import Chart from '@containers/Portfolio/components/GQLChart'
import {
  IProps,
  IState,
} from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances/PortfolioTableBalances.types'
import Table from '@components/Tables/WithCheckboxesAndSummary'
import {
  TableWrapper,
  PTWrapper,
  GridContainer,
  PTChartContainer,
  StyledDivider,
  ChartTitle,
} from './PortfolioTableBalances.styles'
import TradeOrderHistoryTable from '@components/TradeOrderHistory/TradeOrderHistoryTable'
class PortfolioTableBalances extends React.Component<IProps, IState> {
  render() {
    const {
      children,
      putDataInTable,
      tableData,
      checkedRows,
      onCheckboxClick,
      onSelectAllClick,
    } = this.props

    const coins =
      checkedRows && checkedRows.length > 0
        ? checkedRows.map((id: number) => tableData[id])
        : []

    const tableDataHasData = tableData ? Object.keys(tableData).length : false
    return (
      <PTWrapper elevation={1} tableData={!!tableDataHasData}>
        {children}

        <GridContainer>
          <TableWrapper elevation={8}>
            <TableWrapper style={{ width: '60%' }} elevation={8}>
              {Array.isArray(tableData) && (
                <Table
                  title="Portfolio"
                  checkedRows={checkedRows}
                  withCheckboxes={true}
                  onChange={onCheckboxClick}
                  onSelectAllClick={onSelectAllClick}
                  rows={putDataInTable()}
                />
              )}
            </TableWrapper>
            <TableWrapper style={{ width: '40%' }} elevation={8}>
              <TradeOrderHistoryTable />
            </TableWrapper>
          </TableWrapper>

          <StyledDivider light={true} />
          <PTChartContainer>
            <ChartTitle color="default" variant="title">
              Portfolio Value
            </ChartTitle>

            <Chart
              isShownMocks={this.props.isShownMocks}
              setActiveChart={this.props.setActiveChart}
              activeChart={this.props.activeChart}
              style={{
                marginLeft: 0,
                minHeight: '10vh',
              }}
              height="20vh"
              marginTopHr="10px"
              coins={coins}
            />
          </PTChartContainer>
        </GridContainer>
      </PTWrapper>
    )
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  setActiveChart: (ex: any) => dispatch(actions.setActiveChart(ex)),
})

const mapStateToProps = (store) => ({
  isShownMocks: store.user.isShownMocks,
  activeChart: store.portfolio.activeChart,
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PortfolioTableBalances)
