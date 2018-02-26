import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withFormik } from 'formik'
import Yup from 'yup'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Loading } from '@components/Loading'

import { withErrorFallback } from '@hoc'

import * as actions from './actions'
import * as selectors from './selectors'

const InnerForm = (
  { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting },
  props
) => (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      name="exchange"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.exchange}
    />
    {touched.exchange && errors.exchange && <div>{errors.exchange}</div>}
    <input type="text" name="key" onChange={handleChange} onBlur={handleBlur} value={values.key} />
    {touched.key && errors.key && <div>{errors.key}</div>}
    <button type="submit" disabled={isSubmitting}>
      Add key
    </button>
  </form>
)

const addExchangeKey = gql`
  mutation addExchangeKey($exchange: String!, $key: String!) {
    addExchangeKey(exchange: $exchange, key: $key)
  }
`

const MyForm = withFormik({
  mapPropsToValues: props => ({
    exchange: '',
    key: '',
  }),

  validationSchema: Yup.object().shape({
    exchange: Yup.string().required('Enter exchange'),
    key: Yup.string().required('Enter key'),
  }),

  handleSubmit: (
    { exchange, key },
    { props, setSubmitting, setErrors /* setValues, setStatus, and other goodies */ }
  ) => {
    console.log(exchange, key, props.mutate)
    props.mutate({
      variables: { exchange, key },
    })
    .then(({ data }) => {
      console.log(data)
    })
    .catch((error) => {
      console.log(error)
    })
  },
})(InnerForm)

const UserComp = (props: any) => {
  return (
    <div>
      Hello <button onClick={() => console.log(props)}>Test</button>
      {/* <Loading /> */}
      <MyForm mutate={props.mutate} />
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  check: selectors.checker(state),
})

const mapDispatchToProps = (dispatch: any) => ({
  addExchangeKey111: () => dispatch(actions.addExchangeKey()),
})

export const Settings = compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(addExchangeKey),
  withErrorFallback
)(UserComp)
