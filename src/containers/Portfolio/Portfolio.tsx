import React from 'react'
import { graphql, Subscription } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { has } from 'lodash-es'

import { IProps, IState } from '@containers/Portfolio/interfaces'
import SelectExchangeOrWalletWindow from './components/SelectExchangeOrWalletWindow/SelectExchangeOrWalletWindow'
import AddExchangeOrWalletWindow from './components/AddExchangeOrWalletWindow/AddExchangeOrWalletWindow'
import PortfolioSelector from '@containers/Portfolio/components/PortfolioSelector/PortfolioSelector'
import { PortfolioTable } from '@containers/Portfolio/components'
import { withTheme, Fade } from '@material-ui/core'
import { queryRendererHoc } from '@components/QueryRenderer'
import { getKeysAndWallets, PORTFOLIO_UPDATE } from './api'
import withAuth from '@hoc/withAuth'
import { CustomError } from '@components/ErrorFallback/ErrorFallback'
import { Backdrop, PortfolioContainer } from './Portfolio.styles'
import { updatePortfolioSettingsMutation, portfolioKeyAndWalletsQuery } from '@containers/Portfolio/api'


class PortfolioComponent extends React.Component<IProps, IState> {
  state: IState = {
    isSideNavOpen: false,
  }

  toggleWallets = () => {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  render() {
    const { theme,
      // activeKeys, activeWallets,
      data, updatePortfolioSettings } = this.props

    if (!has(data, 'myPortfolios')) {
      return (
        <CustomError>
          No myPortfolios was provided, check Portoflio.tsx render
        </CustomError>
      )
    }

    // const { keys, cryptoWallets } = data.myPortfolios[0]
    const { userSettings: { portfolioId, dustFilter, keys, wallets }, userSettings } = data.myPortfolios[0]
    console.log('userSettings', userSettings);


    const activeKeys = keys.filter((el) => el.selected)
    const activeWallets = wallets.filter((el) => el.selected)
    // const activeKeys = keys.reduce((acc, el) => el.selected ? el.name : acc, [])
    // const activeWallets = wallets.reduce((acc, el) => el.selected ? el.name : acc, [])
    console.log('activeKeys', activeKeys);
    console.log('activeWallets', activeWallets);


    const hasKeysOrWallets = keys.length + wallets.length > 0
    const hasActiveKeysOrWallets = activeKeys.length + activeWallets.length > 0

    return (
      <Subscription subscription={PORTFOLIO_UPDATE}>
        {(subscriptionData) => (
          <PortfolioContainer>
            {/* refactor this */}

            <PortfolioSelector
              updatePortfolioSettings={updatePortfolioSettings}
              portfolioId={portfolioId}
              dustFilter={dustFilter}
              newKeys={keys}
              newWallets={wallets}
              activeKeys={activeKeys}
              activeWallets={activeWallets}
              toggleWallets={this.toggleWallets}
              isSideNavOpen={this.state.isSideNavOpen}
            />

            {!hasKeysOrWallets && <AddExchangeOrWalletWindow theme={theme} />}

            {hasKeysOrWallets &&
              !hasActiveKeysOrWallets && (
                <SelectExchangeOrWalletWindow
                  theme={theme}
                  toggleWallets={this.toggleWallets}
                />
              )}

            {hasKeysOrWallets &&
              hasActiveKeysOrWallets && (
                <>
                  <PortfolioTable
                    showTable={hasActiveKeysOrWallets}
                    activeKeys={activeKeys.map((el)=> el.name)}
                    activeWallets={activeWallets.map((el)=> el.name)}
                    theme={theme}
                    toggleWallets={this.toggleWallets}
                    subscription={subscriptionData}
                  />
                </>
              )}

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
  // activeKeys: store.portfolio.activeKeys,
  wallets: store.portfolio.wallets,
  // activeWallets: store.portfolio.activeWallets,
  login: store.login.loginStatus,
})

export default compose(
  withAuth,
  queryRendererHoc({ query: portfolioKeyAndWalletsQuery }),
  graphql(updatePortfolioSettingsMutation, {
    name: 'updatePortfolioSettings',
    options: {
      refetchQueries: [{query: portfolioKeyAndWalletsQuery}],
    },
  }),
  withTheme(),
  connect(mapStateToProps)
)(PortfolioComponent)

