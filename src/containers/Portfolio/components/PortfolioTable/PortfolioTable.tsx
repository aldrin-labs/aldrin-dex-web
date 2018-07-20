import * as React from 'react'
import { IState } from './types'
import { ITableProps } from '../../interfaces'
import PortfolioTableIndustries from './Industry/PortfolioTableIndustries'
import PortfolioTableRebalance from './Rebalance/PortfolioTableRebalance'
import PortfolioTableBalances from './Main/PortfolioTableBalances'
import Optimization from './Optimization/Optimization'
import Correlation from './Correlation/Correlation'
import { Loading } from '@components/Loading/Loading'
import PortfolioTableTabs from './PortfolioTableTabs'

export class PortfolioTable extends React.Component<ITableProps, IState> {
  state: IState = {
    tableData: null,
    isShownChart: true,
    portfolio: null,
    isUSDCurrently: true,
    tab: 'main',
  }

  onToggleChart = () => {
    this.setState({ isShownChart: !this.state.isShownChart })
  }

  onToggleUSDBTC = () => {
    this.setState({ isUSDCurrently: !this.state.isUSDCurrently })
  }

  onChangeTab = (kind: 'main' | 'industry' | 'rebalance') => {
    this.setState({ tab: kind })
  }

  render() {
    const { tab, portfolio, isShownChart, isUSDCurrently } = this.state

    if (this.props.loading) {
      return <Loading centerAligned />
    }

    if (tab === 'main') {
      return (
        <PortfolioTableBalances
          isShownChart={isShownChart}
          isUSDCurrently={isUSDCurrently}
          subscription={this.props.subscription}
          // data={this.props.data}
          checkboxes={this.props.checkboxes}
          tab={this.state.tab}
        >
          <PortfolioTableTabs
            toggleWallets={this.props.toggleWallets}
            tab={tab}
            portfolio={portfolio}
            // data={this.props.data}
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
          // data={this.props.data}
          isUSDCurrently={isUSDCurrently}
        >
          <PortfolioTableTabs
            toggleWallets={this.props.toggleWallets}
            tab={tab}
            portfolio={portfolio}
            // data={this.props.data}
            onChangeTab={this.onChangeTab}
            onToggleChart={this.onToggleChart}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </PortfolioTableIndustries>
      )
    }

    if (tab === 'rebalance') {
      return (
        <PortfolioTableRebalance
          isUSDCurrently={true}
          data={this.props.data}
          updateRebalanceMutationQuery={this.props.updateRebalanceMutationQuery}
        >
          <PortfolioTableTabs
            toggleWallets={this.props.toggleWallets}
            tab={tab}
            portfolio={portfolio}
            onChangeTab={this.onChangeTab}
            onToggleChart={this.onToggleChart}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </PortfolioTableRebalance>
      )
    }

    if (tab === 'correlation') {
      return (
        <Correlation>
          <PortfolioTableTabs
            data={this.props.data}
            toggleWallets={this.props.toggleWallets}
            tab={tab}
            portfolio={portfolio}
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
            portfolio={portfolio}
            onChangeTab={this.onChangeTab}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </Optimization>
      )
    }

    return null
  }
}
