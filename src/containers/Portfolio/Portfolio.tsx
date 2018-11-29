import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { compose } from 'recompose'
import { has } from 'lodash-es'

import { IProps, IState } from '@containers/Portfolio/interfaces'
import SelectExchangeOrWalletWindow from './components/SelectExchangeOrWalletWindow/SelectExchangeOrWalletWindow'
import AddExchangeOrWalletWindow from './components/AddExchangeOrWalletWindow/AddExchangeOrWalletWindow'
import PortfolioSelector from '@containers/Portfolio/components/PortfolioSelector/PortfolioSelector'
import { PortfolioTable } from '@containers/Portfolio/components'
import { withTheme, Fade, LinearProgress } from '@material-ui/core'

import withAuth from '@hoc/withAuth'
import { CustomError } from '@components/ErrorFallback/ErrorFallback'
import { Backdrop, PortfolioContainer } from './Portfolio.styles'
import {
  updatePortfolioSettingsMutation,
  portfolioKeyAndWalletsQuery,
} from '@containers/Portfolio/api'
import { navBarHeight } from '@components/NavBar/NavBar.styles'
import { Loading } from '@components/Loading/Loading'

const safePortfolioDestruction = (
  portfolio = {
    userSettings: {
      portfolioId: null,
      dustFilter: null,
      keys: [],
      wallets: [],
    },
  }
) => portfolio

class PortfolioComponent extends React.Component<IProps, IState> {
  state: IState = {
    isSideNavOpen: false,
  }

  toggleWallets = () => {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  render() {
    const { theme } = this.props

    return (
      <Query
        notifyOnNetworkStatusChange
        fetchPolicy="cache-and-network"
        query={portfolioKeyAndWalletsQuery}
      >
        {({
          data = { myPortfolios: [{ userSettings: {} }] },
          loading,
          refetch,
          networkStatus,
        }) => {
          if (networkStatus === 4 || loading) {
            return (
              <LinearProgress
                style={{
                  position: 'fixed',
                  top: 0,
                  width: '100vw',
                  zIndex: 1009,
                }}
                color="secondary"
              />
            )
          }

          if (!has(data, 'myPortfolios') && !loading) {
            return (
              <CustomError>
                No myPortfolios was provided, check Portoflio.tsx render
              </CustomError>
            )
          }

          const {
            userSettings: { portfolioId, dustFilter },
          } = safePortfolioDestruction(data.myPortfolios[0])

          // TODO: hotfix, should be fixed on backend
          let {
            userSettings: { keys, wallets },
          } = safePortfolioDestruction(data.myPortfolios[0])

          keys = Array.isArray(keys) ? keys : []
          wallets = Array.isArray(wallets) ? wallets : []
          // TODO: hotfix, should be fixed on backend

          const activeKeys = keys.filter((el) => el.selected)
          const activeWallets = wallets.filter((el) => el.selected)

          const hasKeysOrWallets = keys.length + wallets.length > 0
          const hasActiveKeysOrWallets =
            activeKeys.length + activeWallets.length > 0

          return (
            <Mutation
              onCompleted={() => refetch()}
              mutation={updatePortfolioSettingsMutation}
            >
              {(updatePortfolioSettings) => (
                <>
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

                    {!hasKeysOrWallets && (
                      <AddExchangeOrWalletWindow theme={theme} />
                    )}

                    {hasKeysOrWallets && !hasActiveKeysOrWallets && (
                      <SelectExchangeOrWalletWindow
                        theme={theme}
                        toggleWallets={this.toggleWallets}
                      />
                    )}

                    {hasKeysOrWallets && hasActiveKeysOrWallets && (
                      <PortfolioTable
                        key={activeKeys.length + activeWallets.length}
                        showTable={hasActiveKeysOrWallets}
                        dustFilter={dustFilter}
                        theme={theme}
                        toggleWallets={this.toggleWallets}
                      />
                    )}

                    <Fade
                      in={this.state.isSideNavOpen}
                      mountOnEnter={true}
                      unmountOnExit={true}
                    >
                      <Backdrop onClick={this.toggleWallets} />
                    </Fade>
                  </PortfolioContainer>
                </>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default compose(
  withTheme()
)(PortfolioComponent)
