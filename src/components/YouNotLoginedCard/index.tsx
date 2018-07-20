import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Card, CardContent, Typography } from '@material-ui/core'
import { MdLock } from 'react-icons/lib/md/'

import { Login } from '@containers/Login'
import { IProps, IState } from './index.types'

class LoginCard extends PureComponent<IProps, IState> {
  state = {
    showModal: false,
  }

  render() {
    const { showModalAfterDelay } = this.props
    const { showModal } = this.state

    showModalAfterDelay && showModalAfterDelay > 0
      ? setTimeout(() => {
          this.setState({ showModal: true })
        }, showModalAfterDelay)
      : null

    return (
      <>
        {showModal ? <Login isShownModal /> : null}
        <StyledCard>
          <CardContent>
            <Typography align="center" variant="display4" gutterBottom>
              <MdLock />
            </Typography>
            <Typography
              color="primary"
              align="center"
              variant="title"
              gutterBottom
            >
              You must be LogIn to view this Page
            </Typography>
          </CardContent>
        </StyledCard>
      </>
    )
  }
}

const StyledCard = styled(Card)`
  height: auto;
  width: 20rem;
  margin: auto;
`

export default LoginCard
