import * as React from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import withTheme from '@material-ui/core/styles/withTheme'

import Dropdown from '@components/SimpleDropDownSelector'
import {
  setKeys as setKeysAction,
  setActiveKeys as setActiveKeysAction,
  setWallets as setWalletsAction,
  setActiveWallets as setActiveWalletsAction,
  filterValuesLessThen,
} from '../../actions'
import { getKeysQuery, getWalletsQuery } from '../../api'
import { IProps } from './PortfolioSelector.types'
import QueryRenderer from '@components/QueryRenderer'
import Accounts from './Accounts/Accounts'
import Wallets from './Wallets/Wallets'
import {
  AccountsWalletsBlock,
  FilterIcon,
  FilterValues,
  Name,
} from './PortfolioSelector.styles'
import { Slide } from '@material-ui/core'

class PortfolioSelector extends React.Component<IProps> {
  onToggleKeyCheckbox = (checkBoxName: string) => {
    const { activeKeys, setActiveKeys } = this.props
    const clonedActiveKeys = activeKeys.slice()

    const hasIndex = clonedActiveKeys.indexOf(checkBoxName)
    if (hasIndex !== -1) {
      clonedActiveKeys.splice(hasIndex, 1)
    } else {
      clonedActiveKeys.push(checkBoxName)
    }

    setActiveKeys(clonedActiveKeys)
  }

  onToggleWalletCheckbox = (checkBoxName: string) => {
    const { activeWallets, setActiveWallets } = this.props
    const clonedActiveWallets = activeWallets.slice()

    const hasIndex = clonedActiveWallets.indexOf(checkBoxName)
    if (hasIndex !== -1) {
      clonedActiveWallets.splice(hasIndex, 1)
    } else {
      clonedActiveWallets.push(checkBoxName)
    }

    setActiveWallets(clonedActiveWallets)
  }

  onToggleAll = () => {
    const {
      keys,
      activeKeys,
      wallets,
      activeWallets,
      setActiveKeys,
      setActiveWallets,
    } = this.props

    if (
      activeKeys.length + activeWallets.length ===
      keys.length + wallets.length
    ) {
      setActiveKeys([])
      setActiveWallets([])
    } else {
      setActiveKeys(keys)
      setActiveWallets(wallets)
    }
  }

  render() {
    const {
      filterValuesLessThenThat,
      filterPercent,
      isSideNavOpen,
      setKeys,
      setActiveKeys,
      setWallets,
      setActiveWallets,
      wallets,
      activeWallets,
      keys,
      activeKeys,
      theme,
      newCryptoWallets,
      newKeys,
    } = this.props

    const isCheckedAll =
      activeKeys.length + activeWallets.length === keys.length + wallets.length

    const color = theme.palette.secondary.main

    return (
      <Slide in={isSideNavOpen} direction="left">
        <AccountsWalletsBlock
          isSideNavOpen={true}
          background={theme.palette.background.paper}
          hoverBackground={theme.palette.action.hover}
          fontFamily={theme.typography.fontFamily}
        >
          <Accounts
            {...{
              color,
              isSideNavOpen,
              isCheckedAll,
              newKeys,
              keys,
              activeKeys,
              setKeys,
              setActiveKeys,
              onToggleAll: this.onToggleAll,
              onToggleKeyCheckbox: this.onToggleKeyCheckbox,
            }}
          />

          <Wallets
            {...{
              color,
              isSideNavOpen,
              isCheckedAll,
              wallets,
              activeWallets,
              newCryptoWallets,
              setWallets,
              setActiveWallets,
              onToggleWalletCheckbox: this.onToggleWalletCheckbox,
            }}
          />

          <Name color={color}>Dust</Name>
          <FilterValues>
            <FilterIcon
              color={theme.palette.getContrastText(
                theme.palette.background.paper
              )}
            />
            <Dropdown
              style={{ width: '100%' }}
              value={filterPercent}
              handleChange={filterValuesLessThenThat}
              name="filterValuesInMain"
              options={[
                { value: -100.0, label: 'No Filter' },
                { value: 0, label: '0% <' },
                { value: 0.1, label: '0.1% <' },
                { value: 0.2, label: '0.2% <' },
                { value: 0.3, label: '0.3% <' },
                { value: 0.5, label: '0.5% <' },
                { value: 1, label: '1% <' },
                { value: 10, label: '10% <' },
              ]}
            />
          </FilterValues>
        </AccountsWalletsBlock>
      </Slide>
    )
  }
}

const mapStateToProps = (store: any) => ({
  keys: store.portfolio.keys,
  activeKeys: store.portfolio.activeKeys,
  wallets: store.portfolio.wallets,
  activeWallets: store.portfolio.activeWallets,
  isShownMocks: store.user.isShownMocks,
  filterPercent: store.portfolio.filterValuesLessThenThat,
})

const mapDispatchToProps = (dispatch: any) => ({
  setKeys: (keys: string[]) => dispatch(setKeysAction(keys)),
  setActiveKeys: (activeKeys: string[]) =>
    dispatch(setActiveKeysAction(activeKeys)),
  setWallets: (wallets: string[]) => dispatch(setWalletsAction(wallets)),
  setActiveWallets: (activeWallets: string[]) =>
    dispatch(setActiveWalletsAction(activeWallets)),
  filterValuesLessThenThat: (percent: number) =>
    dispatch(filterValuesLessThen(percent)),
})

export default compose(
  withTheme(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PortfolioSelector)
