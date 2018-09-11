import gql from 'graphql-tag'

export const CORRELATION_UPDATE = gql`
  subscription onCorrelationUpdated {
    matrix
  }
`

export const getCorrelationQuery = gql`
  query getPortfolio($startDate: Int!, $endDate: Int!) {
    correlationMatrixByDay(startDate: $startDate, endDate: $endDate)
  }
`

export const getKeysQuery = gql`
  query getKeys {
    getProfile {
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
    }
  }
`

export const getWalletsQuery = gql`
  query getWallets {
    getProfile {
      cryptoWallets {
        _id
        name
      }
    }
  }
`

export const getPortfolioQuery = gql`
  query getPortfolio {
    getProfile {
      portfolioId
      portfolio {
        name
        processing
        cryptoWallets {
          _id
          name
          address
          baseAssetId
          baseAsset {
            _id
            symbol
            name
          }
          assetIds
          assets {
            balance
            assetId
            asset {
              name
              symbol
              priceUSD
              priceBTC
            }
          }
          ownerId
          owner {
            _id
            username
          }
        }
        assetIds
        ownerId
        coinPerformance {
          coin
          btc
          usd
        }
        assets {
          _id
          assetId
          exchangeId
          keyId
          quantity
          asset {
            _id
            name
            symbol
            priceUSD
            priceBTC
            industry {
              name
              performance {
                usdWeek
                usdMonth
                usd3Months
                usdYear
                btcWeek
                btcMonth
                btc3Months
                btcYear
              }
            }
          }
          exchange {
            name
          }
          key {
            name
            apiKey
          }
        }
      }
    }
  }
`
export const getPortfolioMainQuery = gql`
  query getPortfolio {
    getProfile {
      portfolioId
      portfolio {
        name
        processing
        cryptoWallets {
          _id
          name
          address
          baseAssetId
          baseAsset {
            _id
            symbol
            name
          }
          assetIds
          assets {
            balance
            assetId
            asset {
              name
              symbol
              priceUSD
              priceBTC
            }
          }
          ownerId
          owner {
            _id
            username
          }
        }
        assetIds
        ownerId
        assets {
          _id
          assetId
          exchangeId
          keyId
          quantity
          asset {
            _id
            name
            symbol
            priceUSD
            priceBTC
          }
          PL {
            base
            quote
            price
            basePriceUSD
            basePriceBTC
            realized
            averageBuyPrice
            totalBuyQty
            totalSellQty
          }
          exchange {
            name
          }
          key {
            name
            apiKey
          }
        }
      }
    }
  }
`
