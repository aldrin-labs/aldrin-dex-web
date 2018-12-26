import React from 'react'
import styled from 'styled-components'
import { Card, Grid, IconButton, CardContent } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

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

export const BtnsWrapper = styled(Grid)`
  display: flex;
  flex-direction: column;
`

export const IconButtonWithHover = styled(IconButton)`
  will-change: color;

  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }

  && {
    padding: 0.25rem;
  }
`

export const Label = styled(Typography)`
  padding: 6px 6px 6px 6px;
  margin-bottom: 15px;
  font-size: 0.875rem;
  background-color: #263238;
  font-weight: bold;
  white-space: nowrap;
  text-transform: uppercase;
`
