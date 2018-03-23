import React, { SFC } from 'react'
import styled from 'styled-components'

import { NavButton } from './NavButton'
import { Login } from '@containers/Login'

// TODO: fix z-index for drawer
const Nav = styled.div`
  width: 100%;
  display: flex;
  height: 80px;
  align-items: center;
  background-color: #2d3136;
`

const Logo = styled.img`
  margin: 25px 0 25px 32px;
  z-index: 1300;
  position: relative;
`

const SNav = styled.nav`
  display: flex;
  width: 60%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

export const NavBar: SFC<{}> = () => (
  <Nav>
    <Logo src="https://cdn.zeplin.io/5a9635a8ba64bb554c38ee24/assets/E47C7F75-58EF-4A5D-9F9C-8A43CCCDBF27.png" />
    <SNav>
      <NavButton link="/" title="Home" />
      <NavButton link="/market" title="Coin Market" />
      <NavButton link="/profile" title="Profile" />
      <NavButton link="/portfolio" title="Portfolio" />
      <NavButton link="/screener" title="Screener" />
      <NavButton link="/chart" title="Chart" />
    </SNav>
    <Login />
  </Nav>
)
