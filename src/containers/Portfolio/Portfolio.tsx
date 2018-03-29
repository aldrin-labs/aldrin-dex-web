import React from 'react'
import { Subscription, graphql } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { getPortfolioQuery } from './api'
import { Props } from './interfaces'
import PortfolioSelector from '@containers/Portfolio/components/PortfolioSelector/PortfolioSelector'

import { PortfolioTable } from './components'

const PORTFOLIO_UPDATE = gql`
  subscription onPortfolioUpdated {
    portfolioUpdated {
      name
      processing
      assetIds
      assets {
        _id
        assetId
        exchangeId
        keyId
        value
        realizedProfit
        unrealizedProfit
        totalProfit
        asset {
          name
          symbol
          priceUSD
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
`

const PortfolioContainer = styled.div`
  display: flex;
`

const PortfolioComponent = (props: Props) => {
  const { data } = props
  const { getProfile } = data

  return (
    <Subscription subscription={PORTFOLIO_UPDATE} variables={{}}>
      {(subscriptionData) => {
        return (
          <PortfolioContainer>
            <PortfolioSelector />
            <PortfolioTable data={getProfile} subscription={subscriptionData} />
          </PortfolioContainer>
        )
      }}
    </Subscription>
  )
}

export default graphql(getPortfolioQuery)(PortfolioComponent)
