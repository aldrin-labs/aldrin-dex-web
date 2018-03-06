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
import { FormControl, FormHelperText } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'

import * as API from './api'

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const STextField = styled(TextField)`
  width: 80%;
  margin: 5px;
  align-self: center;
`

const SExchangeSelect = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 30px 5px 5px 5px;
  align-self: center;
`

const SPaper = styled(Paper)`
  display: flex;
  width: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  max-height: 425px;
  margin: 24px 0px 0px 12px;
`

const FormError = ({ children }: any) => <Typography color="error">{children}</Typography>

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
  mapPropsToValues: (props: any) => ({
    name: '',
    apiKey: '',
    secret: '',
    exchange: '',
  }),
  handleSubmit: async (values, { props: { addExchangeKey }, setSubmitting}) => {
    const variables = {
      ...values,
      date: Date.now(),
    }
    try {
      await addExchangeKey({ variables })
      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  },
})

const AddExchangeKeyForm = ({
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
  getExchangesList
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
        helperText={touched.name && errors.name && <FormError>{errors.name}</FormError>}
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
        helperText={touched.apiKey && errors.apiKey && <FormError>{errors.apiKey}</FormError>}
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
        helperText={touched.secret && errors.secret && <FormError>{errors.secret}</FormError>}
      />
      {/* <STextField
        error={touched.exchange && !!errors.exchange}
        id="exchange"
        name="exchange"
        label="Exchange"
        value={values.exchange}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter exchange name here..."
        type="text"
        margin="normal"
        helperText={touched.exchange && errors.exchange && <FormError>{errors.exchange}</FormError>}
      /> */}
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
          {console.log(2222, values)}
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

export const AddExchangeKey = compose(
  graphql(API.addExchangeKeyMutation, { name: 'addExchangeKey' }),
  graphql(API.getExchangesListQuery, { name: 'getExchangesList' }),
  formikEnhancer
)(AddExchangeKeyForm)
