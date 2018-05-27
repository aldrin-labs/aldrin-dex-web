import * as React from 'react'
import styled from 'styled-components'
import ReactGridLayout from 'react-grid-layout'
import { History } from 'history'

import CalculatorWidget from './widgets/CalculatorWidget'
import DominanceWidget from './widgets/DominanceWidget'
import BitcoinPriceChartWidget from './widgets/BitcoinPriceChartWidget'
import TreeMapWidget from './widgets/TreeMapWidget'
import MarketCapWidget from './widgets/MarketCapWidget'
import CoinMarketTable from '@components/CoinMarketTable/CoinMarketTable'

export interface Props {
  history: History
  location: Location
}

export default class Home extends React.Component<Props> {
  render() {
    const layout = [
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

    return (
      <ReactGridLayout
        layout={layout}
        width={window.innerWidth}
        draggableHandle=".dnd"
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
      </ReactGridLayout>
    )
  }
}

const Column = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
