import React, { Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Grid } from '@material-ui/core'
import Joyride from 'react-joyride'

import {
  IProps,
  IState,
} from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances.types'
import {
  TableWrapper,
  TablesWrapper,
  ChartWrapper,
  GridContainer,
  ChartContainer,
} from './PortfolioTableBalances.styles'
import Chart from '@components/GQLChart'
import TradeOrderHistoryTable from '@components/TradeOrderHistory/TradeOrderHistoryTable'
import CardHeader from '@components/CardHeader'
import { portfolioMainSteps } from '@utils/joyrideSteps'
import * as actions from '@containers/User/actions'
import PortfolioMainTable from '@components/PortfolioMainTable/PortfolioMainTable'
import { withErrorFallback } from '@storybook-components/hoc/withErrorFallback/withErrorFallback'

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
    const { theme } = this.props
    return (
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
        <TablesWrapper spacing={8} container={true} item={true} xs={12}>
          <Grid item={true} xs={12} md={8}>
            <TableWrapper className="PortfolioMainTable">
              <PortfolioMainTable />
            </TableWrapper>
          </Grid>
          <Grid item={true} xs={12} md={4}>
            <TableWrapper className="PortfolioTradeOrderHistoryTable">
              <TradeOrderHistoryTable />
            </TableWrapper>
          </Grid>
        </TablesWrapper>

        <ChartContainer item={true} xs={12} md={12}>
          <ChartWrapper className="PortfolioValueChart">
            <CardHeader
              title={'Portfolio Value | Coming Soon | In development'}
            />
            <Chart
              style={{
                marginLeft: 0,
                minHeight: '10vh',
              }}
              height="calc(100% - 2rem)"
              marginTopHr="10px"
            />
          </ChartWrapper>
        </ChartContainer>
      </GridContainer>
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
  withErrorFallback,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PortfolioTableBalances)
