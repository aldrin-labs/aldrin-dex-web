import React from 'react'
import { Subscription, graphql } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { IProps } from '@containers/Portfolio/interfaces'
import YouNeedToLoginMessage from '@components/YouNotLoginedCard'
import PortfolioSelector from '@containers/Portfolio/components/PortfolioSelector/PortfolioSelector'
import { PortfolioTable } from '@containers/Portfolio/components'
import { withTheme } from '@material-ui/core'

const PORTFOLIO_UPDATE = gql`
  subscription onPortfolioUpdated {
    portfolioUpdate
  }
`

class PortfolioComponent extends React.Component<IProps> {
  constructor(props, context) {
    super(props, context)

    this.state = {
      // checkboxes: this.props.keys,
      isSideNavOpen: false,
      filter: 0.5,
    }

    this.toggleWallets = this.toggleWallets.bind(this)
  }

  toggleWallets() {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  render() {
    const { login, theme, keys, activeKeys, wallets, activeWallets } = this.props

    console.log('activeKeys: ', activeKeys, 'keys', keys );
    console.log('activeWallets: ', activeWallets, 'wallets ', wallets);



    return (
      <Subscription subscription={PORTFOLIO_UPDATE}>
        {(subscriptionData) => (
          <PortfolioContainer>
            {login ? (
              <>
                <PortfolioSelector
                  toggleWallets={this.toggleWallets}
                  isSideNavOpen={this.state.isSideNavOpen}
                  // onChangeActive={this.onChangeActiveKey}
                />
                <PortfolioTable
                  checkboxes={activeKeys}
                  theme={theme}
                  toggleWallets={this.toggleWallets}
                  subscription={subscriptionData}
                />
              </>
            ) : (
              <YouNeedToLoginMessage showModalAfterDelay={1500} />
            )}

            <Backdrop
              onClick={this.toggleWallets}
              isSideNavOpen={this.state.isSideNavOpen}
            />
          </PortfolioContainer>
        )}
      </Subscription>
    )
  }
}

const mapStateToProps = (store) => ({
  store: store,
  keys: store.portfolio.keys,
  activeKeys: store.portfolio.activeKeys,
  wallets: store.portfolio.wallets,
  activeWallets: store.portfolio.activeWallets,
  login: store.login.loginStatus,
})

export default compose(withTheme(), connect(mapStateToProps))(
  PortfolioComponent
)

const PortfolioContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 600px;
`
const Backdrop = styled.div`
  display: ${(props) => (props.isSideNavOpen ? 'block' : 'none')};
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
