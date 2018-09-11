import React from 'react'
import { Divider, Checkbox } from '@material-ui/core'
import { has } from 'lodash'

import { IProps } from './Accounts.types'
import {
  AccountsWalletsHeadingWrapper,
  Headline,
  CloseContainer,
  StyledIcon,
  SelectAll,
  AccountName,
  AccountsList,
  AccountsListItem,
} from '@containers/Portfolio/components/PortfolioSelector/styles'
import { TypographyFullWidth } from '@styles/cssUtils'

export default class Accounts extends React.PureComponent<IProps> {
  componentDidMount() {
    if (!has(this.props.data.getProfile, 'keys')) {
      return null
    }

    const { keys } = this.props.data.getProfile
    const checkboxes =
      (keys && keys.map((key) => key && key.name).filter(Boolean)) || []
    const checkedCheckboxes = checkboxes.map((ck, i) => i)

    this.props.setKeys(checkboxes)
    this.props.setActiveKeys(checkboxes)
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
          {/* <KeyIcon /> */}
          <TypographyFullWidth
            gutterBottom={true}
            align="center"
            color="secondary"
            variant="title"
          >
            🔑 Api keys
          </TypographyFullWidth>

          <Headline isSideNavOpen={isSideNavOpen}>settings</Headline>
          <CloseContainer>
            <StyledIcon isSideNavOpen={isSideNavOpen} />
          </CloseContainer>
        </AccountsWalletsHeadingWrapper>

        <SelectAll>
          <Checkbox
            type="checkbox"
            id="all"
            checked={isCheckedAll}
            onClick={onToggleAll}
          />

          <AccountName
            variant="body2"
            color={isCheckedAll ? 'secondary' : 'textSecondary'}
          >
            Select All
          </AccountName>
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
                  checked={isChecked}
                  onClick={() => onToggleCheckbox(i)}
                />

                <AccountName
                  align="left"
                  variant="body2"
                  color={isChecked ? 'secondary' : 'textSecondary'}
                >
                  {checkbox}
                </AccountName>
              </AccountsListItem>
            )
          })}
        </AccountsList>
        <Divider />
      </>
    )
  }
}
