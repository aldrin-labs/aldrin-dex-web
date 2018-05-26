import React, { SFC } from 'react'
import styled from 'styled-components'

import { NavButtonMobile } from './NavButtonMobile'

export const NavBarMobile: SFC<{}> = () => (
  <NavMobileContainer>
    <NavButtonsContainer>
      <NavButtonMobile link="/" title="Home" exact />
      <NavButtonMobile link="/market" title="Coin Market" />
      <NavButtonMobile link="/profile" title="Profile" />
      <NavButtonMobile link="/portfolio" title="Portfolio" />
      <NavButtonMobile link="/screener" title="Screener" />
      <NavButtonMobile link="/chart" title="Chart" />
    </NavButtonsContainer>
  </NavMobileContainer>
)

const NavMobileContainer = styled.div`
  width: 100%;
  height: 80px;
  display: none;
  align-items: center;
  background-color: #2d3136;
  z-index: 1;

  @media (max-width: 840px) {
    display: flex;
    justify-content: center;
  }
`

const NavButtonsContainer = styled.nav`
  width: 100%;
  display: flex;
  margin: 0 10px;
  padding: 10px;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 840px) {
    margin: 0 !important;
  }
`
