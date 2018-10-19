import React from 'react'
import { Checkbox } from '@material-ui/core'
import { has, isEqual } from 'lodash-es'

import { IProps, walletItem } from './Wallets.types'
import {
  AccountName,
  AccountsList,
  AccountsListItem,
} from '@containers/Portfolio/components/PortfolioSelector/sharedStyles/sharedStyles'

export default class Wallets extends React.PureComponent<IProps> {
  componentDidMount() {
    if (!has(this.props, 'newCryptoWallets')) {
      return null
    }

    const { newCryptoWallets } = this.props
    const oldWallets = this.props.wallets
    const checkboxes =
      (newCryptoWallets &&
        newCryptoWallets
          .map((wallet: walletItem) => wallet && wallet.name)
          .filter(Boolean)) ||
      []

    this.props.setWallets(checkboxes)

    const areNewWalletsAndOldWalletsEqual = isEqual(checkboxes, oldWallets)

    if (
      oldWallets.length < checkboxes.length ||
      !areNewWalletsAndOldWalletsEqual
    ) {
      this.props.setActiveWallets(checkboxes)
    }

    return true
  }

  render() {
    const { wallets, activeWallets, onToggleWalletCheckbox, color } = this.props

    return (
      <AccountsList>
        {wallets.map((walletName) => {
          if (!walletName) {
            return null
          }
          const isChecked =
            activeWallets && activeWallets.indexOf(walletName) !== -1

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
                variant="body1"
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
