import React from 'react'
import styled from 'styled-components'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'

const Error = styled(Paper)`
  display: flex;
  width: 100px;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
`

export const ErrorFallback = () => (
  <Error elevation={10}>
  <Typography variant="headline" color="error">
    Error
  </Typography>
  </Error>
)
