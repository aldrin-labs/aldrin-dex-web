import React from 'react'
import styled from 'styled-components'
import { Formik, withFormik } from 'formik'
import Yup from 'yup'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import TextField from 'material-ui/TextField'

/*
  TODO:
    add forms
    add validation
    add labels
    add margins
    add selector for exchange
*/

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required()
      .min(3)
      .trim(),
    apiKey: Yup.string()
      .required()
      .min(3)
      .trim(),
    secret: Yup.string()
      .required()
      .min(3)
      .trim(),
    exchange: Yup.string()
      .required()
      .min(3)
      .trim(),
  }),
  mapPropsToValues: props => ({
    name: '',
    apiKey: '',
    secret: '',
    exchange: '',
  }),
  handleSubmit: async (values, { props: { mutate }, setSubmitting }) => {
    const variables = {
      ...values,
      date: Date.now()
    }

    try {
      await mutate({ variables })
      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  }
})

const AddExchangeKeyForm = ({
  values,
  touched,
  dirty,
  errors,
  handleChange,
  handleSubmit,
  handleReset,
  setFieldValue,
  setFieldTouched,
  isSubmitting
}: any) => (

)

export const AddExchangeKey = compose(
  formikEnhancer
)(AddExchangeKeyForm)
