import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Typography, Divider, Paper } from '@material-ui/core'

import * as actions from '@containers/Portfolio/actions'
import Chart from '@containers/Portfolio/components/GQLChart'
import {
  IProps,
  IState,
} from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances/PortfolioTableBalances.types'
import { customAquaScrollBar } from '@styles/cssUtils'
import { withRouter } from 'react-router'
import Table from '@components/Tables/WithCheckboxesAndSummary'

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

const GridContainer = styled.div`
  align-self: center;

  display: Grid;
  height: 70%;
  grid-template-columns: 1fr;
  width: 100%;
  grid-template-rows: 58% 1% 40%;
  max-width: 100rem;

  @media (min-width: 1400px) {
    height: 100%;
  }
  @media (min-width: 1800px) {
    justify-content: center;

    grid-template-rows: 58% 1% 40%;
  }
  @media (min-width: 3000px) {
    align-items: center;
  }
`

const ChartTitle = styled(Typography)`
  margin-left: 1.2rem;
`

export const PTWrapper = styled(Paper)`
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

const TableWrapper = styled(Paper)`
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
