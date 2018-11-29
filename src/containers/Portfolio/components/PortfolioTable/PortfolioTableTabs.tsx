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
import { Typography, Fade } from '@material-ui/core'

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
    const switchUSDBTC = tab === 'main'
    const background = type === 'dark' ? primary.light : primary[100]

    return (
      <Container background={background} elevation={0}>
        <BarTab
          thisTab="main"
          thisTabName="Main"
          curentTab={tab}
          onClick={() => this.onChangeTab('main')}
          mainColor={main}
        >
          <Main />
        </BarTab>
        <BarTab
          thisTab="industry"
          thisTabName="Industry"
          curentTab={tab}
          onClick={() => this.onChangeTab('industry')}
          mainColor={main}
        >
          <Industry />
        </BarTab>
        <BarTab
          thisTab="rebalance"
          thisTabName="Rebalance"
          curentTab={tab}
          onClick={() => this.onChangeTab('rebalance')}
          mainColor={main}
        >
          <Rebalance />
        </BarTab>
        <BarTab
          thisTab="correlation"
          thisTabName="Correlation"
          curentTab={tab}
          onClick={() => this.onChangeTab('correlation')}
          mainColor={main}
        >
          <Correlation />
        </BarTab>
        <BarTab
          thisTab="optimization"
          thisTabName="Optimization"
          curentTab={tab}
          onClick={() => this.onChangeTab('optimization')}
          mainColor={main}
        >
          <Optimization />
        </BarTab>
        <DividerWithMargin />
        <BarContainer
          onClick={() => {
            toggleWallets()
          }}
        >
          <Tab color="primary">
            <Settings className="settingsIcon" />
          </Tab>
          <Typography align="center" variant="caption" color="textSecondary">
            Accounts
          </Typography>
        </BarContainer>
        <DividerWithMargin />
        <Fade in={switchUSDBTC} mountOnEnter unmountOnExit>
          <>
            <BarContainer onClick={this.onToggleUSDBTC}>
              <Button color="default" className="SwitchButton">
                {' '}
                {isUSDCurrently ? 'BTC' : 'USD'}
              </Button>
              <Typography
                align="center"
                variant="caption"
                color="textSecondary"
              >
                Switch currency
              </Typography>
            </BarContainer>
            <DividerWithMargin />
          </>
        </Fade>
      </Container>
    )
  }
}

const renderMarker = (color: string) => (
  <React.Fragment key={1}>
    <Marker color={color} />
    <BlurForMarker color={color} />
  </React.Fragment>
)

const BarTab = (props: {
  children?: any
  thisTab: string
  thisTabName: string
  curentTab: string
  onClick: () => void
  mainColor: string
}) => (
  <BarContainer onClick={props.onClick}>
    <Tab color={props.curentTab === props.thisTab ? 'secondary' : 'primary'}>
      {props.curentTab === props.thisTab && renderMarker(props.mainColor)}
      {props.children}
    </Tab>
    <Typography
      variant="caption"
      color={props.curentTab === props.thisTab ? 'secondary' : 'default'}
    >
      {' '}
      {props.thisTabName}{' '}
    </Typography>
  </BarContainer>
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
