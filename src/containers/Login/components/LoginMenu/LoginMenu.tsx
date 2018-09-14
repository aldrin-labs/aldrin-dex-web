import React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import ExitIcon from '@material-ui/icons/ExitToApp'
import AccountCircle from '@material-ui/icons/AccountCircle'

const UserLink = (props) => <Link to="/user" {...props} />

export const LoginMenu = ({
  // userName,

  handleMenu,
  handleLogout,
}: any) => (
  <>
    <IconButton color="secondary" component={UserLink}>
      <AccountCircle />
    </IconButton>
    <IconButton color="primary" onClick={handleLogout}>
      <ExitIcon />
    </IconButton>
  </>
)
