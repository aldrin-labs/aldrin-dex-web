import React from 'react'
import styled from 'styled-components'

import { PortfolioTable, SelectAccount,PortfolioTableHead} from './components'

const PortfolioContainer = styled.div`
  display:flex;
  height:90vh;
`

export const Portfolio = () => (
    <PortfolioContainer>
     <SelectAccount /> 
    
    <PortfolioTable />
  </PortfolioContainer>
)

