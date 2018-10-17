import React from 'react'
import { Subscription } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { IProps, IState } from '@containers/Portfolio/interfaces'
import YouNeedToLoginMessage from '@components/YouNotLoginedCard'
import SelectExchangeOrWalletWindow from './components/SelectExchangeOrWalletWindow/SelectExchangeOrWalletWindow'
import AddExchangeOrWalletWindow from './components/AddExchangeOrWalletWindow/AddExchangeOrWalletWindow'
import PortfolioSelector from '@containers/Portfolio/components/PortfolioSelector/PortfolioSelector'
import { PortfolioTable } from '@containers/Portfolio/components'
import { withTheme, Fade } from '@material-ui/core'

const PORTFOLIO_UPDATE = gql`
  subscription onPortfolioUpdated {
    portfolioUpdate
  }
`

class PortfolioComponent extends React.Component<IProps, IState> {
  state: IState = {
    isSideNavOpen: false,
    filter: 0.5,
  }

  toggleWallets = () => {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  render() {
    const {
      login,
      theme,
      keys,
      activeKeys,
      wallets,
      activeWallets,
    } = this.props

    const hasKeysOrWallets = keys.length + wallets.length > 0
    const hasActiveKeysOrWallets = activeKeys.length + activeWallets.length > 0

    return (
      <Subscription subscription={PORTFOLIO_UPDATE}>
        {(subscriptionData) => (
          <PortfolioContainer>
            {/* refactor this */}
            {!login && <YouNeedToLoginMessage showModalAfterDelay={1500} />}
            {login &&
              !hasKeysOrWallets && <AddExchangeOrWalletWindow theme={theme} />}
            <>
              <PortfolioSelector
                toggleWallets={this.toggleWallets}
                isSideNavOpen={this.state.isSideNavOpen}
              />
              {login &&
                hasKeysOrWallets &&
                !hasActiveKeysOrWallets && (
                  <SelectExchangeOrWalletWindow
                    theme={theme}
                    toggleWallets={this.toggleWallets}
                  />
                )}
              {login &&
                hasKeysOrWallets &&
                hasActiveKeysOrWallets && (
                  <PortfolioTable
                    showTable={hasActiveKeysOrWallets}
                    activeKeys={activeKeys}
                    theme={theme}
                    toggleWallets={this.toggleWallets}
                    subscription={subscriptionData}
                  />
                )}
            </>

            <Fade
              in={this.state.isSideNavOpen}
              mountOnEnter={true}
              unmountOnExit={true}
            >
              <Backdrop onClick={this.toggleWallets} />
            </Fade>
          </PortfolioContainer>
        )}
      </Subscription>
    )
  }
}

// TODO: replace any in store
const mapStateToProps = (store: any) => ({
  store: store,
  keys: store.portfolio.keys,
  activeKeys: store.portfolio.activeKeys,
  wallets: store.portfolio.wallets,
  activeWallets: store.portfolio.activeWallets,
  login: store.login.loginStatus,
})

export default compose(
  withTheme(),
  connect(mapStateToProps)
)(PortfolioComponent)

const PortfolioContainer = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  justify-content: center;
  min-height: 600px;
`
const Backdrop = styled.div`
  display: block;
  height: 100vh;
  width: 100vw;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`
