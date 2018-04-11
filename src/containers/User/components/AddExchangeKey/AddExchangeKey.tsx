import React from 'react'
import styled from 'styled-components'
import { withFormik } from 'formik'
import Yup from 'yup'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import { InputLabel } from 'material-ui/Input'

import * as API from '../../api'

const MIN_CHAR = 3

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
)

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    apiKey: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    secret: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    exchange: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
  }),
  mapPropsToValues: (props: any) => ({
    name: '',
    apiKey: '',
    secret: '',
    exchange: '',
  }),
  handleSubmit: async (
    values,
    { props: { addExchangeKey }, setSubmitting }
  ) => {
    const variables = {
      ...values,
      exchange: values.exchange.toLowerCase(),
      date: Date.now(),
    }
    try {
      await addExchangeKey({ variables })
      console.log(variables)

      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  },
})

const AddExchangeKeyComponent = ({
  values,
  touched,
  dirty,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
  setFieldValue,
  setFieldTouched,
  isSubmitting,
  getExchangesList,
}: any) => (
  <SPaper>
    <Typography variant="title">Add new key</Typography>
    <FormContainer onSubmit={handleSubmit}>
      <STextField
        error={touched.name && !!errors.name}
        id="name"
        name="name"
        label="Name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter key name here..."
        type="text"
        margin="normal"
        helperText={
          touched.name && errors.name && <FormError>{errors.name}</FormError>
        }
      />
      <STextField
        error={touched.apiKey && !!errors.apiKey}
        id="apiKey"
        name="apiKey"
        label="API Key"
        value={values.apiKey}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter API key here..."
        type="text"
        margin="normal"
        helperText={
          touched.apiKey &&
          errors.apiKey && <FormError>{errors.apiKey}</FormError>
        }
      />
      <STextField
        error={touched.secret && !!errors.secret}
        id="secret"
        name="secret"
        label="Secret"
        value={values.secret}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter secret key here..."
        type="text"
        margin="normal"
        helperText={
          touched.secret &&
          errors.secret && <FormError>{errors.secret}</FormError>
        }
      />
      <SExchangeSelect>
        <InputLabel htmlFor="exchange">Exchange</InputLabel>
        <Select
          value={values.exchange}
          onChange={handleChange}
          inputProps={{
            name: 'exchange',
            id: 'exchange',
          }}
        >
          {console.log(values)}
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {console.log(getExchangesList)}
          {!getExchangesList.loading &&
            getExchangesList.exchangePagination.items.map(({ _id, name }) => (
              <MenuItem key={_id} value={name}>
                {name}
              </MenuItem>
            ))}
        </Select>
      </SExchangeSelect>
      <Button type="submit" disabled={!dirty || isSubmitting}>
        Add key
      </Button>
    </FormContainer>
  </SPaper>
)

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const STextField = styled(TextField)`
  align-self: center;
  margin: 5px;
  width: 80%;
`

const SExchangeSelect = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  margin: 30px 5px 5px 5px;
  width: 80%;
`

const SPaper = styled(Paper)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 8px 0px 0px 8px;
  max-height: 500px;
  min-height: 500px;
  padding: 15px;
  width: 300px;
`

export const AddExchangeKey = compose(
  graphql(API.addExchangeKeyMutation, { name: 'addExchangeKey' }),
  graphql(API.getExchangesListQuery, { name: 'getExchangesList' }),
  formikEnhancer
)(AddExchangeKeyComponent)
