import React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import ExitIcon from '@material-ui/icons/ExitToApp'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Tooltip from '@material-ui/core/Tooltip'

const UserLink = (props) => <Link to="/user" {...props} />

export const LoginMenu = ({ userName, handleMenu, handleLogout }: any) => (
  <>
    <Tooltip title={userName}>
      <IconButton color="secondary" component={UserLink}>
        <AccountCircle />
      </IconButton>
    </Tooltip>
    <Tooltip title="Exit">
      <IconButton color="secondary" onClick={handleLogout}>
        <ExitIcon />
      </IconButton>
    </Tooltip>
  </>
)
