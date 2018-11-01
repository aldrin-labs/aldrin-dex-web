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
  render() {
    const {
      isSideNavOpen,
      isCheckedAll,
      onToggleAll,
      color,
      newKeys,
      onKeyToggle,
    } = this.props

    return (
      <>
        <AccountsWalletsHeadingWrapper>
          <TypographyFullWidth
            gutterBottom={true}
            align="center"
            color="secondary"
            variant="h6"
          >
            🔑 Api keys
          </TypographyFullWidth>

          <Headline isSideNavOpen={isSideNavOpen} color={color}>
            settings
          </Headline>
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
            variant="body1"
            color={isCheckedAll ? 'secondary' : 'textSecondary'}
          >
            Select All
          </AccountName>
        </SelectAll>

        <AccountsList>
          {newKeys.map((keyName) => {
            if (!keyName) {
              return null
            }
            const isChecked = keyName.selected

            return (
              <AccountsListItem key={keyName.name} color={color}>
                <Checkbox
                  type="checkbox"
                  id={keyName.name}
                  checked={isChecked}
                  // onClick={() => onToggleKeyCheckbox(keyName)}
                  onClick={()=> onKeyToggle(keyName._id)}
                />

                <AccountName
                  align="left"
                  variant="body1"
                  color={isChecked ? 'secondary' : 'textSecondary'}
                >
                  {keyName.name}
                </AccountName>
              </AccountsListItem>
            )
          })}
        </AccountsList>
      </>
    )
  }
}
