import React from 'react'
import { SAddIcon, SButton, STypographyButtonText, STypography, PTextBox, PTWrapper } from './SelectExchangeOrWalletWindow.styles'


export default class SelectExchangeOrWalletWindow extends React.Component {

  render() {

    const { theme, toggleWallets } = this.props

    return (
      <PTWrapper
        background={theme.palette.background.paper}
      >
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
