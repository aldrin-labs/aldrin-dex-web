import * as React from 'react'
import { FaFilter } from 'react-icons/lib/fa'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import Dropdown from '@components/SimpleDropDownSelector'
import { setKeys as setKeysAction, filterValuesLessThen } from '../../actions'
import { getKeysQuery } from '../../api'
import { IProps, IState } from './PortfolioSelector.types'
import QueryRenderer from '@components/QueryRenderer'
import Accounts from '@containers/Portfolio/components/PortfolioSelector/Accounts'


class PortfolioSelector extends React.Component<IProps, IState> {
  state = {
    checkboxes: [],
    checkedCheckboxes: [],
  }

  setCheckboxes = ({ checkboxes, checkedCheckboxes }) => {
    console.log({ checkboxes, checkedCheckboxes })
    this.setState({ checkboxes, checkedCheckboxes })
  }

  onToggleCheckbox = (index: number) => {
    const { onChangeActive } = this.props

    const checkedCheckboxes =
      (this.state.checkedCheckboxes && this.state.checkedCheckboxes.slice()) ||
      []

    const hasIndex = checkedCheckboxes.indexOf(index)
    if (hasIndex >= 0) {
      checkedCheckboxes.splice(hasIndex, 1)
    } else {
      checkedCheckboxes.push(index)
    }

    this.setState({ checkedCheckboxes }, () => {
      if (!this.state.checkboxes) {
        return
      }
      const checkboxes = this.state.checkboxes
        .map((ck, idx) => {
          if (checkedCheckboxes.indexOf(idx) >= 0) {
            return ck
          }

          return null
        })
        .filter(Boolean)
      console.log('checkboxes in onToggleCheckbox', checkboxes);

      onChangeActive(checkboxes)
    })
  }

  onToggleAll = () => {
    const { checkedCheckboxes, checkboxes } = this.state
    if (!checkboxes) {
      return
    }

    if (checkedCheckboxes && checkedCheckboxes.length === checkboxes.length) {
      this.setState({ checkedCheckboxes: null }, () => {
        this.props.onChangeActive([])
      })
    } else {
      const allAccounts = checkboxes.map((ck, i) => i)

      this.setState({ checkedCheckboxes: allAccounts }, () => {
        if (!this.state.checkboxes) {
          return
        }
        const checkboxesAgain = this.state.checkboxes
        checkboxesAgain
          .map((ck, idx) => {
            if (allAccounts.indexOf(idx) >= 0) {
              return ck
            }

            return null
          })
          .filter(Boolean)
        this.props.onChangeActive(checkboxesAgain)
      })
    }
  }

  render() {
    const { checkedCheckboxes, checkboxes } = this.state
    const {
      filterValuesLessThenThat,
      filterPercent,
      isSideNavOpen,
      setKeys,
    } = this.props

    if (!checkboxes) {
      return null
    }

    const isCheckedAll =
      (checkedCheckboxes && checkedCheckboxes.length === checkboxes.length) ||
      false

    return (
      <AccountsWalletsBlock
        onClick={isSideNavOpen ? null : this.props.toggleWallets}
        isSideNavOpen={this.props.isSideNavOpen}
      >
        <QueryRenderer
          component={Accounts}
          query={getKeysQuery}
          {...{
            isSideNavOpen,
            isCheckedAll,
            checkboxes,
            checkedCheckboxes,
            setKeys,
            setCheckboxes: this.setCheckboxes,
            onToggleAll: this.onToggleAll,
            onToggleCheckbox: this.onToggleCheckbox,
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
  font-family: Roboto, sans-serif;
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

const CloseContainer = styled.div`
  height: 100%;
`

const SelectAll = styled.div`
  margin-top: 32px;
  padding-left: 8px;
`

const AccountName = styled.span`
  color: ${(props: { isChecked: boolean }) =>
    props.isChecked ? '#4ed8da' : '#fff'};

  font-family: Roboto, sans-serif;
  font-size: 1em;
  font-weight: 500;
  text-align: left;
  margin-left: 24px;
`

const AccountsListItem = styled.li`
  display: flex;
  align-items: center;
  font-family: Roboto, sans-serif;
  font-size: 1em;
  font-weight: 500;
  text-align: left;
  color: #4ed8da;
  margin-bottom: 24px;
`

const AccountsList = styled.ul`
  list-style: none;
  margin-top: 34px;
  display: flex;
  flex-direction: column;
  padding-left: 8px;
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

const mapStateToProps = (store) => ({
  isShownMocks: store.user.isShownMocks,
  filterPercent: store.portfolio.filterValuesLessThenThat,
})

const mapDispatchToProps = (dispatch: any) => ({
  setKeys: (keys: string[]) => dispatch(setKeysAction(keys)),
  filterValuesLessThenThat: (percent: number) =>
    dispatch(filterValuesLessThen(percent)),
})

const storeComponent = connect(mapStateToProps, mapDispatchToProps)(
  PortfolioSelector
)

export default compose()(storeComponent)
