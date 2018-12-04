import React, { Component, lazy, Suspense, memo } from 'react'

import { IState } from '@containers/Portfolio/components/PortfolioTable/types'
import { ITableProps } from '@containers/Portfolio/interfaces'
import PortfolioTableBalances from './Main/PortfolioTableBalancesContainer'

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
    baseCoin: 'USDT',
    tab: 'main',
  }

  onToggleChart = () => {
    this.setState({ isShownChart: !this.state.isShownChart })
  }

  onChangeTab = (
    kind: 'main' | 'industry' | 'rebalance' | 'correlation' | 'optimization'
  ) => {
    this.setState({ tab: kind })
  }

  onToggleUSDBTC = () => {
    this.setState((prevState) => ({
      isUSDCurrently: !prevState.isUSDCurrently,
      baseCoin: !prevState.isUSDCurrently ? 'USDT' : 'BTC',
    }))
  }

  render() {
    const { isShownChart, isUSDCurrently, baseCoin, tab } = this.state
    const { theme, dustFilter, showTable = false } = this.props

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
              {showTable && (
                <>
                  <div hidden={tab !== 'main'}>
                    <MemoizedTab tab={tab}>
                      <PortfolioTableBalances
                        isShownChart={isShownChart}
                        isUSDCurrently={isUSDCurrently}
                        tab={this.state.tab}
                        theme={theme}
                        variables={{ baseCoin }}
                        baseCoin={baseCoin}
                        filterValueSmallerThenPercentage={dustFilter}
                      />
                    </MemoizedTab>
                  </div>
                  <div hidden={tab !== 'industry'}>
                    <MemoizedTab tab={tab}>
                      <PortfolioTableIndustries
                        isUSDCurrently={isUSDCurrently}
                        theme={theme}
                        tab={this.state.tab}
                        variables={{ baseCoin }}
                        baseCoin={baseCoin}
                        filterValueSmallerThenPercentage={dustFilter}
                      />
                    </MemoizedTab>
                  </div>
                  <div hidden={tab !== 'rebalance'}>
                    <MemoizedTab tab={tab}>
                      <Rebalance
                        baseCoin={`USDT`}
                        tab={this.state.tab}
                        isUSDCurrently={true}
                        filterValueSmallerThenPercentage={dustFilter}
                      />
                    </MemoizedTab>
                  </div>
                  <div hidden={tab !== 'correlation'}>
                    <MemoizedTab tab={tab}>
                      <Correlation
                        baseCoin={baseCoin}
                        tab={this.state.tab}
                        theme={theme}
                        filterValueSmallerThenPercentage={dustFilter}
                      />
                    </MemoizedTab>
                  </div>

                  <div hidden={tab !== 'optimization'}>
                    <MemoizedTab tab={tab}>
                      <Optimization
                        theme={theme}
                        tab={this.state.tab}
                        isUSDCurrently={isUSDCurrently}
                        baseCoin={baseCoin}
                        filterValueSmallerThenPercentage={dustFilter}
                      />
                    </MemoizedTab>
                  </div>
                </>
              )}
            </Suspense>
          </>
        )}
      </Mutation>
    )
  }
}
