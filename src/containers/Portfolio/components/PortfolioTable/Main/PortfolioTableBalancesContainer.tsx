import React, { Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router'
import { Grid } from '@material-ui/core'
import Joyride from 'react-joyride'

import {
  IProps,
  IState,
} from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances.types'
import {
  TableWrapper,
  ChartWrapper,
  GridContainer,
  ChartContainer,
} from './PortfolioTableBalances.styles'
import EmptyTablePlaceholder from '@components/EmptyTablePlaceholder'
const Chart = lazy(() => import('@components/GQLChart'))
const TradeOrderHistoryTable = lazy(() =>
  import('@components/TradeOrderHistory/TradeOrderHistoryTable')
)
import CardHeader from '@components/CardHeader'
import { withErrorFallback } from '@hoc/'
import { portfolioMainSteps } from '@utils/joyrideSteps'
import * as actions from '@containers/User/actions'
import { Loading } from '@components/index'
import PortfolioMainTable from '@components/PortfolioMainTable/PortfolioMainTable'

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

    const tableDataHasData = tableData ? Object.keys(tableData).length : false
    return (
      <EmptyTablePlaceholder isEmpty={false}>
        <GridContainer
          style={{ flexWrap: 'nowrap', flexDirection: 'column' }}
          container={true}
          spacing={16}
        >
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
          <Grid
            spacing={8}
            style={{ maxHeight: '50%', flexBasis: 'inherit' }}
            container={true}
            item={true}
            xs={12}
          >
            <Grid item={true} xs={12} md={8}>
              <TableWrapper className="PortfolioMainTable">
                {<PortfolioMainTable />}
              </TableWrapper>
            </Grid>
            <Grid item={true} xs={12} md={4}>
              <TableWrapper className="PortfolioTradeOrderHistoryTable">
                <Suspense fallback={<Loading centerAligned />}>
                  <TradeOrderHistoryTable />
                </Suspense>
              </TableWrapper>
            </Grid>
          </Grid>

          <ChartContainer
            style={{ flexBasis: '51%', padding: '0 8px' }}
            item={true}
            xs={12}
            md={12}
          >
            <ChartWrapper className="PortfolioValueChart">
              <CardHeader
                title={'Portfolio Value | Coming Soon | In development'}
              />
              <Suspense fallback={<Loading centerAligned />}>
                <Chart
                  style={{
                    marginLeft: 0,
                    minHeight: '10vh',
                  }}
                  height="calc(100% - 2rem)"
                  marginTopHr="10px"
                />
              </Suspense>
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
