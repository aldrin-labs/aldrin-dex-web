import gql from 'graphql-tag'
import * as React from 'react'
import { graphql } from 'react-apollo'
import styled from 'styled-components'
import { History } from 'history'
import Button from '../../components/Elements/Button/Button'
import Calculator from '../../components/Calculator/Calculator'
import DominanceChart from '../../components/DominanceChart/DominanceChart'
import CoinMarketTable from '../../components/CoinMarketTable/CoinMarketTable'
import { CoinMarketCapQueryQuery } from './annotations'
import { Loading } from '@components/Loading'

interface Props {
  data: CoinMarketCapQueryQuery
  history: History
  location: Location
}

interface State {
  activeSortArg: number | null
}

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

class CoinMarket extends React.Component<Props, State> {
  state: State = {
    activeSortArg: null,
  }

  redirectToProfile = (_id: string) => {
    const { history } = this.props

    history.push(`/profile/${_id}`)
  }

  onChangeSortArg = (index: number, sortArg: string) => {
    const { history, location } = this.props
    if (!location) return

    const query = new URLSearchParams(location.search)
    if (query.has('sort')) {
      query.set('sort', sortArg)
    } else {
      query.append('sort', sortArg)
    }

    history.push({ pathname: location.pathname, search: query.toString() })

    this.setState({ activeSortArg: index })
  }

  incrementPage = () => {
    const { data, history, location } = this.props
    const { assetPagination } = data
    if (!assetPagination) return
    const { pageInfo } = assetPagination
    const { currentPage, hasNextPage } = pageInfo

    if (hasNextPage) {
      const query = new URLSearchParams(location.search)
      if (query.has('page')) {
        query.set('page', `${currentPage + 1}`)
      } else {
        query.append('page', `${currentPage + 1}`)
      }
      history.push({ pathname: location.pathname, search: query.toString() })
    }
  }

  decrementPage = () => {
    const { data, history, location } = this.props
    const { assetPagination } = data
    if (!assetPagination) return
    const { pageInfo } = assetPagination
    const { currentPage, hasPreviousPage } = pageInfo

    if (hasPreviousPage) {
      const query = new URLSearchParams(location.search)
      if (query.has('page')) {
        query.set('page', `${currentPage - 1}`)
      } else {
        query.append('page', `${currentPage - 1}`)
      }
      history.push({ pathname: location.pathname, search: query.toString() })
    }
  }

  render() {
    const { activeSortArg } = this.state
    const { data } = this.props
    if (data.loading || !data.assetPagination) {
      return <Loading centerAligned />
    }
    const { assetPagination } = data
    const { items } = assetPagination

    return (
      <Wrapper>
        <LeftColumn>
          <CoinMarketTable location={this.props.location} />

          <Pagination>
            <Button title="Previous" onClick={this.decrementPage} />
            <Button title="View all coins" />
            <Button title="Next" onClick={this.incrementPage} />
          </Pagination>
        </LeftColumn>

        <RightColumn>
          <Calculator rates={rates} />

          <DominanceChart />
        </RightColumn>
      </Wrapper>
    )
  }
}

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

const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 16px;
`

const Wrapper = styled.div`
  max-width: 1400px;
  display: flex;
  margin: 0 auto;
`

export const CoinMarketCapQuery = gql`
  query CoinMarketCapQuery($page: Int, $perPage: Int) {
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

export const CoinMarketCap = graphql(CoinMarketCapQuery, { options })(
  CoinMarket
)

export default CoinMarketCap
