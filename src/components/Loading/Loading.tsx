import React, { Component, Fragment } from 'react'
import { CircularProgress } from 'material-ui/Progress'
import purple from 'material-ui/colors/purple'
import styled from 'styled-components'

const SpinnerContainer = styled.div`
  margin: ${(props) => (props.margin ? props.margin : '0 auto')};
`

const Spinner = styled(CircularProgress)`
  display: flex;
  align-self: center;
`

export const Loading = ({ size = 64, color = purple[400], margin }) => (
  <SpinnerContainer margin={margin}>
    <Spinner style={{ color }} size={size} />
  </SpinnerContainer>
)
