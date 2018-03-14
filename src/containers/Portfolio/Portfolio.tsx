import React from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { withRouter } from 'react-router'

import { PortfolioTable, PortfolioSelector } from './components'

const PortfolioContainer = styled.div`
  display: flex;
`

export const Portfolio = () => (
  <PortfolioContainer>
    <PortfolioSelector />
    <PortfolioTable />
  </PortfolioContainer>
)
