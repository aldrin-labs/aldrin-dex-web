import React, { Component, lazy, Suspense } from 'react'

import { IState } from '@containers/Portfolio/components/PortfolioTable/types'
import { ITableProps } from '@containers/Portfolio/interfaces'
const PortfolioTableBalances = React.lazy(() =>
  import('./Main/PortfolioTableBalancesContainer')
)
const PortfolioTableIndustries = React.lazy(() =>
  import('./Industry/PortfolioTableIndustries')
)

import PortfolioTableTabs from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs'
import Rebalance from './Rebalance/Rebalance'
import Optimization from './Optimization/Optimization'
import Correlation from '@containers/Portfolio/components/PortfolioTable/Correlation/Correlation'
import { Loading } from '@components/index'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { TOGGLE_BASE_COIN } from 'src/mutations/toggleBaseCoin'

export class PortfolioTable extends Component<ITableProps, IState> {
  state: IState = {
    tableData: null,
    isShownChart: true,
    isUSDCurrently: true,
    tab: 'main',
    baseCoin: 'USDT',
  }

  onToggleChart = () => {
    this.setState({ isShownChart: !this.state.isShownChart })
  }

  onToggleUSDBTC = () => {
    this.setState((prevState) => ({
      isUSDCurrently: !prevState.isUSDCurrently,
      baseCoin: !prevState.isUSDCurrently ? 'USDT' : 'BTC',
    }))
  }

  renderTab = () => {
    const { tab, isShownChart, isUSDCurrently, baseCoin } = this.state
    const { theme, dustFilter } = this.props

    let render = null
    switch (tab) {
      case 'main':
        render = (
          <PortfolioTableBalances
            isShownChart={isShownChart}
            isUSDCurrently={isUSDCurrently}
            subscription={this.props.subscription}
            tab={this.state.tab}
            theme={theme}
            variables={{ baseCoin }}
            baseCoin={baseCoin}
            filterValueSmallerThenPercentage={dustFilter}
          />
        )
        break
      case 'industry':
        render = (
          <PortfolioTableIndustries
            isUSDCurrently={isUSDCurrently}
            theme={theme}
            variables={{ baseCoin }}
            baseCoin={baseCoin}
            filterValueSmallerThenPercentage={dustFilter}
          />
        )
        break
      case 'rebalance':
        render = (
          <Rebalance
            baseCoin={`USDT`}
            isUSDCurrently={true}
            filterValueSmallerThenPercentage={dustFilter}
          />
        )
        break
      case 'correlation':
        render = (
          <Correlation
            baseCoin={baseCoin}
            theme={theme}
            filterValueSmallerThenPercentage={dustFilter}
          />
        )
        break
      case 'optimization':
        render = (
          <Optimization
            theme={theme}
            isUSDCurrently={isUSDCurrently}
            baseCoin={baseCoin}
            filterValueSmallerThenPercentage={dustFilter}
          />
        )
        break

      default:
        break
    }

    return render
  }

  onChangeTab = (
    kind: 'main' | 'industry' | 'rebalance' | 'correlation' | 'optimization'
  ) => {
    this.setState({ tab: kind })
  }

  render() {
    const { tab, isUSDCurrently } = this.state
    const { theme, showTable = false } = this.props

    return (
      <Mutation mutation={TOGGLE_BASE_COIN}>
        {(toggleBaseCoin) => (
          <>
            <PortfolioTableTabs
              theme={theme}
              toggleWallets={this.props.toggleWallets}
              tab={tab}
              isUSDCurrently={isUSDCurrently}
              onChangeTab={this.onChangeTab}
              onToggleChart={this.onToggleChart}
              onToggleUSDBTC={() => {
                this.onToggleUSDBTC()
                toggleBaseCoin()
              }}
            />
            <Suspense fallback={<Loading centerAligned />}>
              {showTable && this.renderTab()}
            </Suspense>
          </>
        )}
      </Mutation>
    )
  }
}
