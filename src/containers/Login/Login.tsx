import { withFormik } from 'formik'
import React, { Component, Fragment, PropTypes } from 'react'
import styled from 'styled-components'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'

import { NavBar } from '@components/NavBar'

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


  componentDidMount() {
    this._lock.on('authenticated', (authResult) => {
      console.log(authResult)
      window.localStorage.setItem('auth0IdToken', authResult.idToken)
      this.props.history.push(`/signup`)
    })
  }

  _showLogin = () => {
    this._lock.show()
  }

  render() {
    return (
      <Fragment>
        <NavBar />
        <SWrapper>

      <div>
        <span
          onClick={this._showLogin}
          className='dib pa3 white bg-blue dim pointer'
        >
          Log in with Auth0
        </span>
      </div>
        </SWrapper>
      </Fragment>
    )
  }
}
