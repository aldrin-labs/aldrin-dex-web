import gql from 'graphql-tag'

export const getPortfolio = gql`
  query gerPortfolio {
    getProfile {
      username
      portfolioId
      keys {
        _id
        name
        apiKey
        secret
        date
        exchange {
          name
          symbol
        }
      }
      portfolio {
        nameTrue
        nameFalse
        totalShares
        BTCProfitLoss
        USDProfitLoss
        twentyFourHourChange
        priceUSD
        currentUSD
        currentBTC
        currentTwentyFourHours
        assets {
        value
        realizedProfit
        possibleProfit
        asset {
          name
          symbol
          totalSupply
          maxSupply
          nameTrue
          nameFalse
          priceUSD
          percentChangeDay
        }
        exchange {
          name
          symbol
        }
        key {
          name
        }
        totalShares
        BTCProfitLoss
        USDProfitLoss
        twentyFourHourChange
        priceUSD
        currentBTC
        currentUSD
      }
      }
    }
  }
`
