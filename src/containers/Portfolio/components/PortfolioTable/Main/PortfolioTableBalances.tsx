import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Typography, Divider, Paper, Card } from '@material-ui/core'

import * as actions from '@containers/Portfolio/actions'
import Chart from '@containers/Portfolio/components/GQLChart'
import {
  IProps,
  IState,
} from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances.types'
import TradeOrderHistoryTable from './TradeOrderHistory/TradeOrderHistoryTable'
import { customAquaScrollBar } from '@styles/cssUtils'
import { withRouter } from 'react-router'
import Table from '@components/Tables/WithCheckboxesAndSummary'

const transformData = (data: any[], red: string, green: string) => {
  const res = data.map((row) => [
    row.exchange,
    { text: row.coin, style: { fontWeight: 700 } },
    row.portfolioPercentage,
    row.price,
    row.quantity,
    row.price * row.quantity,
    { text: row.realizedPL, color: row.realizedPL > 0 ? green : red },
    { text: row.unrealizedPL, color: row.unrealizedPL > 0 ? green : red },
    { text: row.totalPL, color: row.totalPL > 0 ? green : red },
  ])

  return res
}
class PortfolioTableBalances extends React.Component<IProps, IState> {
  render() {
    const {
      isShownChart,
      isUSDCurrently,
      children,
      theme,
      selectedSum,
      currentSort,
      tableData,
      selectedBalances,
      checkedRows,
      onCheckboxClick,
    } = this.props

    const isSelectAll =
      (tableData &&
        selectedBalances &&
        selectedBalances.length === tableData.length) ||
      false

    const tableDataHasData = tableData ? Object.keys(tableData).length : false
    return (
      <PTWrapper tableData={!!tableDataHasData}>
        {children}

        <GridContainer>
          <TableAndHeadingWrapper>
            {Array.isArray(tableData) && (
              <Table
                checkedRows={checkedRows}
                onChange={onCheckboxClick}
                rows={{
                  head: [
                    { text: 'exchange', number: false },
                    { text: 'coin', number: false },
                    { text: 'portfolio%', number: true },
                    { text: 'price', number: true },
                    { text: 'quantity', number: true },
                    { text: 'usd', number: true },
                    { text: 'realized P&L', number: true },
                    { text: 'Unrealized P&L', number: true },
                    { text: 'Total P&L', number: true },
                  ],
                  body: transformData(
                    tableData,
                    theme.palette.red.main,
                    theme.palette.green.main
                  ),
                  footer: [
                    { text: 'Total', number: false },
                    { text: ' ', number: false },
                    { text: '100%', number: true },
                    { text: 'price', number: true },
                    { text: 'quantity', number: true },
                    { text: 'usd', number: true },
                    { text: 'realized P&L', number: true },
                    { text: 'Unrealized P&L', number: true },
                    { text: 'Total P&L', number: true },
                  ],
                }}
              />
            )}
          </TableAndHeadingWrapper>

          <TableAndHeadingWrapper>
            <Typography color="default" variant="headline">
              Trade history
            </Typography>
            <Wrapper>
              <TradeOrderHistoryTable
                theme={theme}
                isUSDCurrently={isUSDCurrently}
              />
            </Wrapper>
          </TableAndHeadingWrapper>

          <StyledDivider light />
          <PTChartContainer>
            <ChartTitle color="default" variant="title">
              Portfolio Value
            </ChartTitle>
            {/* <Chart
              isShownMocks={this.props.isShownMocks}
              setActiveChart={this.props.setActiveChart}
              activeChart={this.props.activeChart}
              style={{
                marginLeft: 0,
                minHeight: '10vh',
              }}
              height="20vh"
              marginTopHr="10px"
              coins={
                selectedBalances && selectedBalances.length > 0
                  ? selectedBalances.map((id, i) => tableData[i])
                  : []
              }
            /> */}
          </PTChartContainer>
        </GridContainer>
      </PTWrapper>
    )
  }
}

const Wrapper = styled(Paper)`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: scroll;

  ${customAquaScrollBar};
`

const GridContainer = styled.div`
  align-self: center;

  display: Grid;
  height: 70%;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 58% 1% 40%;

  @media (min-width: 1400px) {
    height: 100%;
  }
  @media (min-width: 1800px) {
    justify-content: center;

    grid-template-columns: 60% 40%;
    grid-template-rows: 58% 1% 40%;
  }
  @media (min-width: 3000px) {
    align-items: center;
  }
`

const ChartTitle = styled(Typography)`
  margin-left: 1.2rem;
`

export const PTWrapper = styled(Card)`
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
  overflow-y: auto;
  @media (max-width: 840px) {
    margin: 1.5rem auto;
  }

  @media (max-width: 550px) {
    width: calc(100% - 90px);
    margin: 0.625rem auto;
  }

  @media (max-width: 425px) {
    width: calc(100% - 20px);
  }

  ${customAquaScrollBar};
`

const StyledDivider = styled(Divider)`
  margin-bottom: 1rem;
  grid-column: 1 / span 2;
`

const TableAndHeadingWrapper = styled.div`
  display: flex;
  margin: 0 20px 5px;
  flex-direction: column;
  overflow-x: scroll;

  ${customAquaScrollBar};
`

const PTChartContainer = styled.div`
  position: relative;
  grid-column: 1 / span 2;
  height: 100%;
  @media (max-width: 500px) {
    display: none;
  }

  @media (max-height: 650px) {
    display: none;
  }
`

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
