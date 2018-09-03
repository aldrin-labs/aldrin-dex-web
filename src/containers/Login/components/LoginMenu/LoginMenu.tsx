import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import { MdAccountBox, MdExitToApp } from 'react-icons/lib/md'

const UserLink = (props) => <Link to="/user" {...props} />

export const LoginMenu = ({
  userName,
  anchorEl,
  open,
  handleClose,
  handleMenu,
  handleLogout,
}) => (
  <>
    <IconButton color="secondary" component={UserLink}>
      <MdAccountBox />
    </IconButton>
    <IconButton color="primary" onClick={handleLogout}>
      <MdExitToApp />
    </IconButton>
  </>
)
