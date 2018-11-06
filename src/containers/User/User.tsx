import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'

import { withErrorFallback } from '@hoc/withErrorFallback'

import {
  // KeysList,
  AddExchangeKey,
  // CryptoWalletsList,
  AddCryptoWallet,
} from '@containers/User/components'
import Switch from '@material-ui/core/Switch'
import CryptoWalletsList from '@containers/User/components/CryptoWalletsList/CryptoWalletsList'
import KeysList from '@containers/User/components/KeysList/KeysList'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core'
import { updateBinanceWarning } from './actions'
import ComingSoon from '@components/ComingSoon'

class UserContainer extends React.Component {
  store: any

  toggleMocks = () => {
    const { dispatch } = this.props

    dispatch({
      type: 'TOGGLE_MOCKS',
    })
  }

  forceUpdateUserContainer = () => {
    this.forceUpdate()
  }

  render() {
    if (!this.props.loginStatus) {
      return <Redirect to="/portfolio" />
    }
    return (
      <>
        <UserWrap>
          <AddExchangeKey
            forceUpdateUserContainer={this.forceUpdateUserContainer}
          />
          <KeysList forceUpdateUserContainer={this.forceUpdateUserContainer} />
        </UserWrap>

        <UserWrap
          style={
            process.env.NODE_ENV === 'production' ? { filter: 'blur(3px)' } : {}
          }
        >
          {process.env.NODE_ENV === 'production' && <ComingSoon />}

          <AddCryptoWallet
            forceUpdateUserContainer={this.forceUpdateUserContainer}
          />
          <CryptoWalletsList
            forceUpdateUserContainer={this.forceUpdateUserContainer}
          />
        </UserWrap>
        {process.env.NODE_ENV !== 'production' && (
          <AdminCP>
            <Heading>Show mocks</Heading>
            <Switch
              onChange={this.toggleMocks}
              checked={this.props.isShownMocks}
            />
          </AdminCP>
        )}
        <Dialog
          fullScreen={false}
          open={this.props.showBinanceWarning}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {
              'We currently support only Binance exchange and will be adding more exchanges soon!'
            }
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => this.props.updateBinanceWarning(false)}
              color="secondary"
              autoFocus={true}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

const Heading = styled.span`
  font-size: 1em;
  font-family: Roboto, sans-serif;
  color: #fff;
  padding-bottom: 10px;
`

const AdminCP = styled.div`
  margin: 18px;
  padding: 8px 8px 20px 8px;
  background-color: #424242;
  width: 10em;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
`

const UserWrap = styled.div`
  display: flex;
  margin: 10px;
`

const mapStateToProps = (store) => ({
  isShownMocks: store.user.isShownMocks,
  loginStatus: store.login.loginStatus,
  showBinanceWarning: store.user.showBinanceWarning,
})

const mapDispatchToProps = (dispatch: any) => ({
  updateBinanceWarning: (payload: boolean) =>
    dispatch(updateBinanceWarning(payload)),
})

const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContainer)

export const User = compose(withErrorFallback)(storeComponent)
