import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Card, CardContent, Typography, Dialog } from '@material-ui/core'
import MdLock from '@material-ui/icons/Lock'
import withTheme from '@material-ui/core/styles/withTheme'

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
        <Dialog open={true}>
          <StyledCard>
            <CardContent>
              <Typography align="center" variant="h1" gutterBottom={true}>
                <MdLockStyled />
              </Typography>
              <Typography
                color="error"
                align="center"
                variant="h4"
                gutterBottom={true}
              >
                You must login to view this page
              </Typography>
            </CardContent>
          </StyledCard>
        </Dialog>
      </>
    )
  }
}

const StyledCard = styled(Card)`
  height: auto;
  width: 20rem;
  grid-column: 2;
  margin: auto;
`
const MdLockStyled = styled(MdLock)`
  width: 80%;
  height: 80%;
`

export default withTheme()(LoginCard)
