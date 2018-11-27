import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Settings from '@material-ui/icons/Settings'
import Main from '@material-ui/icons/LineStyle'
import Industry from '@material-ui/icons/DonutLarge'
import Rebalance from '@material-ui/icons/SwapHoriz'
import Correlation from '@material-ui/icons/ViewModule'
import Optimization from '@material-ui/icons/Assessment'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { Tooltip, Typography, Fade } from '@material-ui/core'

import { IProps } from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs.types'

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
        palette: {
          primary,
          type,
          secondary: { main },
        },
      },
    } = this.props
    const switchUSDBTC =
      tab === 'main' || tab === 'industry' || tab === 'optimization'
    const background = type === 'dark' ? primary.light : primary[100]

    return (
      <Container background={background} elevation={0}>
        <BarContainer onClick={() => this.onChangeTab('main')}>
          <Tab
            color={tab === 'main' ? 'secondary' : 'primary'}
          >
            {tab === 'main' && renderMarker(main)}
            <Main />
          </Tab>
          <Typography variant="caption"> Main </Typography>
        </BarContainer>
        <BarContainer onClick={() => this.onChangeTab('industry')}>
          <Tab
            color={tab === 'industry' ? 'secondary' : 'primary'}
          >
            {tab === 'industry' && renderMarker(main)}
            <Industry />
          </Tab>
          <Typography variant="caption"> Industry </Typography>
        </BarContainer>
        <BarContainer onClick={() => this.onChangeTab('rebalance')}>
          <Tab
            color={tab === 'rebalance' ? 'secondary' : 'primary'}
          >
            {tab === 'rebalance' && renderMarker(main)}

            <Rebalance />
          </Tab>
          <Typography variant="caption"> Rebalance </Typography>
        </BarContainer>
        <BarContainer onClick={() => this.onChangeTab('correlation')}>
          <Tab
            color={tab === 'correlation' ? 'secondary' : 'primary'}
          >
            {tab === 'correlation' && renderMarker(main)}

            <Correlation />
          </Tab>
          <Typography variant="caption"> Correlation </Typography>
        </BarContainer>
        <BarContainer onClick={() => this.onChangeTab('optimization')}>
          <Tab
            color={tab === 'optimization' ? 'secondary' : 'primary'}
          >
            {tab === 'optimization' && renderMarker(main)}

            <Optimization />
          </Tab>
          <Typography variant="caption"> Optimization </Typography>
        </BarContainer>
        <DividerWithMargin />
        <SettingsTab
          color="primary"
          onClick={() => {
            toggleWallets()
          }}
        >
          <Settings className="settingsIcon" />
        </SettingsTab>
        <Fade in={switchUSDBTC} mountOnEnter unmountOnExit>
          <BarContainer >
            <Typography align="center" variant="caption" color="textSecondary">
              Switch to
            </Typography>
            <Button
              color="default"
              onClick={this.onToggleUSDBTC}
              className="SwitchButton"
            >
              {' '}
              {isUSDCurrently ? 'BTC' : 'USD'}
            </Button>
          </BarContainer>
        </Fade>
        <DividerWithMargin />
      </Container>
    )
  }
}

const renderMarker = (color: string) => (
  <>
    <Marker color={color} />
    <BlurForMarker color={color} />
  </>
)


const DividerWithMargin = styled(Divider)`
  margin: 0.5rem auto;
  margin-bottom: 0px;
  width: 70%;
`

const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  width: 86px;
  height: 100%;
  min-height: 100vh;
  z-index: 0;
  && {
    background: ${(props: { background: string }) => props.background};
    border-radius: 0;
  }
`

const Marker = styled.span`
  left: -30px;
  border-radius: 23px;
  height: 40px;
  width: 1rem;
  background: ${(props: { color: string }) => props.color};
  position: absolute;
`
const BlurForMarker = styled.span`
  left: -30px;
  border-radius: 23px;
  height: 40px;
  width: 1rem;
  filter: blur(1rem);
  background: ${(props: { color: string }) => props.color};
  position: absolute;
`

const Tab = styled(IconButton)`
  margin: 0.6rem auto;
  margin-bottom: 0px;
`

const SettingsTab = styled(IconButton)`
margin: 0.6rem auto;
`

const BarContainer = styled.div`
  text-align: center;
  cursor: pointer;
`

const mapStateToProps = (store) => ({
  isShownMock: store.portfolio.isShownMock,
})

const storeComponent = connect(mapStateToProps)(PortfolioTableTabs)

export default compose()(storeComponent)
