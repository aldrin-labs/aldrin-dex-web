import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Auth0Lock from 'auth0-lock'
import { graphql } from 'react-apollo'
import jwtDecode from 'jwt-decode'

import Button from 'material-ui/Button'

import { withErrorFallback } from '@hoc/index'

import * as actions from './actions'
import * as API from './api'
import { LoginMenu } from './components'

const SWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

class LoginQuery extends Component {
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

  componentWillMount() {
    this.checkToken()
  }

  removeToken = () => {
    localStorage.removeItem('token')
  }

  getToken = () => {
    return localStorage.getItem('token')
  }

  checkToken = () => {
    if (this.getToken()) {
      const decodedToken = jwtDecode(this.getToken())
      const currentTime = Date.now() / 1000
      if (currentTime > decodedToken.exp) {
        this.props.storeLogout()
      }
    } else {
      this.props.storeLogout()
    }
  }

  setToken = (token: string) => {
    return localStorage.setItem('token', token)
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
      idToken: this.getToken(),
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
          return null
        }
        this.props.storeLogin(profile)
        // localStorage.setItem('token', authResult.idToken)
        this.setToken(authResult.idToken)
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
          <LoginMenu
            anchorEl={anchorEl}
            open={open}
            handleClose={this.handleClose}
            handleMenu={this.handleMenu}
            handleLogout={this.handleLogout}
            userName={user.name}
          />
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

export const Login = compose(
  withErrorFallback,
  connect(mapStateToProps, mapDispatchToProps),
  graphql(API.createUserMutation, { name: 'createUser' }),
)(LoginQuery)
