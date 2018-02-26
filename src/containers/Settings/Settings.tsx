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
  Exchange
    <input
      type="text"
      name="exchange"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.exchange}
    />
    {touched.exchange && errors.exchange && <div>{errors.exchange}</div>}
    Token
    <input type="text" name="token" onChange={handleChange} onBlur={handleBlur} value={values.token} />
    {touched.token && errors.token && <div>{errors.token}</div>}
    Name
    <input type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
    <button type="submit" disabled={isSubmitting}>
      Add key
    </button>
  </form>
)

const addExchangeKey = gql`
  mutation addExchangeKey($exchange: String, $token: String, $name: String) {
    addExchangeKey(exchange: $exchange, token: $token, name: $name) {
      name
    }
  }
`

const MyForm = withFormik({
  mapPropsToValues: props => ({
    exchange: '',
    token: '',
    name: '',
  }),

  validationSchema: Yup.object().shape({
    exchange: Yup.string().required('Enter exchange'),
    token: Yup.string().required('Enter token'),
  }),

  handleSubmit: (
    { name, token, exchange },
    { props, setSubmitting, setErrors }
  ) => {
    console.log(name, token, exchange, props.mutate)
    props.mutate({
      variables: { name, token, exchange, date: Date.now() },
    })
    .then((res) => {
      console.log(res)
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
