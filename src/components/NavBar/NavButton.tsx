import React, { SFC } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const NavLink = styled(Link)`
  width: 120px;
  text-decoration: none;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: center;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);

  &.selected {
    border-color: rgba(66, 66, 66, 0.2);
  }
`

interface INavButton {
  link: string
  title: string
}

export const NavButton: SFC<INavButton> = ({ link, title }) => (
  <NavLink to={link}>
    {title}
  </NavLink>
)
