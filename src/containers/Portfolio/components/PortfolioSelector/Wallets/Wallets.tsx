import React from 'react'
import { Checkbox } from '@material-ui/core'
import { has } from 'lodash-es'

import { IProps, walletItem } from './Wallets.types'
import {
  AccountName,
  AccountsList,
  AccountsListItem,
} from '@containers/Portfolio/components/PortfolioSelector/sharedStyles/sharedStyles'


export default class Wallets extends React.PureComponent<IProps> {
  componentDidMount() {
    if (!has(this.props.data.getProfile, 'cryptoWallets')) {
      return null
    }

    const { cryptoWallets } = this.props.data.getProfile
    const checkboxes =
      (cryptoWallets && cryptoWallets.map((wallet: walletItem) => wallet && wallet.name).filter(Boolean)) || []

    this.props.setWallets(checkboxes)
    this.props.setActiveWallets(checkboxes)

    return true
  }

  render() {
    const {
      wallets,
      activeWallets,
      onToggleWalletCheckbox,
      color,
    } = this.props

    return (
        <AccountsList>
          {wallets.map((walletName) => {
            if (!walletName) {
              return null
            }
            const isChecked =
              (activeWallets && activeWallets.indexOf(walletName) !== -1)

            return (
              <AccountsListItem key={walletName} color={color}>
                <Checkbox
                  type="checkbox"
                  id={walletName}
                  checked={isChecked}
                  onClick={() => onToggleWalletCheckbox(walletName)}
                />

                <AccountName
                  align="left"
                  variant="body2"
                  color={isChecked ? 'secondary' : 'textSecondary'}
                >
                  {walletName}
                </AccountName>
              </AccountsListItem>
            )
          })}
        </AccountsList>
    )
  }
}
