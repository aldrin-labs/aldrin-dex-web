import * as React from 'react'
import styled from 'styled-components'

interface Props {}

interface State {
  checkedCheckboxes: number[] | null
}

const checkboxes = ['Account 1', 'Account 2', 'Account 3', 'Account 4']

export class PortfolioSelector extends React.Component<Props, State> {
  state: State = {
    checkedCheckboxes: null,
  }

  onToggleCheckbox = (index: number) => {
    const checkedCheckboxes =
      (this.state.checkedCheckboxes && this.state.checkedCheckboxes.slice()) ||
      []

    const hasIndex = checkedCheckboxes.indexOf(index)
    if (hasIndex >= 0) {
      checkedCheckboxes.splice(hasIndex, 1)
    } else checkedCheckboxes.push(index)

    this.setState({ checkedCheckboxes })
  }

  onToggleAll = () => {
    const { checkedCheckboxes } = this.state

    if (checkedCheckboxes && checkedCheckboxes.length === checkboxes.length) {
      this.setState({ checkedCheckboxes: null })
    } else {
      const allAccounts = checkboxes.map((ck, i) => i)

      this.setState({ checkedCheckboxes: allAccounts })
    }
  }

  render() {
    const { checkedCheckboxes } = this.state

    const isCheckedAll =
      (checkedCheckboxes && checkedCheckboxes.length === checkboxes.length) ||
      false

    return (
      <AccountsWalletsBlock>
        <AccountsWalletsHeading>Accounts & Wallets</AccountsWalletsHeading>

        <SelectAll>
          <Checkbox
            type="checkbox"
            id="all"
            checked={isCheckedAll}
            onClick={this.onToggleAll}
          />
          <Label htmlFor="all">
            <Span />
          </Label>
          <AccountName isChecked={isCheckedAll}>Select All</AccountName>
        </SelectAll>

        <AccountsList>
          {checkboxes.map((checkbox, i) => {
            const isChecked =
              (checkedCheckboxes && checkedCheckboxes.indexOf(i) >= 0) || false

            return (
              <AccountsListItem key={checkbox}>
                <Checkbox
                  type="checkbox"
                  id={checkbox}
                  checked={isChecked}
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
  width: 280px;
  background-color: #2d3136;
  padding: 16px;
  position: fixed;
  height: 100vh;
`

const AccountsWalletsHeading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  color: #ffffff;
`
