import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Auth0Lock from 'auth0-lock'
import { graphql } from 'react-apollo'
import jwtDecode from 'jwt-decode'
import Button from '@material-ui/core/Button'

import { withErrorFallback } from '../../hoc'
import { Props, State } from '@containers/Login/interfaces'
import * as actions from '@containers/Login/actions'
import * as API from '@containers/Login/api'
import { LoginMenu } from '@containers/Login/components'

const SWrapper = styled.div`
  z-index: 100000;
  align-items: center;
  display: flex;
  width: 100%;
  justify-content: space-between;
`

class LoginQuery extends React.Component<Props, State> {
  lock: Auth0LockStatic

  constructor(props: Props) {
    super(props)
    this.state = {
      anchorEl: null,
    }
    const auth0Options = {
      theme: {
        logo:
          'https://cdn.zeplin.io/5a9635a8ba64bb554c38ee24/assets/E47C7F75-58EF-4A5D-9F9C-8A43CCCDBF27.png',
        primaryColor: '#4ed8da',
      },
      languageDictionary: {
        title: 'Join CCAI',
      },
      auth: {
        responseType: 'token id_token',
        redirectUri: 'localhost:3000/login',
        scope: 'openid',
        audience: 'localhost:5080',
      },
      autoclose: true,
      oidcConformant: true,
    }
    this.lock = new Auth0Lock(
      '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm',
      'ccai.auth0.com',
      auth0Options
    )
  }

  componentWillMount() {
    this.checkToken()
  }

  componentDidMount() {
    this.lock.on('authenticated', (authResult: any) => {
      this.lock.getUserInfo(
        authResult.accessToken,
        (error: Error, profile: any) => {
          if (error) {
            console.error(error)
          }
          this.props.storeLogin(profile)
          // localStorage.setItem('token', authResult.idToken)
          this.setToken(authResult.idToken)
          this.createUserReq(profile)
        }
      )
    })

    if (this.props.isShownModal) this.lock.show()
  }

  removeToken = () => {
    localStorage.removeItem('token')
  }

  getToken = () => {
    return localStorage.getItem('token')
  }

  checkToken = () => {
    const token = this.getToken()
    if (token) {
      const decodedToken: { exp: number } = jwtDecode(token)
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

  handleMenu = (event: Event) => {
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
    const { createUser } = this.props

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

  showLogin = () => {
    this.lock.show()
  }

  render() {
    const { loginStatus, user, isShownModal } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    if (isShownModal) return null

    // TODO: change width on Button when resolution width < 340px

    return (
      <SWrapper>
        {!loginStatus && (
          <Button
            color="secondary"
            variant="contained"
            onClick={this.showLogin}
          >
            Log in
          </Button>
        )}
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(API.createUserMutation, { name: 'createUser' })
)(LoginQuery)
