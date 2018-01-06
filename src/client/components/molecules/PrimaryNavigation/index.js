import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { palette } from 'styled-theme'

import Link from 'components/atoms/Link'

const Nav = styled.nav`
  display: flex;
  list-style: none;
  > :not(:first-child) {
    margin-left: 1rem;
  }
  a {
    font-weight: 300;
    color: ${palette('grayscale', 2)};
    font-size: 1.25rem;
    &.active {
      color: ${palette('grayscale', 0)};
    }
  }
`

const PrimaryNavigation = props => (
  <Nav {...props}>
    <li>
      <Link to="/" exact activeClassName="active">
        Home
      </Link>
    </li>
    <li>
      <Link to="/login" activeClassName="active">
        Login
      </Link>
    </li>
    <li>
      <Link to="/chart" activeClassName="active">
        Chart
      </Link>
    </li>
    {/*<li>*/}
      {/*<Link to="/coinmarketcap" activeClassName="active">*/}
        {/*Coin Market*/}
      {/*</Link>*/}
    {/*</li>*/}
    {/*<li>*/}
      {/*<Link to="/about" activeClassName="active">*/}
        {/*About*/}
      {/*</Link>*/}
    {/*</li>*/}
  </Nav>
)

PrimaryNavigation.propTypes = {
  reverse: PropTypes.bool,
}

export default PrimaryNavigation
