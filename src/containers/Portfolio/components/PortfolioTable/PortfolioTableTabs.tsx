import * as React from 'react'
import styled, { css } from 'styled-components'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import AccountIcon from 'react-icons/lib/md/settings'

import SvgIcon from '@components/SvgIcon/SvgIcon'
import Switch from '@components/Switch/Switch'
import gridLoader from '@icons/grid.svg'
import { IProps } from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs.types'
import Menu from '@containers/Portfolio/components/PortfolioTable/ThreeDotsMenu'

const UPDATE_PORTFOLIO = gql`
  mutation updatePortfolio {
    updatePortfolio
  }
`

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
    const { tab, portfolio, toggleWallets } = this.props

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
              <StyledAccountIcon />
            </ToggleAccountsBtn>

            <Tab
              onClick={() => this.onChangeTab('main')}
              active={tab === 'main'}
            >
              Main
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('industry')}
              active={tab === 'industry'}
            >
              Industry
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('rebalance')}
              active={tab === 'rebalance'}
            >
              Rebalance
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('correlation')}
              active={tab === 'correlation'}
            >
              Correlation
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('optimization')}
              active={tab === 'optimization'}
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
                  <Switch
                    onClick={this.onToggleUSDBTC}
                    values={['USD', 'BTC']}
                  />

                  {tab === 'main' && (
                    <Mutation mutation={UPDATE_PORTFOLIO}>
                      {(updatePortfolio, { data, loading }) => {
                        const isLoading =
                          loading || (portfolio && portfolio.processing)

                        return (
                          <ToggleBtn onClick={updatePortfolio}>
                            {isLoading ? (
                              <SvgIcon
                                src={gridLoader}
                                width={24}
                                height={24}
                              />
                            ) : (
                              'Refresh'
                            )}
                          </ToggleBtn>
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

const PTHeadingBlock = styled.div`
  display: flex;

  position: sticky;
  top: 0;
  background-color: #393e44;
  z-index: 99;

  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 17px;
  min-height: 100px;

  @media (max-width: 1080px) {
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
  left: 0;

  @media (max-width: 840px) {
    margin-right: 1rem;
  }

  @media (max-width: 710px) {
    padding-top: 10px;
    margin-right: 0;
    flex-flow: wrap;
  }
`

const Btn = css`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
  font-size: 1em;
  padding: 0;
`

const ToggleBtn = styled.button`
  ${Btn};
`

const ToggleAccountsBtn = ToggleBtn.extend`
  display: block;

  @media (min-width: 1080px) {
    display: none;
  }
`

const StyledAccountIcon = styled(AccountIcon)`
  font-size: 1.5rem;
  margin-top: 0.3rem;
`

const TabContainer = styled.div`
  width: 70%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  align-items: center;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, 4rem);
  }
`

const Tab = styled.button`
  color: ${(props: { active?: boolean }) =>
    props.active ? '#4ed8da' : '#fff'};
  border-color: ${(props: { active?: boolean }) =>
    props.active ? '#4ed8da' : 'transparent'};

  padding: 10px 30px;
  border-radius: 3px;
  background-color: #292d31;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  margin: 10px 15px;
  outline: none;
  box-sizing: border-box;

  @media (max-width: 1080px) {
    display: none;
    width: 8rem;
    padding: 0.5rem;
  }

  @media (max-width: 615px) {
    width: 5.5rem;
    padding: 0.5rem;
  }
`

const SwitchRefreshContainer = styled.div`
  display: flex;

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
