import * as React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import styled from 'styled-components'
import ReactGridLayout from 'react-grid-layout'
import CoinMarketTable from '../../components/CoinMarketTable/CoinMarketTable'
import Calculator from '../../components/Calculator/Calculator'
import DominanceChart from '../../components/DominanceChart/DominanceChart'
import TreeMapChart from '@components/TreeMapChart/TreeMapChart'
import MarketCapWidget from '@components/MarketCapWidget/MarketCapWidget'
import { CoinMarketCapQueryQuery } from '../CoinMarketCap/annotations'
import styles from 'react-grid-layout/css/styles.css'

export const rates = [
  { name: 'BTC/USD', rate: 9103.26 },
  { name: 'USD/BTC', rate: 0.00011 },
  { name: 'BTC/ETH', rate: 1 },
  { name: 'ETH/BTC', rate: 1 },
  { name: 'ETH/USD', rate: 580.06 },
  { name: 'USD/ETH', rate: 1 },
  { name: 'XRP/USD', rate: 0.709714 },
  { name: 'USD/XRP', rate: 1 },
]

interface Props {
  data: CoinMarketCapQueryQuery
  history: History
  location: Location
}

class Home extends React.Component<Props, {}> {
  render() {
    const { data } = this.props
    const { assetPagination } = data
    if (!assetPagination || !assetPagination.items) return null
    const { items } = assetPagination

    const layout = [
      { i: 'table', x: 0, y: 0, w: 6, h: 6, static: true },
      { i: 'calculator', x: 6, y: 0, w: 2.5, h: 2 },
      { i: 'dominance_chart', x: 6, y: 4.5, w: 2.5, h: 3 },
      { i: 'treeMap', x: 6, y: 9, w: 2.5, h: 2.5 },
      { i: 'marketCap', x: 8.5, y: 0, w: 3, h: 2.5 },
    ]

    return (
      <ReactGridLayout
        layout={layout}
        width={window.innerWidth}
        draggableHandle=".dnd"
      >
        <Column key="table">
          <CoinMarketTable items={items} />
        </Column>

        <Column key="calculator">
          <Calculator rates={rates} />
        </Column>
        <Column key="dominance_chart">
          <DominanceChart />
        </Column>

        <Column key="treeMap">
          <TreeMapChart />
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
  align-items: start;
`

export const HomeQuery = gql`
  query HomeQuery($page: Int, $perPage: Int) {
    assetPagination(page: $page, perPage: $perPage) {
      pageInfo {
        pageCount
        hasNextPage
        currentPage
        hasPreviousPage
        perPage
      }
      count
      items {
        _id
        name
        symbol
        priceUSD
        maxSupply
        totalSupply
        availableSupply
        priceBTC
        percentChangeDay
      }
    }
  }
`

const options = ({ location }) => {
  let page
  if (!location) {
    page = 1
  } else {
    const query = new URLSearchParams(location.search)
    page = query.get('page')
  }
  return { variables: { perPage: 20, page } }
}

export default graphql(HomeQuery, { options })(Home)
