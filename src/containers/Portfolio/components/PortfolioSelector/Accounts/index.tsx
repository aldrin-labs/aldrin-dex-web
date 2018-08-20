import React from 'react'
import { Typography } from '@material-ui/core'
import { has } from 'lodash'

import {
  AccountsWalletsHeadingWrapper,
  Headline,
  CloseContainer,
  StyledIcon,
  SelectAll,
  Checkbox,
  Label,
  Span,
  AccountName,
  AccountsList,
  AccountsListItem,
} from '@containers/Portfolio/components/PortfolioSelector/styles'

export default class Accounts extends React.PureComponent {
  componentDidMount() {
    console.log(this.props.data)
    if (!has(this.props.data.getProfile, 'keys')) {
      return null
    }

    const { keys } = this.props.data.getProfile
    const checkboxes =
      (keys && keys.map((key) => key && key.name).filter(Boolean)) || []
    const checkedCheckboxes = checkboxes.map((ck, i) => i)

    this.props.setKeys(checkboxes)

    this.props.setCheckboxes({ checkboxes, checkedCheckboxes })

    return true
  }
  render() {
    const {
      isSideNavOpen,
      isCheckedAll,
      onToggleAll,
      checkboxes,
      checkedCheckboxes,
      onToggleCheckbox,
    } = this.props
    return (
      <>
        <AccountsWalletsHeadingWrapper>
          <Typography color="secondary" variant="title">
            Api keys
          </Typography>

          <Headline isSideNavOpen={isSideNavOpen}>settings</Headline>
          <CloseContainer>
            <StyledIcon isSideNavOpen={isSideNavOpen} />
          </CloseContainer>
        </AccountsWalletsHeadingWrapper>

        <SelectAll>
          <Checkbox
            type="checkbox"
            id="all"
            defaultChecked={true}
            checked={isCheckedAll}
            onClick={onToggleAll}
          />
          <Label htmlFor="all">
            <Span />
          </Label>
          <AccountName isChecked={isCheckedAll}>Select All</AccountName>
        </SelectAll>

        <AccountsList>
          {checkboxes.map((checkbox, i) => {
            if (!checkbox) {
              return null
            }
            const isChecked =
              (checkedCheckboxes && checkedCheckboxes.indexOf(i) >= 0) || false

            return (
              <AccountsListItem key={checkbox}>
                <Checkbox
                  type="checkbox"
                  id={checkbox}
                  defaultChecked={true}
                  checked={isChecked}
                  onClick={() => onToggleCheckbox(i)}
                />
                <Label htmlFor={checkbox}>
                  <Span />
                </Label>

                <AccountName isChecked={isChecked}>{checkbox}</AccountName>
              </AccountsListItem>
            )
          })}
        </AccountsList>
      </>
    )
  }
}
