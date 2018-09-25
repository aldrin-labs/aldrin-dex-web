import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'

import { withErrorFallback } from '@hoc/withErrorFallback'

import {
  KeysList,
  AddExchangeKey,
  CryptoWalletsList,
  AddCryptoWallet,
} from '@containers/User/components'

class UserContainer extends React.Component {
  store: any

  render() {
    if (!this.props.loginStatus) {
      return <Redirect to="/portfolio" />
    }
    return (
      <div>
        <UserWrap>
          <AddExchangeKey />
          <KeysList />
        </UserWrap>

        <UserWrap>
          <AddCryptoWallet />
          <CryptoWalletsList />
        </UserWrap>
      </div>
    )
  }
}

const Heading = styled.span`
  font-size: 1em;
  font-family: Roboto, sans-serif;
  color: #fff;
  padding-bottom: 10px;
`

const UserWrap = styled.div`
  display: flex;
  margin: 10px;
`

const mapStateToProps = (store) => ({
  isShownMocks: store.user.isShownMocks,
  loginStatus: store.login.loginStatus
})

const storeComponent = connect(mapStateToProps)(UserContainer)

export const User = compose(withErrorFallback)(storeComponent)
