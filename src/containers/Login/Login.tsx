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
import { LoginMenu } from '@containers/Login/components'
import MainLogo from '@icons/AuthLogo.png'

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
  align-items: center;
  display: flex;
  width: 100%;
  justify-content: space-between;
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
  /*
  componentWillMount() {
    this.checkToken()
  }*/

  componentDidMount() {
    if (this.props.isShownModal) this.showLogin()
    this.checkToken()
    this.props.listenersWillOn()
    this.setLockListeners()
  }

  setLockListeners = () => {
    this.state.lock.on('authenticated', (authResult: any) => {
      this.props.onLogin()
      this.state.lock.getUserInfo(
        authResult.accessToken,
        (error: Error, profile: any) => {
          if (error) {
            console.error(error)
          }
          this.props.storeLogin(profile)
          this.setToken(authResult.idToken)
          this.createUserReq(profile)
        }
      )
    })
    this.state.lock.on('hide', () => {
      this.props.storeModalIsClosing()
      this.props.listenersWillOff()
      setTimeout(() => this.props.storeClosedModal(), 1000)
    })
  }

  removeToken = () => {
    localStorage.removeItem('token')
  }

  getToken = () => {
    return localStorage.getItem('token')
  }

  checkToken = () => {
    if (this.props.loginStatus) {
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
    if (!this.props.modalIsOpen && !this.props.isLogging && !this.props.modalLogging) {
      this.props.storeOpenedModal()
      this.state.lock.show()
      if (this.props.listenersOff) {
        this.setLockListeners()
      }
    }
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
  isLogging: state.login.modalStatuses.isLogging,
  modalLogging: state.login.modalStatuses.modalLogging,
  modalIsOpen: state.login.modalStatuses.modalIsOpen,
  listenersOff: state.login.modalStatuses.listenersOff,
})

const mapDispatchToProps = (dispatch: any) => ({
  onLogin: () => dispatch(actions.onLogin()),
  storeLogin: (profile: any) => dispatch(actions.storeLogin(profile)),
  storeLogout: () => dispatch(actions.storeLogout()),
  storeOpenedModal: () => dispatch(actions.storeOpenedModal()),
  storeModalIsClosing: () => dispatch(actions.storeModalIsClosing()),
  storeClosedModal: () => dispatch(actions.storeClosedModal()),
  listenersWillOn: () => dispatch(actions.listenersWillOn()),
  listenersWillOff: () => dispatch(actions.listenersWillOff()),
})

export const Login = compose(
  withErrorFallback,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(API.createUserMutation, { name: 'createUser' })
)(LoginQuery)
