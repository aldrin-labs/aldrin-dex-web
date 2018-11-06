import * as React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router'
import Joyride from 'react-joyride'

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
import { portfolioMainSteps } from '@utils/joyrideSteps'
import * as actions from '@containers/User/actions'

class PortfolioTableBalances extends React.Component<IProps, IState> {
  state = {
    run: true,
    key: 0,
  }

  handleJoyrideCallback = (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      this.props.hideToolTip('Main')
    }
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const {
      putDataInTable,
      tableData,
      checkedRows,
      onCheckboxClick,
      onSelectAllClick,
      theme,
    } = this.props

    const { body, head, footer } = putDataInTable()
    console.log(theme.palette.background.paper)
    console.log('theme.palette.background.paper')

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
          <Joyride
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            steps={portfolioMainSteps}
            run={this.props.toolTip.portfolioMain}
            callback={this.handleJoyrideCallback}
            key={this.state.key}
            styles={{
              options: {
                backgroundColor: theme.palette.background.paper,
                primaryColor: theme.palette.primary.main,
                textColor: theme.palette.getContrastText(
                  theme.palette.background.paper
                ),
              },
              tooltip: {
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.fontSize,
              },
            }}
          />
          <TableContainer item={true} xs={12} md={8}>
            <TableWrapper className="PortfolioMainTable">
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
            <TableWrapper className="PortfolioTradeOrderHistoryTable">
              <TradeOrderHistoryTable />
            </TableWrapper>
          </TableContainer>

          <ChartContainer item={true} xs={12} md={12}>
            <ChartWrapper className="PortfolioValueChart">
              <CardHeader
                style={{ position: 'absolute' }}
                title={'Portfolio Value | Cooming Soon | In development'}
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

const mapDispatchToProps = (dispatch: any) => ({
  hideToolTip: (tab: string) => dispatch(actions.hideToolTip(tab)),
})

const mapStateToProps = (store) => ({
  isShownMocks: store.user.isShownMocks,
  toolTip: store.user.toolTip,
})

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withErrorFallback
)(PortfolioTableBalances)
