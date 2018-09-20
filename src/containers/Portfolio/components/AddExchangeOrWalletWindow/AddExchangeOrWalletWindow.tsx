import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import { customAquaScrollBar } from '@styles/cssUtils'

const MyLinkToUserSettings = (props: object) => <Link to="/user" {...props} />

export default class AddExchangeOrWalletWindow extends React.Component {

  render() {

    const { theme } = this.props

    return (
      <PTWrapper
        background={theme.palette.background.paper}
      >
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

const PTWrapper = styled.div`
  width: ${(props: { tableData?: boolean }) =>
  props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: ${(props: { background: string }) => props.background};
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
  overflow-y: auto;
  @media (max-width: 840px) {
    margin: 1.5rem auto;
  }

  @media (max-width: 550px) {
    width: calc(100% - 90px);
    margin: 0.625rem auto;
  }

  @media (max-width: 425px) {
    width: calc(100% - 20px);
  }

  ${customAquaScrollBar};
`

const PTextBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vh;
  min-width: 400px;
  min-height: 350px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props: { backgroundColor: string }) =>
  props.backgroundColor};
`

const STypography = styled(Typography)`
  text-align: center;
  margin-bottom: 3rem;
`

const STypographyButtonText = styled(Typography)`
  font-weight: 500;
`

const SButton = styled(Button)`
  padding-right: 11px;
  border-color: transparent;
  border-radius: 3px;
  background-color: transparent;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  box-sizing: border-box;
  border: 1px solid;

  &&:hover {
    border-color: ${(props: { borderColor: string }) => props.borderColor};
    background-color: ${(props: { backgroundColor: string }) =>
  props.backgroundColor};
  }

  && > span {
    display: flex;
    justify-content: space-between;
  }
`

const SAddIcon = styled(AddIcon)`
  font-size: 18px;
`
