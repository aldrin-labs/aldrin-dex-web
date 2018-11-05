import React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import ExitIcon from '@material-ui/icons/ExitToApp'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Tooltip from '@material-ui/core/Tooltip'

const UserLink = (props) => <Link to="/user" {...props} />

export const LoginMenu = ({ userName, handleMenu, handleLogout }: any) => (
  <>
    <Tooltip title={userName} enterDelay={250}>
      <IconButton color="default" component={UserLink} className="UserLink">
        <AccountCircle />
      </IconButton>
    </Tooltip>
    <Tooltip title="Log out" enterDelay={500}>
      <IconButton color="default" onClick={handleLogout}>
        <ExitIcon />
      </IconButton>
    </Tooltip>
  </>
)
