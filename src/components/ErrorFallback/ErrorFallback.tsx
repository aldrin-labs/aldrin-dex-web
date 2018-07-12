import React, { Fragment } from 'react'
import styled from 'styled-components'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import { ApolloError } from 'apollo-client'

const Error = styled(Paper)`
  display: flex;
  padding: 15px;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
`

const FormatErrorToUser = (errorMessage: string) => {
  switch (errorMessage) {
    case 'GraphQL error: You must supply a JWT for authorization!':
      console.log(errorMessage)

      return 'You not authorized, click Log In and then return back.'
      break

    default:
      break
  }

  return errorMessage
}

export const CustomError = (props: { error?: string }) => (
  <Typography variant="headline" color="error">
    {props.error || 'Error'}
  </Typography>
)

const SimpleError = (props: { error?: ApolloError }) => (
  <Typography style={{ margin: 'auto' }} variant="headline" color="error">
    {props.error ? FormatErrorToUser(props.error.message) : 'Error'}
  </Typography>
)
const RefetchError = (props: { error?: ApolloError; refetch: Function }) => (
  <Fragment>
    <Typography variant="headline" color="error">
      {props.error ? props.error.message : 'Error'}
    </Typography>
    <Button onClick={props.refetch}>Refetch data</Button>
  </Fragment>
)

export const ErrorFallback = (props: {
  error?: ApolloError
  refetch?: Function
}) => (
  <Error elevation={10}>
    <SimpleError {...props} />
  </Error>
)
