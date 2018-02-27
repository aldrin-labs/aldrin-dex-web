import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withFormik } from 'formik'
import TextField from 'material-ui/TextField'
import Yup from 'yup'
import Typography from 'material-ui/Typography'
import { graphql } from 'react-apollo'
import Button from 'material-ui/Button'
import gql from 'graphql-tag'

import { KeysList } from './KeysList'

import { Loading } from '@components/Loading'

import { withErrorFallback } from '@hoc'

import * as actions from './actions'
import * as selectors from './selectors'

const STypography = styled(Typography)`
  font-size: 30px !important;
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const WrapField = styled.div`
  margin: 7px;
`

const SettingsForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <FormContainer>
    {' '}
    <STypography>Add new key</STypography>
    <form onSubmit={handleSubmit}>
    <WrapField>
      <TextField
        error={!!errors.exchange}
        id="exchange"
        name="exchange"
        label="exchange"
        value={values.exchange}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="normal"
      />
      </WrapField>
      {/* {touched.exchange && errors.exchange && <div>{errors.exchange}</div>} */}
      <WrapField>
      <TextField
        error={!!errors.publicToken}
        id="publicToken"
        name="publicToken"
        label="Public Token"
        value={values.publicToken}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="normal"
      />
      </WrapField>
      <WrapField>
      <TextField
        error={!!errors.secretToken}
        id="secretToken"
        name="secretToken"
        label="Secret Tokem"
        value={values.secretToken}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="normal"
      />
      </WrapField>
      {/* {touched.token && errors.token && <div>{errors.token}</div>} */}
      <WrapField>
      <TextField
        error={!!errors.name}
        id="name"
        name="name"
        label="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="normal"
      />
      </WrapField>
      <Button type="submit" disabled={isSubmitting}>
        Add key
      </Button>
    </form>
  </FormContainer>
)

const addExchangeKey = gql`
  mutation addExchangeKey(
    $name: String
    $publicToken: String
    $secretToken: String
    $exchange: String
  ) {
    addExchangeKey(name: $name, public: $publicToken, secret: $secretToken, exchange: $exchange) {
      name
    }
  }
`

const ConnectedSettingsForm = compose(
  graphql(addExchangeKey),
  withFormik({
    mapPropsToValues: props => ({
      name: '',
      publicToken: '',
      secretToken: '',
      exchange: '',
    }),

    validationSchema: Yup.object().shape({
      name: Yup.string().required('Enter name'),
      publicToken: Yup.string().required('Enter public token'),
      secretToken: Yup.string().required('Enter secret token'),
      exchange: Yup.string().required('Enter exchange'),
    }),

    handleSubmit: async (
      { name, publicToken, secretToken, exchange },
      { props, setSubmitting, setErrors }
    ) => {
      const { mutate } = props
      console.log(name, publicToken, secretToken, exchange)
      try {
        const mutateRes = await mutate({
          variables: { name, publicToken, secretToken, exchange, date: Date.now() },
        })
        setSubmitting(false)
      } catch (error) {
        setSubmitting(false)
        console.log(error)
      }
    },
  })
)(SettingsForm)

const SettingsWrapper = (props: any) => {
  return (
    <div>
      <KeysList/>
      <ConnectedSettingsForm />
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  check: selectors.checker(state),
})

const mapDispatchToProps = (dispatch: any) => ({
  addExchangeKey111: () => dispatch(actions.addExchangeKey()),
})

export const Settings = compose(connect(mapStateToProps, mapDispatchToProps), withErrorFallback)(
  SettingsWrapper
)
