import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import spinLoader from '@icons/tail-spin.svg'
import { IState } from './types'
import { ITableProps } from '../../interfaces'
import PortfolioTableIndustries from './Industry/PortfolioTableIndustries'
import PortfolioTableRebalance from './Rebalance/PortfolioTableRebalance'
import PortfolioTableBalances from './Main/PortfolioTableBalances'
import Correlation from './Correlation/Correlation'
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
    const {
      tab,
      tableData,
      portfolio,
      isShownChart,
      isUSDCurrently,
    } = this.state

    // if (!this.props.data) return null

    if (this.props.data && !tableData) {
      return (
        <LoaderWrapper>
          <SvgIcon
            src={spinLoader}
            width={48}
            height={48}
            style={{
              position: 'absolute',
              left: 'calc(50% - 48px)',
              top: 'calc(50% - 48px)',
            }}
          />
        </LoaderWrapper>
      )
    }
    if (tab === 'main') {
      return (
        <PortfolioTableBalances
          isShownChart={isShownChart}
          isUSDCurrently={isUSDCurrently}
          subscription={this.props.subscription}
          data={this.props.data}
          checkboxes={this.props.checkboxes}
          tab={this.state.tab}
        >
          <PortfolioTableTabs
            toggleWallets={this.props.toggleWallets}
            tab={tab}
            portfolio={portfolio}
            data={this.props.data}
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
          data={this.props.data}
          isUSDCurrently={isUSDCurrently}
        >
          <PortfolioTableTabs
            tab={tab}
            portfolio={portfolio}
            data={this.props.data}
            onChangeTab={this.onChangeTab}
            onToggleChart={this.onToggleChart}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </PortfolioTableIndustries>
      )
    }

    if (tab === 'rebalance') {
      return (
        <PortfolioTableRebalance>
          <PortfolioTableTabs
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
            tab={tab}
            portfolio={portfolio}
            onChangeTab={this.onChangeTab}
            onToggleChart={this.onToggleChart}
            onToggleUSDBTC={this.onToggleUSDBTC}
          />
        </Correlation>
      )
    }

    return null
  }
}

const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 24px;
  position: relative;
`
