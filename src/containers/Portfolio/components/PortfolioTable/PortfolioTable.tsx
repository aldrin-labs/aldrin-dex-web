import * as React from 'react'
import { IState } from '@containers/Portfolio/components/PortfolioTable/types'
import { ITableProps } from '@containers/Portfolio/interfaces'
import Loadable from 'react-loadable'

import PortfolioTableTabs from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs'
import LoadableLoading from '@components/Loading/LoadableLoading'

const PortfolioTableIndustries = Loadable({
  loader: () =>
    import( '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries'),
  delay: 300,
  loading: LoadableLoading,
})

const Rebalance = Loadable({
  loader: () =>
    import('@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance'),
  delay: 300,
  loading: LoadableLoading,
})

const PortfolioTableBalances = Loadable({
  loader: () =>
    import('@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances'),
  delay: 300,
  loading: LoadableLoading,
})

const Optimization = Loadable({
  loader: () =>
    import('@containers/Portfolio/components/PortfolioTable/Optimization/Optimization'),
  delay: 300,
  loading: LoadableLoading,
})

const Correlation = Loadable({
  loader: () =>
    import('@containers/Portfolio/components/PortfolioTable/Correlation/Correlation'),
  delay: 300,
  loading: LoadableLoading,
})

export class PortfolioTable extends React.Component<ITableProps, IState> {
  state: IState = {
    tableData: null,
    isShownChart: true,
    isUSDCurrently: true,
    tab: 'main',
  }

  onToggleChart = () => {
    this.setState({ isShownChart: !this.state.isShownChart })
  }

  onToggleUSDBTC = () => {
    this.setState({ isUSDCurrently: !this.state.isUSDCurrently })
  }
  switchToUsd = () => {
    this.setState({ isUSDCurrently: true })
  }

  onChangeTab = (
    kind: 'main' | 'industry' | 'rebalance' | 'correlation' | 'optimization'
  ) => {
    this.setState({ tab: kind })
  }

  render() {
    const { tab, isShownChart, isUSDCurrently } = this.state
    const { theme } = this.props

    if (tab === 'main') {
      return (
        <PortfolioTableBalances
          isShownChart={isShownChart}
          isUSDCurrently={isUSDCurrently}
          switchToUsd={this.switchToUsd}
          subscription={this.props.subscription}
          checkboxes={this.props.checkboxes}
          tab={this.state.tab}
          theme={theme}
        >
          <PortfolioTableTabs
            theme={theme}
            toggleWallets={this.props.toggleWallets}
            tab={tab}
            isUSDCurrently={isUSDCurrently}
            onChangeTab={this.onChangeTab}
            onToggleChart={this.onToggleChart}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </PortfolioTableBalances>
      )
    }

    if (tab === 'industry') {
      return (
        <PortfolioTableIndustries
          checkboxes={this.props.checkboxes}
          isUSDCurrently={isUSDCurrently}
          theme={theme}
          switchToUsd={this.switchToUsd}
        >
          <PortfolioTableTabs
            theme={theme}
            toggleWallets={this.props.toggleWallets}
            tab={tab}
            onChangeTab={this.onChangeTab}
            onToggleChart={this.onToggleChart}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </PortfolioTableIndustries>
      )
    }

    if (tab === 'rebalance') {
      return (
        <Rebalance isUSDCurrently={true}>
          <PortfolioTableTabs
            toggleWallets={this.props.toggleWallets}
            tab={tab}
            onChangeTab={this.onChangeTab}
            onToggleChart={this.onToggleChart}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </Rebalance>
      )
    }

    if (tab === 'correlation') {
      return (
        <Correlation theme={theme}>
          <PortfolioTableTabs
            toggleWallets={this.props.toggleWallets}
            tab={tab}
            theme={theme}
            onChangeTab={this.onChangeTab}
            onToggleChart={this.onToggleChart}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </Correlation>
      )
    }

    if (tab === 'optimization') {
      return (
        <Optimization>
          <PortfolioTableTabs
            tab={tab}
            onChangeTab={this.onChangeTab}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </Optimization>
      )
    }

    return null
  }
}
