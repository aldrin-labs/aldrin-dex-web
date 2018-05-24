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

import { Responsive, WidthProvider } from 'react-grid-layout'
//
const ResponsiveGridLayout = WidthProvider(Responsive)

export interface Props {
  history: History
  location: Location
}

export default class Home extends React.Component<Props> {
  render() {
    const lgLayout = [
      { i: 'table', x: 1.5, y: 0, w: 4.5, h: 6, static: true },
      {
        i: 'btcprice',
        x: 6,
        y: 9,
        w: 5.5,
        h: 3,
        minW: 5.5,
        minH: 3,
        maxH: 3,
        maxW: 7,
      },
      {
        i: 'calculator',
        x: 6,
        y: 0,
        w: 2.5,
        h: 2,
        minW: 2.5,
        minH: 2,
        maxH: 2.5,
      },
      {
        i: 'dominance',
        x: 6,
        y: 4.5,
        w: 2.5,
        h: 3,
        minW: 2.5,
        minH: 3,
        maxH: 3,
      },
      {
        i: 'treeMap',
        x: 6,
        y: 9,
        w: 2.5,
        h: 2.5,
        minW: 2.5,
        minH: 2.5,
        maxH: 2.5,
      },
      { i: 'marketCap', x: 8.5, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxH: 3 },
    ]
    const smLayout = [
      { i: 'table', x: 0, y: 0, w: 6, h: 5, static: true },
      {
        i: 'btcprice',
        x: 0,
        y: 6,
        w: 6,
        h: 3,
        minW: 6,
        minH: 3,
        maxH: 4,
        maxW: 6,
      },
      {
        i: 'calculator',
        x: 0,
        y: 9,
        w: 3,
        h: 2,
        minW: 3,
        minH: 2,
        maxH: 3,
        maxW: 6,
      },
      {
        i: 'dominance',
        x: 3,
        y: 9,
        w: 3,
        h: 3,
        minW: 2,
        minH: 3,
        maxH: 4,
        maxW: 6,
      },
      {
        i: 'treeMap',
        x: 3,
        y: 18,
        w: 3,
        h: 2.5,
        minW: 3,
        minH: 2.5,
        maxH: 3,
        maxW: 3,
      },
      {
        i: 'marketCap',
        x: 0,
        y: 17,
        w: 3,
        h: 3.5,
        minH: 3.5,
        minW: 3,
        maxH: 4,
        maxW: 6,
      },
    ]

    const xsLayout = [
      { i: 'table', x: 0, y: 0, w: 4, h: 5, static: true },
      {
        i: 'btcprice',
        x: 0,
        y: 6,
        w: 4,
        h: 3,
      },
      {
        i: 'calculator',
        x: 0,
        y: 9,
        w: 2,
        h: 2,
        minW: 2,
        minH: 2,
        maxH: 3,
        maxW: 4,
      },
      {
        i: 'dominance',
        x: 3,
        y: 9,
        w: 2,
        h: 3,
        minW: 2,
        minH: 3,
        maxH: 4,
        maxW: 4,
      },
      {
        i: 'treeMap',
        x: 3,
        y: 18,
        w: 2,
        h: 2.5,
        minW: 2,
        minH: 2.5,
        maxH: 3,
        maxW: 3,
      },
      {
        i: 'marketCap',
        x: 0,
        y: 17,
        w: 2,
        h: 3.5,
        minH: 2,
        minW: 3,
        maxH: 4,
        maxW: 5,
      },
    ]

    const layouts = { lg: lgLayout, sm: smLayout, xs: xsLayout }

    return (
      <ResponsiveGridLayout
        layouts={layouts}
        draggableHandle=".dnd"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
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
