import * as React from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import withTheme from '@material-ui/core/styles/withTheme'

import { Slide } from '@material-ui/core'
import Dropdown from '@components/SimpleDropDownSelector'
import {
  setKeys as setKeysAction,
  setActiveKeys as setActiveKeysAction,
  setWallets as setWalletsAction,
  setActiveWallets as setActiveWalletsAction,
  filterValuesLessThen,
} from '../../actions'
import { IProps, KeyOrWallet } from './PortfolioSelector.types'
import Accounts from './Accounts/Accounts'
import Wallets from './Wallets/Wallets'
import {
  AccountsWalletsBlock,
  FilterIcon,
  FilterValues,
  Name,
} from './PortfolioSelector.styles'
import * as UTILS from '@utils/PortfolioSelectorUtils'

class PortfolioSelector extends React.Component<IProps> {

  updateSettings = async (objectForMutation) => {

    const { updatePortfolioSettings } = this.props;

    try {
      await updatePortfolioSettings({
        variables: objectForMutation,
      })
      console.log('settings updated');

    } catch (error) {
      console.log(error)
    }
  }

  onKeyToggle = (toggledKeyID: string) => {
    const {
      portfolioId,
      newKeys,
    } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        selectedKeys: UTILS.getArrayContainsOnlySelected(newKeys, toggledKeyID),
      },
    }

    this.updateSettings(objForQuery)
  }

  onWalletToggle = (toggledWalletID: string) => {
    const {
      portfolioId,
      newWallets,
    } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        selectedWallets: UTILS.getArrayContainsOnlySelected(newWallets, toggledWalletID),
      },
    }

    this.updateSettings(objForQuery)
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
      newWallets,
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
              onKeyToggle: this.onKeyToggle,
            }}
          />

          <Wallets
            {...{
              color,
              isSideNavOpen,
              isCheckedAll,
              wallets,
              activeWallets,
              newWallets,
              setWallets,
              setActiveWallets,
              // onToggleWalletCheckbox: this.onToggleWalletCheckbox,
              onWalletToggle: this.onWalletToggle,
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
