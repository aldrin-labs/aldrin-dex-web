import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Menu, { MenuItem } from 'material-ui/Menu'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { NavBar } from '@components/NavBar'

import * as actions from './actions'

import Auth0Lock from 'auth0-lock'
import { withErrorFallback } from '@hoc';

const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

class Login extends Component {
  constructor(props) {
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
    this._lock = new Auth0Lock('0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm', 'ccai.auth0.com', auth0Options)
  }

  handleMenu = (event: any) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleLogout = () => {
    this.props.storeLogout()
  }

  createUser(profile) {
    // console.log(9999, window.localStorage.getItem('token'))
    const variables = {
      idToken: window.localStorage.getItem('token'),
      emailAddress: profile.email,
      name: profile.nickname,
      emailSubscription: true, // ;)
    }
    // console.log(variables)
    this.props
      .createUser({ variables })
      .then(response => {
        // console.log(response)
        this.props.router.replace('/')
      })
      .catch(e => {
        // console.error(e)
        this.props.router.replace('/')
      })
  }

  componentDidMount() {
    this._lock.on('authenticated', authResult => {
      this._lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          console.log(error)
          // Handle error
          return
        }
        // this.setState(prevState => ({
        //   profile,
        //   login: !prevState.login,
        // }))
        this.props.storeLogin(profile)
        console.log(1111, this.state, this.props)
        localStorage.setItem('token', authResult.idToken)
        this.createUser(profile)
      })
    })
  }

  _showLogin = () => {
    this._lock.show()
  }

  render() {
    // if (this.props.data.loading) {
    //   return (<div>Loading</div>)
    // }

    // // redirect if user is logged in
    // if (this.props.data.user) {
    //   console.warn('already logged in')
    //   this.props.router.replace('/')
    // }
    const { loginStatus, user } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    return (
      <SWrapper>
        {!loginStatus && <Button onClick={this._showLogin}>Log in</Button>}
        {loginStatus && <div><Menu
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
                  <MenuItem onClick={this.handleClose}>Portfolio</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
                </Menu><Button onClick={this.handleMenu}>{user.name}</Button></div>}
      </SWrapper>
    )
  }
}

const userQuery = gql`
  query {
    user {
      id
    }
  }
`

const createUser = gql`
  mutation(
    $idToken: String!
    $name: String!
    $emailAddress: String!
    $emailSubscription: Boolean!
  ) {
    createUser(
      idToken: $idToken
      name: $name
      emailAddress: $emailAddress
      emailSubscription: $emailSubscription
    ) {
      _id
    }
  }
`

const mapStateToProps = (state: any) => ({
  user: state.login.user,
  loginStatus: state.login.loginStatus
})

const mapDispatchToProps = (dispatch: any) => ({
  storeLogin: (profile) => dispatch(actions.storeLogin(profile)),
  storeLogout: () => dispatch(actions.storeLogout())
})

export const LoginQuery = compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(createUser, { name: 'createUser' }),
  withErrorFallback
)(Login)

// export const LoginQuery = graphql(createUser, { name: 'createUser' })(Login)
