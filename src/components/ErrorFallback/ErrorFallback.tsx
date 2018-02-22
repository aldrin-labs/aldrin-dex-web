import React from 'react'
import Typography from 'material-ui/Typography'
import styled from 'styled-components'

const Error = styled(Typography)`
  font-size: 30px !important;
  font-weight: 500;
`

export const ErrorFallback = () => <Error color="error">Error</Error>
