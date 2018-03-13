import React from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { withRouter } from 'react-router'

import { PortfolioTable, SelectAccount, NewSA, Drawer } from './components'
import { withAuth } from '@hoc'
import getProfileQuery from '../../graphql/Account/getProfileQuery.gql'

import * as API from './api'

const PortfolioContainer = styled.div`
  display: flex;
`

const GQLPortfolioTable = compose(withRouter, withAuth, graphql(API.getPortfolio))(PortfolioTable)

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
