import * as React from 'react'
import { graphql } from 'react-apollo'
import styled from 'styled-components'
import { getKeysQuery } from '../../api'
import { Props, State } from './types'

class PortfolioSelector extends React.Component<Props, State> {
  state: State = {
    checkedCheckboxes: null,
    checkboxes: null,
  }

  componentWillReceiveProps(nextProps: Props) {
    // called once
    if (nextProps.data && nextProps.data.getProfile && !this.state.checkboxes) {
      const { keys } = nextProps.data.getProfile
      if (!keys) return
      const checkboxes = keys.map((key) => key && key.name).filter(Boolean)
      if (
        checkboxes.indexOf('Test1') === -1 &&
        checkboxes.indexOf('Test2') === -1
      ) {
        checkboxes.push('Test1', 'Test2')
      }
      const checkedCheckboxes = checkboxes.map((ck, i) => i)

      if (checkboxes) {
        this.setState({ checkboxes, checkedCheckboxes }, () => {
          const { onChangeActive } = this.props

          onChangeActive(checkboxes)
        })
      }
    }
  }

  onToggleCheckbox = (index: number) => {
    const { onChangeActive } = this.props

    const checkedCheckboxes =
      (this.state.checkedCheckboxes && this.state.checkedCheckboxes.slice()) ||
      []

    const hasIndex = checkedCheckboxes.indexOf(index)
    if (hasIndex >= 0) {
      checkedCheckboxes.splice(hasIndex, 1)
    } else checkedCheckboxes.push(index)

    this.setState({ checkedCheckboxes }, () => {
      if (!this.state.checkboxes) return
      const checkboxes = this.state.checkboxes
        .map((ck, idx) => {
          if (checkedCheckboxes.indexOf(idx) >= 0) {
            return ck
          }
          return null
        })
        .filter(Boolean)
      onChangeActive(checkboxes)
    })
  }

  onToggleAll = () => {
    const { checkedCheckboxes, checkboxes } = this.state
    if (!checkboxes) return

    if (checkedCheckboxes && checkedCheckboxes.length === checkboxes.length) {
      this.setState({ checkedCheckboxes: null }, () => {
        this.props.onChangeActive([])
      })
    } else {
      const allAccounts = checkboxes.map((ck, i) => i)

      this.setState({ checkedCheckboxes: allAccounts }, () => {
        if (!this.state.checkboxes) return
        const checkboxes = this.state.checkboxes
          .map((ck, idx) => {
            if (allAccounts.indexOf(idx) >= 0) {
              return ck
            }
            return null
          })
          .filter(Boolean)
        this.props.onChangeActive(checkboxes)
      })
    }
  }

  render() {
    const { checkedCheckboxes, checkboxes } = this.state

    if (!checkboxes) return null

    const isCheckedAll =
      (checkedCheckboxes && checkedCheckboxes.length === checkboxes.length) ||
      false

    return (
      <AccountsWalletsBlock>
        <AccountsWalletsHeading>Api keys</AccountsWalletsHeading>

        <SelectAll>
          <Checkbox
            type="checkbox"
            id="all"
            defaultChecked={true}
            checked={isCheckedAll}
            onChange={() => {}}
            onClick={this.onToggleAll}
          />
          <Label htmlFor="all">
            <Span />
          </Label>
          <AccountName isChecked={isCheckedAll}>Select All</AccountName>
        </SelectAll>

        <AccountsList>
          {checkboxes.map((checkbox, i) => {
            if (!checkbox) return null
            const isChecked =
              (checkedCheckboxes && checkedCheckboxes.indexOf(i) >= 0) || false

            return (
              <AccountsListItem key={checkbox}>
                <Checkbox
                  type="checkbox"
                  id={checkbox}
                  defaultChecked={true}
                  checked={isChecked}
                  onChange={() => {}}
                  onClick={() => this.onToggleCheckbox(i)}
                />
                <Label htmlFor={checkbox}>
                  <Span />
                </Label>

                <AccountName isChecked={isChecked}>{checkbox}</AccountName>
              </AccountsListItem>
            )
          })}
        </AccountsList>
      </AccountsWalletsBlock>
    )
  }
}

const SelectAll = styled.div`
  margin-top: 32px;
  padding-left: 8px;
`

const AccountName = styled.span`
  color: ${(props: { isChecked: boolean }) =>
    props.isChecked ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  margin-left: 24px;
`

const Span = styled.span``

const Label = styled.label``

const Checkbox = styled.input`
  display: none;

  & + ${Label} ${Span} {
    display: inline-block;

    width: 22px;
    height: 22px;

    cursor: pointer;
    vertical-align: middle;

    border: 1.5px solid #909294;
    border-radius: 3px;
    background-color: transparent;
  }

  & + ${Label}:hover ${Span} {
    border-color: #4ed8da;
  }

  & :checked + ${Label} ${Span} {
    border-color: #4ed8da;
    background-color: #4ed8da;
    background-image: url('https://image.flaticon.com/icons/png/128/447/447147.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 14px;
  }
`

const AccountsListItem = styled.li`
  display: flex;
  align-items: center;
  font-family: Roboto;
  font-size: 16px;
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
  min-width: 250px;
  min-height: 90vh;
  background-color: #2d3136;
  padding: 16px;
`

const AccountsWalletsHeading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  color: #ffffff;
`

export default graphql(getKeysQuery)(PortfolioSelector)
