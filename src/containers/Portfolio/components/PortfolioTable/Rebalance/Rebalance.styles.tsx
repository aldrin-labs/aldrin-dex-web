import React from 'react'
import styled from 'styled-components'
import { Card, Grid, IconButton, CardContent } from '@material-ui/core'

export { ChartWrapper, ChartContainer, Chart, Container }

const ChartWrapper = styled(({ isEditModeEnabled, ...rest }) => (
  <Grid {...rest} />
))`
  display: flex;
  position: relative;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  height: 45%;
  && {
    padding-bottom: 0;
  }
`

const ChartContainer = styled(Card)`
  && {
    height: 100%;
    width: 100%;
  }
`

//  minus card header height
const Chart = styled(({background, ...rest}) => (
  <CardContent {...rest} />
))`
  background: ${(props: { background: string }) => props.background};
  width: 100%;
  height: calc(100% - 68px);
  && {
    padding: 0.5rem 0.5rem 0 0.5rem;
  }
`

const Container = styled(({ isEditModeEnabled, ...rest }) => (
  <Grid {...rest} />
))`
  justify-content: ${(props: { isEditModeEnabled: boolean }) =>
    props.isEditModeEnabled ? 'space-between' : 'left'};

  max-height: 55%;
`
