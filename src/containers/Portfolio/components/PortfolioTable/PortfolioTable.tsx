import * as React from 'react'
import { IState } from '@containers/Portfolio/components/PortfolioTable/types'
import { ITableProps } from '@containers/Portfolio/interfaces'
import Loadable from 'react-loadable'

import PortfolioTableBalances from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances'
import PortfolioTableTabs from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs'
import LoadableLoading from '@components/Loading/LoadableLoading'

const PortfolioTableIndustries = Loadable({
  loader: () =>
    import('@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries'),
  delay: 300,
  loading: LoadableLoading,
})

const Rebalance = Loadable({
  loader: () =>
    import('@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance'),
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

  renderTab = () => {
    const { tab, isShownChart, isUSDCurrently } = this.state
    const { theme } = this.props

    let render = null
    switch (tab) {
      case 'main':
        render = (
          <PortfolioTableBalances
            isShownChart={isShownChart}
            isUSDCurrently={isUSDCurrently}
            switchToUsd={this.switchToUsd}
            subscription={this.props.subscription}
            activeKeys={this.props.activeKeys}
            tab={this.state.tab}
            theme={theme}
          />
        )
        break
      case 'industry':
        render = (
          <PortfolioTableIndustries
            activeKeys={this.props.activeKeys}
            isUSDCurrently={isUSDCurrently}
            theme={theme}
            switchToUsd={this.switchToUsd}
          />
        )
        break
      case 'rebalance':
        render = <Rebalance isUSDCurrently={true} />
        break
      case 'correlation':
        render = <Correlation theme={theme} />
        break
      case 'optimization':
        render = <Optimization theme={theme} />
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
      <>
        <PortfolioTableTabs
          theme={theme}
          toggleWallets={this.props.toggleWallets}
          tab={tab}
          isUSDCurrently={isUSDCurrently}
          onChangeTab={this.onChangeTab}
          onToggleChart={this.onToggleChart}
          onToggleUSDBTC={this.onToggleUSDBTC}
        />
        {showTable && this.renderTab()}
      </>
    )

    return null
  }
}
