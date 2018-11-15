import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Settings from '@material-ui/icons/Settings'
import Main from '@material-ui/icons/LineStyle'
import Industry from '@material-ui/icons/PieChart'
import Rebalance from '@material-ui/icons/SwapHoriz'
import Correlation from '@material-ui/icons/ViewModule'
import Optimization from '@material-ui/icons/InsertChartOutlined'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { Tooltip, Typography, Fade } from '@material-ui/core'

import { IProps } from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs.types'
import { navBarHeight } from '@components/NavBar/NavBar.styles'

class PortfolioTableTabs extends React.Component<IProps> {
  onChangeTab = (tab: string) => {
    const { onChangeTab } = this.props
    if (onChangeTab) {
      onChangeTab(tab)
    }
  }

  onToggleChart = () => {
    const { onToggleChart } = this.props
    if (onToggleChart) {
      onToggleChart()
    }
  }

  onToggleUSDBTC = () => {
    const { onToggleUSDBTC } = this.props
    if (onToggleUSDBTC) {
      onToggleUSDBTC()
    }
  }

  render() {
    const {
      tab,
      toggleWallets,
      isUSDCurrently,
      theme: {
        palette: { primary, type },
      },
    } = this.props
    const switchUSDBTC =
      tab === 'main' || tab === 'industry' || tab === 'optimization'
    const background = type === 'dark' ? primary.light : primary[100]

    return (
      <Container background={background} elevation={0}>
        <Tooltip title="Main" enterDelay={0} placement="right">
          <Tab
            color={tab === 'main' ? 'secondary' : 'default'}
            onClick={() => this.onChangeTab('main')}
          >
            <Main />
          </Tab>
        </Tooltip>

        <Tooltip title="Industry" enterDelay={0} placement="right">
          <Tab
            color={tab === 'industry' ? 'secondary' : 'default'}
            onClick={() => this.onChangeTab('industry')}
          >
            <Industry />
          </Tab>
        </Tooltip>

        <Tooltip title="Rebalance" enterDelay={0} placement="right">
          <Tab
            color={tab === 'rebalance' ? 'secondary' : 'default'}
            onClick={() => this.onChangeTab('rebalance')}
          >
            <Rebalance />
          </Tab>
        </Tooltip>

        <Tooltip title="Correlation" enterDelay={0} placement="right">
          <Tab
            color={tab === 'correlation' ? 'secondary' : 'default'}
            onClick={() => this.onChangeTab('correlation')}
          >
            <Correlation />
          </Tab>
        </Tooltip>

        <Tooltip title="Optimization" enterDelay={0} placement="right">
          <Tab
            color={tab === 'optimization' ? 'secondary' : 'default'}
            onClick={() => this.onChangeTab('optimization')}
          >
            <Optimization />
          </Tab>
        </Tooltip>

        <DividerWithMargin />

        <Tab
          color="default"
          onClick={() => {
            toggleWallets()
          }}
        >
          <Settings className="settingsIcon" />
        </Tab>
        <Fade in={switchUSDBTC}>
          <div>
            <DividerWithMargin />
            <Typography align="center" variant="caption" color="textSecondary">
              Switch to
            </Typography>
            <Button
              color="secondary"
              onClick={this.onToggleUSDBTC}
              className="SwitchButton"
            >
              {' '}
              {isUSDCurrently ? 'BTC' : 'USD'}
            </Button>
          </div>
        </Fade>
      </Container>
    )
  }
}

const DividerWithMargin = styled(Divider)`
  margin: 0.5rem 0;
`

const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  width: 64px;
  /* - navbarHeight */
  height: calc(100vh - ${navBarHeight}px);
  z-index: 0;
  && {
    background: ${(props: { background: string }) => props.background};
    border-radius: 0;
  }
`

const Tab = styled(IconButton)`
  margin: 0.5rem auto;
`

const mapStateToProps = (store) => ({
  isShownMock: store.portfolio.isShownMock,
})

const storeComponent = connect(mapStateToProps)(PortfolioTableTabs)

export default compose()(storeComponent)
