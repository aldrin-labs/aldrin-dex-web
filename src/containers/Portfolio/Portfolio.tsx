import React from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { PortfolioTable, SelectAccount, NewSA, Drawer } from './components'

import getProfileQuery from '../../graphql/Account/getProfile.gql'

import * as API from './api'

const PortfolioContainer = styled.div`
  display: flex;
`

const GQLPortfolioTable = compose(graphql(API.getPortfolio))(PortfolioTable)

const Check = compose(
  graphql(getProfileQuery, {
    options: {
      variables: {
        withKeys: true,
        withPortfolio: false,
      },
    },
  })
)(NewSA)

export const Portfolio = () => (
  <PortfolioContainer>
    <Check />
    {/* <SelectAccount /> */}
    <GQLPortfolioTable />
  </PortfolioContainer>
)

