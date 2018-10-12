import gql from 'graphql-tag'

export const getCoinsForOptimization = gql`
  query getPortfolio {
    myPortfolios {
      name
      portfolioAssets(base: "USDT") {
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
    $riskProfile: String!
    $baseCurrency: String!
    $riskFree: Int!
		$initialCapital: Float!
    $coinList: [String!]
    $startDate: Int!
    $endDate: Int!
  ) {
    portfolioOptimization(
      period: $rebalancePeriod
      risk_profile: $riskProfile
      base_currency: $baseCurrency
      risk_free: $riskFree
      initial_capital: $initialCapital
      coinList: $coinList
      startDate: $startDate
      endDate: $endDate
    )
  }
`
