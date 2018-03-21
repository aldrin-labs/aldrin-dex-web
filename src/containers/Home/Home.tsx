import * as React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import styled from 'styled-components'
import CoinMarketTable from '../../components/CoinMarketTable/CoinMarketTable'
import Calculator from '../../components/Calculator/Calculator'
import DominanceChart from '../../components/DominanceChart/DominanceChart'
import { CoinMarketCapQueryQuery } from '../CoinMarketCap/annotations'

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

    return (
      <div>
        <Wrapper>
          <LeftColumn>
            <CoinMarketTable items={items} />
          </LeftColumn>

          <RightColumn>
            <Calculator rates={rates} />

            <DominanceChart />
          </RightColumn>
        </Wrapper>
      </div>
    )
  }
}

const Wrapper = styled.div`
  max-width: 1400px;
  display: flex;
  margin: 0 auto;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  margin-top: 24px;
  margin-left: 16px;
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 775px;
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
        nameTrue
        priceUSD
        maxSupply
        totalSupply
        availableSupply
        priceUSD
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
