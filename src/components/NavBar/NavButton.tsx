import Button from 'material-ui/Button'
import React, { SFC } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const NavLink = styled(Link)`
  color: inherit;
  margin: 3px;
  padding: 3px 7px;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 3px;

  &.selected {
    border-color: rgba(66, 66, 66, 0.2);
  }
`

interface INavButton {
  link: string
  title: string
}

export const NavButton: SFC<INavButton> = ({ link, title }) => (
  <Button>
    <NavLink to={link}>{title}</NavLink>
  </Button>
)
