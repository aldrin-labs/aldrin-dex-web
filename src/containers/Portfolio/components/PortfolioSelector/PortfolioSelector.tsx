import * as React from 'react'
import FaFilter from '@material-ui/icons/FilterList'
import styled from 'styled-components'
import Arrow from '@material-ui/icons/ArrowLeft'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { has } from 'lodash-es'

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
    const { keys, activeKeys, wallets, activeWallets, setActiveKeys, setActiveWallets } = this.props

    if (activeKeys.length + activeWallets.length === keys.length + wallets.length) {
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
    } = this.props

    const isCheckedAll =
      (activeKeys.length + activeWallets.length === keys.length + wallets.length)

    return (
      <AccountsWalletsBlock
        onClick={isSideNavOpen ? undefined : this.props.toggleWallets}
        isSideNavOpen={this.props.isSideNavOpen}
      >
        <QueryRenderer
          component={Accounts}
          query={getKeysQuery}
          {...{
            isSideNavOpen,
            isCheckedAll,
            keys,
            activeKeys,
            setKeys,
            setActiveKeys,
            onToggleAll: this.onToggleAll,
            onToggleKeyCheckbox: this.onToggleKeyCheckbox,
          }}
        />

        <QueryRenderer
          component={Wallets}
          query={getWalletsQuery}
          {...{
            isSideNavOpen,
            isCheckedAll,
            wallets,
            activeWallets,
            setWallets,
            setActiveWallets,
            onToggleWalletCheckbox: this.onToggleWalletCheckbox,
          }}
        />

        <Name>Dust</Name>
        <FilterValues>
          <FilterIcon />
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
    )
  }
}

const Name = styled.h1`
  width: 100%;
  text-align: center;
  letter-spacing: 1px;
  background: #292d31;
  border-radius: 2.5rem;
  padding: 0.5rem 0;
  text-align: center;
  color: #4ed8da;
`

const FilterValues = styled.div`
  width: 100%;
  display: flex;
  place-items: center;
`
const FilterIcon = styled(FaFilter)`
  color: whitesmoke;
  font-size: 1.5rem;
  margin: 0 0.5rem;
`

const AccountsWalletsBlock = styled.div`
  min-width: 200px;
  background-color: #2d3136;
  padding: 16px;
  right: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '0' : '-11.5rem'};
  cursor: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? 'auto' : 'pointer'};
  display: block;
  position: fixed;
  top: 0;
  z-index: 1300;
  height: 100vh;
  transition: right 0.2s ease-in;

  &:hover {
    background-color: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
      isSideNavOpen ? '#2d3136' : '#323941'};
  }
`

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

const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(PortfolioSelector)

export default compose()(storeComponent)
