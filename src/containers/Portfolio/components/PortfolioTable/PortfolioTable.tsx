import * as React from 'react'
import { IState } from '@containers/Portfolio/components/PortfolioTable/types'
import { ITableProps } from '@containers/Portfolio/interfaces'
import PortfolioTableIndustries from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries'
import PortfolioTableRebalance from '@containers/Portfolio/components/PortfolioTable/Rebalance/PortfolioTableRebalance'
import PortfolioTableBalances from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances'
import Optimization from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization'
import Correlation from '@containers/Portfolio/components/PortfolioTable/Correlation/Correlation'
import PortfolioTableTabs from '@containers/Portfolio/components/PortfolioTable/PortfolioTableTabs'
import SwipeableViews from 'react-swipeable-views'
import styled from 'styled-components'

export class PortfolioTable extends React.Component<ITableProps, IState> {
  state: IState = {
    index: 0,
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

  onChangeTab = (
    tab: 'main' | 'industry' | 'rebalance' | 'correlation' | 'optimization'
  ) => {
    switch (tab) {
      case 'main':
        this.setState({ tab, index: 0 })
        break
      case 'industry':
        this.setState({ tab, index: 1 })
        break
      case 'rebalance':
        this.setState({ tab, index: 2 })
        break
      case 'correlation':
        this.setState({ tab, index: 3 })
        break
      case 'optimization':
        this.setState({ tab, index: 4 })
        break

      default:
        this.setState({ tab, index: 0 })
        break
    }
  }

  handleChangeIndex = (index) => {
    this.setState({
      index,
    })
  }

  render() {
    const { tab, isShownChart, isUSDCurrently, index } = this.state

    return (
      <Container>
        <PortfolioTableTabs
          toggleWallets={this.props.toggleWallets}
          tab={tab}
          onChangeTab={this.onChangeTab}
          onToggleChart={this.onToggleChart}
          onToggleUSDBTC={this.onToggleUSDBTC}
        />
        <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
          <PortfolioTableBalances
            isShownChart={isShownChart}
            isUSDCurrently={isUSDCurrently}
            subscription={this.props.subscription}
            checkboxes={this.props.checkboxes}
            tab={this.state.tab}
          />

          <PortfolioTableIndustries
            checkboxes={this.props.checkboxes}
            isUSDCurrently={isUSDCurrently}
          />

          <div />
          {/* <PortfolioTableRebalance isUSDCurrently={true}>
            <PortfolioTableTabs
              toggleWallets={this.props.toggleWallets}
              tab={tab}
              onChangeTab={this.onChangeTab}
              onToggleChart={this.onToggleChart}
              onToggleUSDBTC={this.onToggleUSDBTC}
            />
          </PortfolioTableRebalance> */}

          <Correlation />

          <Optimization />
        </SwipeableViews>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 95vw;
  align-self: center;
  margin: 1rem 0;
`
