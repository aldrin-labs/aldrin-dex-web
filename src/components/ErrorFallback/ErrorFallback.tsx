import React, { Fragment } from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { ApolloError } from 'apollo-client'
import { MASTER_BUILD } from '@utils/config'

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

      return 'You are not authorized, click Log In and then refresh the page.'
      break

    default:
      break
  }

  return errorMessage
}

export const CustomError = (props: {
  error?: string
  children?: React.ReactNode
}) => (
  <Error>
    <Typography variant="h5" color="error">
      {props.error || props.children || 'Error'}
    </Typography>
  </Error>
)

const SimpleError = (props: { error?: ApolloError }) => (
  <Typography variant="h5" color="error">
    {props.error ? FormatErrorToUser(props.error.message) : 'Error'}
  </Typography>
)
const RefetchError = (props: { error?: ApolloError; refetch: Function }) => (
  <Fragment>
    <Typography variant="h5" color="error">
      {props.error ? props.error.message : 'Error'}
    </Typography>
    <Button onClick={props.refetch}>Refetch data</Button>
  </Fragment>
)

const ErrorWithoutMessage = () => (
  <Typography variant="body1" align="center" color="error">
    {
      'Oops looks like we broke it somehow! 🙈 We are working on this. Please refresh the page or contact the support.'
    }
  </Typography>
)

export const ErrorFallback = (props: {
  error?: ApolloError
  refetch?: Function
}) => (
  <Error style={{ margin: 'auto' }} elevation={10}>
    {MASTER_BUILD ? <ErrorWithoutMessage /> : <SimpleError {...props} />}
  </Error>
)
