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
import Switch from '@material-ui/core/Switch'

class UserContainer extends React.Component {
  store: any

  toggleMocks = () => {
    const { dispatch } = this.props

    dispatch({
      type: 'TOGGLE_MOCKS',
    })
  }

  render() {
    console.log(process.env.NODE_ENV)
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
        {process.env.NODE_ENV !== 'production' && 
          <AdminCP>
            <Heading>Show mocks</Heading>
            <Switch
              onChange={this.toggleMocks}
              checked={this.props.isShownMocks}
            />
          </AdminCP>
        }
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
  loginStatus: store.login.loginStatus
})

const storeComponent = connect(mapStateToProps)(UserContainer)

export const User = compose(withErrorFallback)(storeComponent)
