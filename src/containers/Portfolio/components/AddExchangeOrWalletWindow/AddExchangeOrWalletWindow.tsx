import React from 'react'
import { Link } from 'react-router-dom'

import { IProps } from './AddExchangeOrWalletWindow.types'
import {
  SAddIcon,
  SButton,
  STypographyButtonText,
  STypography,
  PTextBox,
  PTWrapper,
} from '../walletWindows/walletWindows.styles'

const MyLinkToUserSettings = (props: object) => <Link to="/user" {...props} />

export default class AddExchangeOrWalletWindow extends React.Component<IProps> {
  render() {
    const { theme } = this.props

    return (
      <PTWrapper background={theme.palette.background.paper}>
        <PTextBox backgroundColor={theme.palette.grey.A400}>
          <STypography color="default" variant="display1">
            Add an exchange or wallet
          </STypography>
          <SButton
            component={MyLinkToUserSettings}
            backgroundColor={theme.palette.grey.A400}
            borderColor={theme.palette.secondary.light}
          >
            <STypographyButtonText> Add </STypographyButtonText>
            <SAddIcon />
          </SButton>
        </PTextBox>
      </PTWrapper>
    )
  }
}
