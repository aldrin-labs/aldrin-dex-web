import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import jwtDecode from 'jwt-decode'
import Button from '@material-ui/core/Button'

import { withErrorFallback } from '../../hoc'
import { Props, State } from '@containers/Login/interfaces'
import * as actions from '@containers/Login/actions'
import * as API from '@containers/Login/api'
import * as CLIENT_API_MUTATIONS from '@core/graphql/mutations/login/index'
import { GET_LOGIN_DATA } from '@core/graphql/queries/login/GET_LOGIN_DATA'
import { LoginMenu } from '@containers/Login/components'
import MainLogo from '@icons/AuthLogo.png'
import { Grow, Slide } from '@material-ui/core'
import { MASTER_BUILD } from '@utils/config'
import { client } from '@core/graphql/apolloClient'
import { persistor } from '@utils/persistConfig'

const auth0Options = {
  auth: {
    responseType: 'token id_token',
    redirectUri: 'localhost:3000/login',
    scope: 'openid',
    audience: 'localhost:5080',
  },
  theme: {
    logo: MainLogo,
    primaryColor: '#4ed8da',
  },
  languageDictionary: {
    title: 'Be an early adopter',
  },
  autofocus: true,
  autoclose: true,
  oidcConformant: true,
}

const SWrapper = styled.div`
  z-index: 100000;
  padding: 0 1rem;
  align-items: center;
  display: flex;
  justify-content: flex-end;
`

