import { withFormik } from 'formik'
import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'

import { NavBar } from '@components/NavBar'

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
  state = {
    email: '',
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  render() {
    return (
      <Fragment>
        <NavBar />
        <SWrapper>
          <SLogin noValidate autoComplete="off">
            <STextField
              id="name"
              label="Name"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
            />
            <STextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
            />
            <SButton raised color="primary">
              Login
            </SButton>
          </SLogin>
        </SWrapper>
      </Fragment>
    )
  }
}
