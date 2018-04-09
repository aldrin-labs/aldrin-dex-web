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
        btcRealizedProfit
        btcUnrealizedProfit
        usdRealizedProfit
        usdUnrealizedProfit
        totalProfit
        asset {
          name
          symbol
          priceUSD
          percentChangeDay
          industry
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
  max-height: calc(100vh - 80px);
`

class PortfolioComponent extends React.Component<Props> {
  state = {
    checkboxes: null,
  }

  onChangeActiveKey = (checkboxes: number[]) => {
    this.setState({ checkboxes })
  }

  render() {
    const { checkboxes } = this.state
    const { data } = this.props
    const { getProfile } = data

    return (
      <Subscription subscription={PORTFOLIO_UPDATE}>
        {(subscriptionData) => {
          return (
            <PortfolioContainer>
              <PortfolioSelector onChangeActive={this.onChangeActiveKey} />
              <PortfolioTable
                checkboxes={checkboxes}
                data={getProfile}
                subscription={subscriptionData}
              />
            </PortfolioContainer>
          )
        }}
      </Subscription>
    )
  }
}

export default graphql(getPortfolioQuery)(PortfolioComponent)
