import * as React from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import AccountIcon from '@material-ui/icons/Settings'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import SvgIcon from '@components/SvgIcon/SvgIcon'
import gridLoader from '@icons/grid.svg'
import { IProps } from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs.types'
import Menu from '@containers/Portfolio/components/PortfolioTable/ThreeDotsMenu'
import { UPDATE_PORTFOLIO } from '@containers/Portfolio/api'

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
    const { tab, portfolio, toggleWallets, isUSDCurrently, theme } = this.props

    return (
      <React.Fragment>
        <PTHeadingBlock>
          <TabContainer>
            <Menu onMenuItemClick={this.onChangeTab} />
            <ToggleAccountsBtn
              onClick={() => {
                toggleWallets()
              }}
            >
              <AccountIcon />
            </ToggleAccountsBtn>

            <Tab
              color="primary"
              onClick={() => this.onChangeTab('main')}
              variant="contained"
              disabled={tab === 'main'}
            >
              Main
            </Tab>

            <Tab
              color="primary"
              onClick={() => this.onChangeTab('industry')}
              variant="contained"
              disabled={tab === 'industry'}
            >
              Industry
            </Tab>

            <Tab
              color="primary"
              onClick={() => this.onChangeTab('rebalance')}
              variant="contained"
              disabled={tab === 'rebalance'}
            >
              Rebalance
            </Tab>

            <Tab
              color="primary"
              onClick={() => this.onChangeTab('correlation')}
              variant="contained"
              disabled={tab === 'correlation'}
            >
              Correlation
            </Tab>

            <Tab
              color="primary"
              onClick={() => this.onChangeTab('optimization')}
              variant="contained"
              disabled={tab === 'optimization'}
            >
              Optimization
            </Tab>
          </TabContainer>

          <ButtonContainer>
            {/*<ToggleBtn onClick={this.onToggleChart}>*/}
            {/*<SvgIcon src={filterListIcon} width={24} height={24} />*/}
            {/*</ToggleBtn>*/}

            {tab !== 'correlation' &&
              tab !== 'optimization' &&
              tab !== 'rebalance' && (
                <SwitchRefreshContainer>
                  <MoveRightFix fix={tab === 'main'}>
                    <FlexWrapper>
                      <Typography variant="caption">BTC</Typography>
                      <Switch
                        onChange={this.onToggleUSDBTC}
                        checked={isUSDCurrently}
                      />
                      <Typography variant="caption">USD</Typography>
                    </FlexWrapper>
                  </MoveRightFix>

                  {tab === 'main' && (
                    <Mutation mutation={UPDATE_PORTFOLIO}>
                      {(updatePortfolio, { data, loading }) => {
                        const isLoading =
                          loading || (portfolio && portfolio.processing)

                        return (
                          <RefreshButton size="small" onClick={updatePortfolio}>
                            {isLoading ? (
                              <SvgIcon
                                src={gridLoader}
                                width={24}
                                height={24}
                              />
                            ) : (
                              'Refresh'
                            )}
                          </RefreshButton>
                        )
                      }}
                    </Mutation>
                  )}
                </SwitchRefreshContainer>
              )}
          </ButtonContainer>
        </PTHeadingBlock>
      </React.Fragment>
    )
  }
}

const RefreshButton = styled(Button)`
  height: 1rem;
  margin-right: 0.25rem;
`

const MoveRightFix = styled.div`
  position: relative;
  left: ${(props: { fix: boolean }) => (props.fix ? '6px' : 0)};
`
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
`

const PTHeadingBlock = styled.div`
  display: flex;

  position: sticky;
  top: 0;
  z-index: 99;

  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 17px;
  min-height: 100px;

  @media (max-width: 1290px) {
    justify-content: flex-start;
  }
  @media (max-width: 700px) {
    &:first-child {
      align-items: flex-start;
      padding: 20px 10px 10px;
    }
    &:not(:first-child) {
      padding-top: 30px;
      padding-bottom: 10px;
    }
  }

  @media (max-height: 700px) {
    min-height: 60px;
  }

  @media (max-width: 425px) {
    min-height: 60px;
    align-items: flex-start;
    padding: 10px;

    &:not(:first-child) {
      margin-bottom: 15px;
    }
  }
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: 100%;
  position: absolute;
  right: 0;

  @media (max-width: 1080px) {
    right: 1rem;
    left: inherit;
  }
  @media (max-width: 840px) {
    margin-right: 1rem;
  }

  @media (max-width: 710px) {
    padding-top: 10px;
    margin-right: 0;
    flex-flow: wrap;
  }
`

const ToggleAccountsBtn = styled(IconButton)`
  display: block;
  padding: 0.75rem;
  margin-top: 15%;

  @media (min-width: 1290px) {
    display: none;
  }
`

const Tab = styled(Button)`
  @media (max-width: 1290px) {
    display: none;
    width: 8rem;
    padding: 0.5rem;
  }
`

const TabContainer = styled.div`
  width: 70%;
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  align-items: center;

  @media (max-width: 1290px) {
    grid-template-columns: repeat(2, 4rem);
  }
`

const SwitchRefreshContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 1080px) {
    padding-top: 20px;
  }
  @media (max-width: 710px) {
    padding-top: 10px;
  }

  @media (max-width: 615px) {
    flex-direction: column;
  }

  @media (max-width: 500px) {
    padding-top: 20px;
  }
`

const mapStateToProps = (store) => ({
  isShownMock: store.portfolio.isShownMock,
})

const storeComponent = connect(mapStateToProps)(PortfolioTableTabs)

export default compose()(storeComponent)
