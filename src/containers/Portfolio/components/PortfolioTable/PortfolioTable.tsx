import * as React from 'react'
import { IState } from '@containers/Portfolio/components/PortfolioTable/types'
import { ITableProps } from '@containers/Portfolio/interfaces'
import PortfolioTableIndustries from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries'
import Rebalance from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance'
import PortfolioTableBalances from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances'
import Optimization from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization'
import Correlation from '@containers/Portfolio/components/PortfolioTable/Correlation/Correlation'
import { Loading } from '@components/Loading/Loading'
import PortfolioTableTabs from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs'

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

    if (tab === 'main') {
      return (
        <PortfolioTableBalances
          isShownChart={isShownChart}
          isUSDCurrently={isUSDCurrently}
          switchToUsd={this.switchToUsd}
          subscription={this.props.subscription}
          checkboxes={this.props.checkboxes}
          tab={this.state.tab}
        >
          <PortfolioTableTabs
            toggleWallets={this.props.toggleWallets}
            tab={tab}
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
          switchToUsd={this.switchToUsd}
        >
          <PortfolioTableTabs
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
        <Correlation>
          <PortfolioTableTabs
            toggleWallets={this.props.toggleWallets}
            tab={tab}
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
