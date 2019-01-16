import React, { Component, lazy, Suspense, memo } from 'react'

import { IState } from '@containers/Portfolio/components/PortfolioTable/types'
import { ITableProps } from '@containers/Portfolio/interfaces'
import PortfolioTableBalances from './Main/PortfolioTableBalancesContainer'

const PortfolioTableIndustries = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@core/compositions/Industry')
)
import Rebalance from './Rebalance/Rebalance'
const Optimization = React.lazy(() =>
  import(/* webpackPrefetch: true */ './Optimization/Optimization')
)
const Correlation = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@containers/Portfolio/components/PortfolioTable/Correlation/Correlation')
)

import PortfolioTableTabs from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs'

import { Loading } from '@components/index'
import { Mutation } from 'react-apollo'
import { TOGGLE_BASE_COIN } from '@core/graphql/mutations/portfolio/toggleBaseCoin'

const MemoizedTab = memo(
  (props: any) => <>{props.children}</>,
  (prevProps: any, nextProps: any) => nextProps.tab === prevProps.tab
)
export class PortfolioTable extends Component<ITableProps, IState> {
  state: IState = {
    tableData: null,
    isShownChart: true,
    tab: 'main',
  }

  onChangeTab = (
    kind: 'main' | 'industry' | 'rebalance' | 'correlation' | 'optimization'
  ) => {
    this.setState({ tab: kind })
  }

  render() {
    const { isShownChart, tab } = this.state
    const {
      theme,
      dustFilter,
      showTable = false,
      isUSDCurrently,
      baseCoin,
    } = this.props

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
              {showTable && (
                <>
                  <div id="main_tab" hidden={tab !== 'main'}>
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
                  <div id="industry_tab" hidden={tab !== 'industry'}>
                    <MemoizedTab tab={tab}>
                      <PortfolioTableIndustries
                        isUSDCurrently={isUSDCurrently}
                        theme={theme}
                        tab={this.state.tab}
                        variables={{ baseCoin: 'USDT' }}
                        baseCoin="USDT"
                        filterValueSmallerThenPercentage={dustFilter}
                      />
                    </MemoizedTab>
                  </div>
                  {tab === 'rebalance' && (
                    <div id="rebalance_tab">
                      <MemoizedTab tab={tab}>
                        <Rebalance
                          baseCoin={`USDT`}
                          tab={this.state.tab}
                          isUSDCurrently={true}
                          filterValueSmallerThenPercentage={dustFilter}
                        />
                      </MemoizedTab>
                    </div>
                  )}
                  <div id="correlation_tab" hidden={tab !== 'correlation'}>
                    <MemoizedTab tab={tab}>
                      <Correlation
                        baseCoin="USDT"
                        tab={this.state.tab}
                        theme={theme}
                        filterValueSmallerThenPercentage={dustFilter}
                      />
                    </MemoizedTab>
                  </div>

                  <div id="optimization_tab" hidden={tab !== 'optimization'}>
                    <MemoizedTab tab={tab}>
                      <Optimization
                        theme={theme}
                        tab={this.state.tab}
                        isUSDCurrently={isUSDCurrently}
                        baseCoin="USDT"
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
