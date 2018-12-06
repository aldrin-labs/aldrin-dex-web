import React, { Component, lazy, Suspense, memo } from 'react'

import { IState } from '@containers/Portfolio/components/PortfolioTable/types'
import { ITableProps } from '@containers/Portfolio/interfaces'
const PortfolioTableBalances = React.lazy(() =>
  import('./Main/PortfolioTableBalancesContainer')
)
const PortfolioTableIndustries = React.lazy(() =>
  import(/* webpackPrefetch: true */ './Industry/PortfolioTableIndustries')
)
const Rebalance = React.lazy(() =>
  import(/* webpackPrefetch: true */ './Rebalance/Rebalance')
)
const Optimization = React.lazy(() =>
  import(/* webpackPrefetch: true */ './Optimization/Optimization')
)
const Correlation = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@containers/Portfolio/components/PortfolioTable/Correlation/Correlation')
)

import PortfolioTableTabs from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs'

import { Loading } from '@components/index'
import { Mutation } from 'react-apollo'
import { TOGGLE_BASE_COIN } from '../../../../mutations/portfolio/toggleBaseCoin'

const MemoizedTab = memo(
  (props: any) => <>{props.children}</>,
  (prevProps: any, nextProps: any) => nextProps.tab === prevProps.tab
)
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
              onToggleUSDBTC={() => {
                this.props.onToggleUSDBTC()
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