class LoginQuery extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      anchorEl: null,
      lock: null,
    }
  }

  static getDerivedStateFromProps(props: Props) {
    auth0Options.theme.primaryColor = props.mainColor
    return {
      lock: new Auth0Lock(
        '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm',
        'ccai.auth0.com',
        auth0Options
      ),
    }
  }

  componentDidMount() {
    if (this.props.isShownModal) this.showLogin()
    this.checkToken()
    this.onListenersChanges(true)
    this.setLockListeners()
    if (this.props.loginDataQuery.login.loginStatus)
      this.addFSIdentify(this.props.loginDataQuery.login.user)
  }

  addFSIdentify(profile) {
    if (MASTER_BUILD && window.FS && window.FS.identify) {
      return window.FS.identify(profile.email, {
        displayName: profile.email,
        email: profile.email,
      })
    }
  }

  setLockListeners = () => {
    this.state.lock.on('authenticated', (authResult: any) => {
      this.onLoginProcessChanges(true)
      this.state.lock.getUserInfo(
        authResult.accessToken,
        async (error: Error, profile: any) => {
          if (error) {
            console.error(error)
          }
          await this.resumeApollo()
          await this.createUserReq(profile)
          await this.setToken(authResult.idToken)
          this.onLogin(profile)
          this.addFSIdentify(profile)
        }
      )
    })
    this.state.lock.on('hide', () => {
      this.onModalProcessChanges(true)
      this.onListenersChanges(false)
      setTimeout(() => this.onModalChanges(false), 1000)
    })
  }

  removeToken = () => {
    localStorage.removeItem('token')
  }

  getToken = () => {
    return localStorage.getItem('token')
  }

  checkToken = () => {
    if (this.props.loginDataQuery.login.loginStatus) {
      const token = this.getToken()
      if (token) {
        const decodedToken: { exp: number } = jwtDecode(token)
        const currentTime = Date.now() / 1000
        if (currentTime > decodedToken.exp) {
          this.onLogout()
          this.cleanApollo()
        }
      } else {
        this.onLogout()
        this.cleanApollo()
      }
    }
  }

  cleanApollo = () => {
    // User clicks 'log out'.
    // First: do whatever is necessary in your app to invalidate/clear out the user's session.
    // Then do the following:

    persistor.pause() // Pause automatic persistence.
    persistor.purge() // Delete everything in the storage provider.

    // If there are views visible that contain data from the logged-out user,
    // this will cause them to clear out. It also issues a bunch of network requests
    // for data that likely won't be available anymore since the user is logged-out,
    // so you may consider skipping this.
    client.resetStore()
  }

  resumeApollo = () => {

    // Let's assume the user logs in.
    // First: do whatever is necessary to set the user's session.
    // Next: you absolutely must reset the store. This will clear the prior user's data from
    // memory and will cause all of the open queries to refetch using the new user's session.
    client.resetStore()

    // Resume cache persistence. The cache storage provider will be empty right now,
    // but it will written with the new user's data the next time the trigger fires.
    persistor.resume()
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
    this.onLogout()
    this.cleanApollo()
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
  onLogin = async (profile: any) => {
    const { loginMutation } = this.props
    const variables = {
      profile,
    }
    console.log('profile', profile);

    try {
      await loginMutation({ variables })
    } catch (error) {
      console.log(error)
    }
  }
  onLogout = async () => {
    const { logoutMutation } = this.props

    try {
      await logoutMutation()
    } catch (error) {
      console.log(error)
    }
  }

  onModalChanges = async (modalIsOpen: boolean) => {
    const { modalStatusMutation } = this.props
    const variables = {
      modalIsOpen,
    }

    try {
      await modalStatusMutation({ variables })
    } catch (error) {
      console.log(error)
    }
  }

  onListenersChanges = async (listenersStatus: boolean) => {
    const { listenersStatusMutation } = this.props
    const variables = {
      listenersStatus,
    }

    try {
      await listenersStatusMutation({ variables })
    } catch (error) {
      console.log(error)
    }
  }

  onModalProcessChanges = async (modalLogging: boolean) => {
    const { modalProcessMutation } = this.props
    const variables = {
      modalLogging,
    }

    try {
      await modalProcessMutation({ variables })
    } catch (error) {
      console.log(error)
    }
  }

  onLoginProcessChanges = async (isLogging: boolean) => {
    const { loginProcessMutation } = this.props
    const variables = {
      isLogging,
    }

    try {
      await loginProcessMutation({ variables })
    } catch (error) {
      console.log(error)
    }
  }

  showLogin = () => {
    const isLoginPopUpClosed =
      !this.props.loginDataQuery.login.modalIsOpen &&
      !this.props.loginDataQuery.login.isLogging &&
      !this.props.loginDataQuery.login.modalLogging

    if (isLoginPopUpClosed) {
      this.onModalChanges(true)
      this.state.lock.show()
      if (this.props.loginDataQuery.login.listenersOff) {
        this.setLockListeners()
      }
    }
  }

  render() {
    const { loginDataQuery, isShownModal } = this.props
    const { loginStatus, user } = loginDataQuery.login
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    console.log('props', this.props);
    console.log('loginDataQuery', loginDataQuery);

    if (isShownModal) return null

    return (
      <SWrapper className="LoginButton">
        <Grow in={!loginStatus} unmountOnExit={true} mountOnEnter={true}>
          <Button
            color="secondary"
            variant="contained"
            onClick={this.showLogin}
            className="loginButton"
          >
            Log in / Sign Up
          </Button>
        </Grow>
        <Slide
          in={loginStatus}
          direction={'left'}
          unmountOnExit={true}
          mountOnEnter={true}
        >
          <LoginMenu
            anchorEl={anchorEl}
            open={open}
            handleClose={this.handleClose}
            handleMenu={this.handleMenu}
            handleLogout={this.handleLogout}
            userName={user && user.name}
          />
        </Slide>
      </SWrapper>
    )
  }
}

export const Login = compose(
  withErrorFallback,
  graphql(API.createUserMutation, { name: 'createUser' }),
  graphql(GET_LOGIN_DATA, { name: 'loginDataQuery' }),
  graphql(CLIENT_API_MUTATIONS.LOGIN, { name: 'loginMutation' }),
  graphql(CLIENT_API_MUTATIONS.LOGOUT, { name: 'logoutMutation' }),
  graphql(CLIENT_API_MUTATIONS.UPDATE_MODAL_STATUS, {
    name: 'modalStatusMutation',
  }),
  graphql(CLIENT_API_MUTATIONS.UPDATE_LISTENERS, {
    name: 'listenersStatusMutation',
  }),
  graphql(CLIENT_API_MUTATIONS.UPDATE_MODAL_PROCESS, {
    name: 'modalProcessMutation',
  }),
  graphql(CLIENT_API_MUTATIONS.UPDATE_LOGIN_PROCESS, {
    name: 'loginProcessMutation',
  })
)(LoginQuery)
