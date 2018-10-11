import React from 'react'
import { Checkbox } from '@material-ui/core'
import { has, isEqual } from 'lodash-es'

import { IProps, keyItem } from './Accounts.types'
import {
  AccountsWalletsHeadingWrapper,
  Headline,
  CloseContainer,
  StyledIcon,
  SelectAll,
  AccountName,
  AccountsList,
  AccountsListItem,
} from '@containers/Portfolio/components/PortfolioSelector/sharedStyles/sharedStyles'
import { TypographyFullWidth } from '@styles/cssUtils'

export default class Accounts extends React.PureComponent<IProps> {
  componentDidMount() {
    if (!has(this.props.data.myPortfolios[0], 'keys')) {
      // console.log('no keys');

      return null
    }

    const { keys } = this.props.data.myPortfolios[0]
    const oldKeys = this.props.keys
    const checkboxes =
      (keys && keys.map((key: keyItem) => key && key.name).filter(Boolean)) || []

    this.props.setKeys(checkboxes)

    const areNewKeysAndOldKeysEqual = isEqual(checkboxes, oldKeys)

    if (oldKeys.length < checkboxes.length || !areNewKeysAndOldKeysEqual) {
      this.props.setActiveKeys(checkboxes)
    }

    return true
  }

  render() {
    const {
      isSideNavOpen,
      isCheckedAll,
      onToggleAll,
      keys,
      activeKeys,
      onToggleKeyCheckbox,
      color,
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

          <Headline isSideNavOpen={isSideNavOpen} color={color}>settings</Headline>
          <CloseContainer>
            <StyledIcon isSideNavOpen={isSideNavOpen} color={color} />
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
          {keys.map((keyName) => {
            if (!keyName) {
              return null
            }
            const isChecked =
              (activeKeys && activeKeys.indexOf(keyName) !== -1)

            return (
              <AccountsListItem key={keyName} color={color}>
                <Checkbox
                  type="checkbox"
                  id={keyName}
                  checked={isChecked}
                  onClick={() => onToggleKeyCheckbox(keyName)}
                />

                <AccountName
                  align="left"
                  variant="body2"
                  color={isChecked ? 'secondary' : 'textSecondary'}
                >
                  {keyName}
                </AccountName>
              </AccountsListItem>
            )
          })}
        </AccountsList>
        {/*<Divider />*/}
      </>
    )
  }
}
