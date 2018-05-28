import React, { Fragment } from 'react'
import styled from 'styled-components'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'

const Error = styled(Paper)`
  display: flex;
  width: 100px;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
`

const SimpleError = () => (
  <Typography variant="headline" color="error">
    Error
  </Typography>
)
const RefetchError = (props) => (
  <Fragment>
    <Typography variant="headline" color="error">
      Error! Can't load data. Press button to try again!
    </Typography>
    <Button onClick={props.refetch}>Refetch data</Button>
  </Fragment>
)

export const ErrorFallback = (props: any) => (
  <Error elevation={10}>
    <SimpleError />
  </Error>
)
