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