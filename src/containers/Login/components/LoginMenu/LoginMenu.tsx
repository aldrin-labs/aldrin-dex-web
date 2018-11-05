import React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import ExitIcon from '@material-ui/icons/ExitToApp'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Tooltip from '@material-ui/core/Tooltip'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

import * as userActions from '@containers/User/actions'


const UserLink = (props) => <Link to="/user" {...props} />

const LoginMenuComponent = ({ userName, handleMenu, handleLogout, showToolTip }: any) => (
  <>
    <Button
      className="TipButton"
      onClick={showToolTip}
      size="small"
      style={{ margin: '0.5rem 1rem' }}
    >
      Show tips
    </Button>
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

const mapDispatchToProps = (dispatch: any) => ({
  showToolTip: () => dispatch(userActions.showToolTip()),
})

export const LoginMenu = connect(null, mapDispatchToProps)(LoginMenuComponent)
