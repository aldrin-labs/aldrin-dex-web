import React, { Component } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Auth0Lock from 'auth0-lock'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Menu, { MenuItem } from 'material-ui/Menu'

import { withErrorFallback } from '@hoc/index'

import * as actions from './actions'
import { gqlCreateUser } from './api'

const SLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  border-radius: 0px;

  &:hover {
    color: palevioletred;
  }
`

const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

class Login extends Component {
  constructor(props: any) {
    super(props)
    this.state = {
      anchorEl: null,
    }
    const auth0Options = {
      auth: {
        responseType: 'token id_token',
        redirectUri: 'localhost:3000/login',
        scope: 'openid',
        audience: 'localhost:5080',
      },
      autoclose: true,
      oidcConformant: true,
    }
    this.lock = new Auth0Lock('0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm', 'ccai.auth0.com', auth0Options)
  }

  handleMenu = (event: any) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleLogout = () => {
    this.props.storeLogout()
    window.localStorage.removeItem('token')
  }

  createUserReq = async (profile: any) => {
    const { createUser }: any = this.props

    const variables = {
      idToken: window.localStorage.getItem('token'),
      emailAddress: profile.email,
      name: profile.nickname,
      emailSubscription: true,
    }

    try {
      await createUser({ variables })
    } catch (error) {
      console.log(error)
    }
  }

  componentDidMount() {
    this.lock.on('authenticated', (authResult: any) => {
      this.lock.getUserInfo(authResult.accessToken, (error: any, profile: any) => {
        if (error) {
          console.log(error)
          return null
        }
        this.props.storeLogin(profile)
        localStorage.setItem('token', authResult.idToken)
        this.createUserReq(profile)
      })
    })
  }

  showLogin = () => {
    this.lock.show()
  }

  render() {
    const { loginStatus, user }: any = this.props
    const { anchorEl }: any = this.state
    const open = Boolean(anchorEl)
    return (
      <SWrapper>
        {!loginStatus && <Button onClick={this.showLogin}>Log in</Button>}
        {loginStatus && (
          <div>
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
              onClose={this.handleClose}
            >
              <SLink to="/portfolio">
                <MenuItem onClick={this.handleClose}>Portfolio</MenuItem>
              </SLink>
              <SLink to="/settings">
                <MenuItem onClick={this.handleClose}>Settings</MenuItem>
              </SLink>
              <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
            </Menu>
            <Button onClick={this.handleMenu}>{user.name}</Button>
          </div>
        )}
      </SWrapper>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.login.user,
  loginStatus: state.login.loginStatus,
})

const mapDispatchToProps = (dispatch: any) => ({
  storeLogin: (profile: any) => dispatch(actions.storeLogin(profile)),
  storeLogout: () => dispatch(actions.storeLogout()),
})

export const LoginQuery = compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(gqlCreateUser, { name: 'createUser' }),
  withErrorFallback
)(Login)
