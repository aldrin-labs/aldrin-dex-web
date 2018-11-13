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
  DialogActions,
  Button,
  Card,
} from '@material-ui/core'
import { updateBinanceWarning, toggleMocks } from './actions'
import ComingSoon from '@components/ComingSoon'
import { MASTER_BUILD } from '@utils/config'
import CardHeader from '@components/CardHeader'

class UserContainer extends React.Component {
  store: any

  toggleMocks = () => {
    const { toggleMocks: toggleMockups } = this.props

    toggleMockups()
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

        <UserWrap style={MASTER_BUILD ? { filter: 'blur(3px)' } : {}}>
          {MASTER_BUILD && <ComingSoon />}

          <AddCryptoWallet
            forceUpdateUserContainer={this.forceUpdateUserContainer}
          />
          <CryptoWalletsList
            forceUpdateUserContainer={this.forceUpdateUserContainer}
          />
        </UserWrap>
        {!MASTER_BUILD && (
          <AdminCP>
            <CardHeader title="Show mocks" />
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

const AdminCP = styled(Card)`
  margin: 1rem;
  width: 10em;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  toggleMocks: () => dispatch(toggleMocks()),
  updateBinanceWarning: (payload: boolean) =>
    dispatch(updateBinanceWarning(payload)),
})

const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContainer)

export const User = compose(withErrorFallback)(storeComponent)
