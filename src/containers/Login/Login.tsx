import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { NavBar } from '@components/NavBar'

import Auth0Lock from 'auth0-lock'

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
      login: false,
      user: null,
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
        this.setState(prevState => ({
          profile,
          login: !prevState.login,
        }))

        console.log(1111, this.state)
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
    const { login, profile } = this.state
    return (
      <SWrapper>
        {!login && <Button onClick={this._showLogin}>Log in</Button>}
        {login && <Button>{profile.name}</Button>}
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

export const LoginQuery = graphql(createUser, { name: 'createUser' })(Login)
