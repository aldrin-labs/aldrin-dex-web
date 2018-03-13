import React, { Component } from 'react'
import jwtDecode from 'jwt-decode'
import {
  compose,
  withState,
  branch,
  mapProps,
  renderComponent,
  setDisplayName,
  lifecycle,
} from 'recompose'
import { connect } from 'react-redux'
import { storeLogout } from '@common/actions/auth'

export const withAuth = compose(
  connect(state => ({
    loginStatus: state.login.loginStatus,
    user: state.login.user,
  })),
  setDisplayName('AuthCheck'),
  withState('authStatus', 'setAuthStatus', false),
  lifecycle({
    componentDidMount() {
      console.log('AUTH', this.props)
      const token = localStorage.getItem('token')
      if (token) {
        const decodedToken: string = jwtDecode(token)
        const currentTime: number = Date.now() / 1000

        if (currentTime > decodedToken.exp) {
          // this.props.dispatch('STORE_LOGOUT')
          localStorage.removeItem('token')
          // this.pr
        } else {
          this.props.setAuthStatus(true)
        }
      }

      if (this.props.loginStatus && !token) {
        console.log(111111111)
        console.log('check', token)
        // this.props.dispatch('STORE_LOGOUT')
      }
    },
  })
)
