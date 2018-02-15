import { withFormik } from 'formik'
import React, { Component, Fragment, PropTypes } from 'react'
import styled from 'styled-components'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { NavBar } from '@components/NavBar'

import { withRouter } from 'react-router'

import Auth0Lock from 'auth0-lock'

const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const SLogin = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin-top: 20%;
`
const STextField = styled(TextField)`
  width: 300px;
`

const SButton = styled(Button)`
  margin-top: 30px;
`

export class Login extends Component {
  constructor (props) {
    super(props)

    this._lock = new Auth0Lock("0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm", "ccai.auth0.com")
  }

  createUser() {
    console.log(window.localStorage.getItem('auth0IdToken'));
    const variables = {
      idToken: window.localStorage.getItem('auth0IdToken'),
      emailAddress: this.state.emailAddress,
      name: this.state.name,
      emailSubscription: this.state.emailSubscription,
    }

    this.props.createUser({ variables })
      .then((response) => {
          console.log(response);
          this.props.router.replace('/')
      }).catch((e) => {
        console.error(e)
        this.props.router.replace('/')
      })
  }

  componentDidMount() {
    this._lock.on('authenticated', (authResult) => {
      console.log(authResult)
      window.localStorage.setItem('auth0IdToken', authResult.idToken)
      this.createUser();
      // this.props.history.push(`/profile`)
    })
  }

  _showLogin = () => {
    this._lock.show()
  }

  render() {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    // redirect if user is logged in
    if (this.props.data.user) {
      console.warn('already logged in')
      this.props.router.replace('/')
    }
    return (
      <Fragment>
        <NavBar />
        <SWrapper>

      <div>
          <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this._showLogin}>Log in</button>
      </div>
        </SWrapper>
      </Fragment>
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
  mutation ($idToken: String!, $name: String!, $emailAddress: String!, $emailSubscription: Boolean!){
    createUser(idToken: $idToken, name: $name, emailAddress: $emailAddress, emailSubscription: $emailSubscription) {
      id
    }
  }
`

export default graphql(createUser, {name: 'createUser'})(
  graphql(userQuery, { options: { forceFetch: true }})(withRouter(Login))
)