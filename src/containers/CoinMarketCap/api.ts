import gql from 'graphql-tag'

export const getCoinMarketCapQuery = gql`
  query getCoinMarketCapQuery(
    $page: Int,
    $perPage: Int
  ) {
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
      }
    }
  }
`

export const MarketsQuery = gql`
  query MarketsQuery {
     markets {
      id
      name
      symbol
      rank
      price_usd
      price_btc
      volume_usd_24h
      market_cap_usd
      available_supply
      total_supply
      max_supply
      percent_change_1h
      percent_change_24h
      percent_change_7d
    }
  }
`