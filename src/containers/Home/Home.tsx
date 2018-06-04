import * as React from 'react'
import styled from 'styled-components'
// import ResponsiveReactGridLayout from 'react-grid-layout'
import { History } from 'history'

import CalculatorWidget from './widgets/CalculatorWidget'
import DominanceWidget from './widgets/DominanceWidget'
import BitcoinPriceChartWidget from './widgets/BitcoinPriceChartWidget'
import TreeMapWidget from './widgets/TreeMapWidget'
import MarketCapWidget from './widgets/MarketCapWidget'
import CoinMarketTable from '@components/CoinMarketTable/CoinMarketTable'
import {
  lgLayout,
  mdLayout,
  smLayout,
  smxLayout,
  xsLayout,
  xxsLayout,
} from './layouts'

import { Responsive, WidthProvider } from 'react-grid-layout'
//
const ResponsiveGridLayout = WidthProvider(Responsive)

export interface Props {
  history: History
  location: Location
}

export default class Home extends React.Component<Props> {
  render() {
    const layouts = {
      lg: lgLayout,
      md: mdLayout,
      sm: smLayout,
      smx: smxLayout,
      xs: xsLayout,
      xxs: xxsLayout,
    }

    return (
      <ResponsiveGridLayout
        layouts={layouts}
        draggableHandle=".dnd"
        breakpoints={{ lg: 1200, md: 996, sm: 768, smx: 630, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, smx: 6, xs: 4, xxs: 2 }}
      >
        <Column key="table">
          <CoinMarketTable {...this.props} />
        </Column>
        <Column key="btcprice">
          <BitcoinPriceChartWidget />
        </Column>
        <Column key="calculator">
          <CalculatorWidget />
        </Column>
        <Column key="dominance">
          <DominanceWidget />
        </Column>
        <Column key="treeMap">
          <TreeMapWidget />
        </Column>
        <Column key="marketCap">
          <MarketCapWidget />
        </Column>
      </ResponsiveGridLayout>
    )
  }
}

const Column = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
