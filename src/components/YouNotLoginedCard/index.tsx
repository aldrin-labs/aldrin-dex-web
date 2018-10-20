import React, { PureComponent } from 'react'
import { CardContent, Typography } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import { StyledDialog, StyledCard, MdLockStyled } from './index.styles'
import { Login } from '@containers/Login'
import { IProps, IState } from '@components/YouNotLoginedCard/index.types'
class LoginCard extends PureComponent<IProps, IState> {
  state = {
    showModal: false,
  }

  render() {
    const {
      showModalAfterDelay,
      theme: {
        palette: { secondary },
      },
      open,
    } = this.props
    const { showModal } = this.state

    showModalAfterDelay && showModalAfterDelay > 0
      ? setTimeout(() => {
          this.setState({ showModal: true })
        }, showModalAfterDelay)
      : null

    return (
      <>
        {showModal ? (
          <Login mainColor={secondary.main} isShownModal={true} />
        ) : null}
        <StyledDialog
          open={open}
          BackdropProps={{ style: { display: 'none' } }}
        >
          <StyledCard>
            <CardContent>
              <Typography align="center" variant="h1" gutterBottom={true}>
                <MdLockStyled />
              </Typography>
              <Typography
                color="textPrimary"
                align="center"
                variant="h4"
                gutterBottom={true}
              >
                Hello there, welcome to cryptocurrencies.ai👐
              </Typography>
              <Typography
                color="textSecondary"
                align="center"
                variant="h6"
                gutterBottom={true}
              >
                You must login to view this page
              </Typography>
            </CardContent>
          </StyledCard>
        </StyledDialog>
      </>
    )
  }
}

const mapStateToProps = (store: any) => ({
  login: store.login.loginStatus,
  openMessage: store.login.modalIsOpen,
})

export default compose(
  withTheme(),
  connect(mapStateToProps)
)(LoginCard)
