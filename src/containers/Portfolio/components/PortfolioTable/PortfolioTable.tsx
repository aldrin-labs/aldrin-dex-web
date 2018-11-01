import * as React from 'react'

import { IState } from '@containers/Portfolio/components/PortfolioTable/types'
import { ITableProps } from '@containers/Portfolio/interfaces'
import PortfolioTableBalances from './Main/PortfolioTableBalancesContainer'
import PortfolioTableTabs from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs'
import PortfolioTableIndustries from './Industry/PortfolioTableIndustries'
import Rebalance from './Rebalance/Rebalance'
import Optimization from './Optimization/Optimization'
import Correlation from '@containers/Portfolio/components/PortfolioTable/Correlation/Correlation'

export class PortfolioTable extends React.Component<ITableProps, IState> {
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
    const { theme } = this.props

    let render = null
    switch (tab) {
      case 'main':
        render = (
          <PortfolioTableBalances
            isShownChart={isShownChart}
            isUSDCurrently={isUSDCurrently}
            subscription={this.props.subscription}
            activeKeys={this.props.activeKeys}
            activeWallets={this.props.activeWallets}
            tab={this.state.tab}
            theme={theme}
            variables={{ baseCoin }}
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
          />
        )
        break
      case 'rebalance':
        render = <Rebalance baseCoin={baseCoin} isUSDCurrently={true} />
        break
      case 'correlation':
        render = <Correlation baseCoin={baseCoin} theme={theme} />
        break
      case 'optimization':
        render = (
          <Optimization
            theme={theme}
            isUSDCurrently={isUSDCurrently}
            baseCoin={baseCoin}
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
