import React from 'react'
import { Subscription, graphql } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { getPortfolioQuery } from './api'
import { Props } from './interfaces'

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

const PortfolioComponent = (props: Props) => {
  const { data } = props
  const { getProfile } = data

  return (
    <Subscription subscription={PORTFOLIO_UPDATE} variables={{}}>
      {(data) => {
        return (
          <PortfolioContainer>
            <PortfolioSelector />
            <PortfolioTable data={getProfile} />
          </PortfolioContainer>
        )
      }}
    </Subscription>
  )
}

export default graphql(getPortfolioQuery)(PortfolioComponent)
