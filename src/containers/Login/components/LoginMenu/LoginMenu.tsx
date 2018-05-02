import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Button from 'material-ui/Button'
import Menu, { MenuItem } from 'material-ui/Menu'

export const LoginMenu = ({
  userName,
  anchorEl,
  open,
  handleClose,
  handleMenu,
  handleLogout,
}) => (
  <Fragment>
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={handleClose}
    >
      <MenuLink to="/portfolio">
        <MenuItem onClick={handleClose}>Portfolio</MenuItem>
      </MenuLink>
      <MenuLink to="/user">
        <MenuItem onClick={handleClose}>Settings</MenuItem>
      </MenuLink>
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
    <Button onClick={handleMenu}>{userName}</Button>
  </Fragment>
)

const MenuLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  border: none;

  &:hover {
    color: palevioletred;
  }
`
