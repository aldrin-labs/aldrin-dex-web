import React from 'react'

import { IProps } from './SelectExchangeOrWalletWindow.types'
import {
  SAddIcon,
  SButton,
  STypographyButtonText,
  STypography,
  PTextBox,
  PTWrapper,
} from '../walletWindows/walletWindows.styles'

export default class SelectExchangeOrWalletWindow extends React.Component<IProps> {
  render() {
    const { theme, toggleWallets } = this.props

    return (
      <PTWrapper background={theme.palette.background.paper}>
        <PTextBox backgroundColor={theme.palette.grey.A400}>
          <STypography color="default" variant="display1">
            Select an exchange or wallet
          </STypography>
          <SButton
            backgroundColor={theme.palette.grey.A400}
            borderColor={theme.palette.secondary.light}
            onClick={toggleWallets}
          >
            <STypographyButtonText> Select </STypographyButtonText>
            <SAddIcon />
          </SButton>
        </PTextBox>
      </PTWrapper>
    )
  }
}
