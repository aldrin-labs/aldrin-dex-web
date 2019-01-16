import React from 'react'
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
  GridContainer,
  ChartContainer,
} from './PortfolioTableBalances.styles'
import Chart from './GQLChart'
import TradeOrderHistoryTable from '@components/TradeOrderHistory/TradeOrderHistoryTable'

import { portfolioMainSteps } from '@utils/joyrideSteps'
import * as actions from '@containers/User/actions'
import PortfolioMainTable from '@components/PortfolioMainTable/PortfolioMainTable'
import { withErrorFallback } from '@storybook/components/hoc/withErrorFallback/withErrorFallback'
import Template from './Template/Template'

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
    const { theme, tab } = this.props
    return (
      <>
        <Joyride
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          steps={portfolioMainSteps}
          run={this.props.toolTip.portfolioMain && tab === 'main'}
          callback={this.handleJoyrideCallback}
          key={this.state.key}
          styles={{
            options: {
              backgroundColor: theme.palette.getContrastText(
                theme.palette.primary.main
              ),
              primaryColor: theme.palette.secondary.main,
              textColor: theme.palette.primary.main,
            },
            tooltip: {
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize,
            },
          }}
        />
        <Template
          PortfolioMainTable={<PortfolioMainTable tab={tab} />}
          PortfolioActions={<TradeOrderHistoryTable />}
          Chart={
            <Chart
              title="Portfolio Value | Coming Soon | In development"
              style={{
                marginLeft: 0,
                minHeight: '10vh',
              }}
              tab={tab}
              marginTopHr="10px"
            />
          }
        />
      </>
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
