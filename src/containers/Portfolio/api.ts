import gql from 'graphql-tag'

import { KeyFragment, cryptoWalletFragment } from '@graphql/fragments'

const cryptoWalletFragmentWithAssets = gql`
  fragment cryptoWalletFragmentWithAssets on CryptoWallet {
    ...cryptoWalletFragment
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
  }
  ${cryptoWalletFragment}
`

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
        ...KeyFragment
      }
    }
  }
  ${KeyFragment}
`

export const getPortfolioQuery = gql`
  query getPortfolio {
    getProfile {
      portfolio {
        cryptoWallets {
          ...cryptoWalletFragmentWithAssets
        }
        assetIds
        ownerId
        portfolioPerformance {
          coin
          btc
          usd
        }
        assets {
          quantity
          asset {
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
  ${cryptoWalletFragmentWithAssets}
`
export const getPortfolioMainQuery = gql`
  query getPortfolio {
    getProfile {
      portfolioId
      portfolio {
        name
        processing
        cryptoWallets {
          ...cryptoWalletFragmentWithAssets
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
  ${cryptoWalletFragmentWithAssets}
`
