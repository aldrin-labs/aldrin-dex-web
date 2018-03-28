import React from 'react'
import { Subscription, graphql } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'

import { PortfolioTable, PortfolioSelector } from './components'

const PORTFOLIO_UPDATE = gql`
  subscription onPortfolioUpdated {
    portfolioUpdated {
      name
    }
  }
`

const PortfolioContainer = styled.div`
  display: flex;
`

const PortfolioComponent = (props) => {
  console.log(props)
  return (
    <Subscription subscription={PORTFOLIO_UPDATE} variables={{}}>
      {(data) => {
        return (
          <PortfolioContainer>
            <PortfolioSelector />
            <PortfolioTable />
          </PortfolioContainer>
        )
      }}
    </Subscription>
  )
}

const PortfolioQuery = gql`
  query getProfile {
    getProfile {
      username
      imageUrl
      email
      portfolio {
        name
        assets {
          value
          asset {
            name
          }
        }
      }
    }
  }
`

export default graphql(PortfolioQuery)(PortfolioComponent)
