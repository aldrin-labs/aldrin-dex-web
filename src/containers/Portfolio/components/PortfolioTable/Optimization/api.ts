import gql from 'graphql-tag'

export const getCoinsForOptimization = gql`
  query getPortfolio($baseCoin: String!) {
    myPortfolios {
      name
      portfolioAssets(base: $baseCoin) {
        _id
        coin
        name
        where
        price
        quantity
        realized
        unrealized
      }
    }
  }
`
export const OPTIMIZE_PORTFOLIO = gql`
  query getPortfolio(
    $rebalancePeriod: Int!
    $baseCurrency: String!
    $riskFree: Int!
		$initialCapital: Float!
    $coinList: [String!]
    $startDate: Int!
    $endDate: Int!
  ) {
    portfolioOptimization(
      period: $rebalancePeriod
      base_currency: $baseCurrency
      risk_free: $riskFree
      initial_capital: $initialCapital
      coinList: $coinList
      startDate: $startDate
      endDate: $endDate
    )
  }
`
