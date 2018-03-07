import React from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { PortfolioTable, SelectAccount, NewSA, Drawer } from './components'

import * as API from './api'

const PortfolioContainer = styled.div`
  display: flex;
`

const GQLPortfolioTable = compose(graphql(API.getPortfolio))(PortfolioTable)

export const Portfolio = () => (
    <PortfolioContainer>
      <NewSA />
    {/* <SelectAccount /> */}
    <GQLPortfolioTable />
  </PortfolioContainer>
)
