import React, { Component, Fragment } from 'react'
import { CircularProgress } from 'material-ui/Progress'
import purple from 'material-ui/colors/purple'
import styled from 'styled-components'

const SpinnerContainer = styled.div`
  margin: ${(props) => (props.margin ? props.margin : '0 auto')};
  position: ${(props) => (props.centerAligned ? 'absolute' : 'static')};
  top: ${(props) => (props.centerAligned ? 'calc(50% - 32px)' : null)};
  left: ${(props) => (props.centerAligned ? 'calc(50% - 32px)' : null)};
`

const Spinner = styled(CircularProgress)`
  display: flex;
  align-self: center;
`

export const Loading = ({
  size = 64,
  color = purple[400],
  margin = 0,
  centerAligned = false,
}) => (
  <SpinnerContainer margin={margin} centerAligned={centerAligned}>
    <Spinner style={{ color }} size={size} />
  </SpinnerContainer>
)
