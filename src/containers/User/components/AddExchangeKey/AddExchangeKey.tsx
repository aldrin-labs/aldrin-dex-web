import * as React from 'react'
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

import * as API from '@containers/User/api'
import ReactSelectComponent from '@components/ReactSelectComponent'

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
      await addExchangeKey({
        variables,
        update: (proxy, { data: { addExchangeKey } }) => {
          const proxyData = proxy.readQuery({ query: API.getKeysQuery })
          proxyData.getProfile.keys.push(addExchangeKey)
          proxy.writeQuery({ query: API.getKeysQuery, data: proxyData })
        },
      })
      console.log(variables)

      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  },
})

class AddExchangeKeyComponent extends React.Component {
  handleSelectChangePrepareForFormik = (name: string, optionSelected: { label: string; value: string }) => {
    const { setFieldValue } = this.props
    const value = optionSelected ? optionSelected.value : ''
    setFieldValue(name, value);
  }
  render() {
    const {
      values,
      touched,
      dirty,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      isSubmitting,
      getExchangesForKeysList,
    } = this.props

    const { loading, exchangePagination } = getExchangesForKeysList

    const exchangeOptions = !loading && exchangePagination && exchangePagination.items
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name }) => ({
        label: name,
        value: name,
      }))

    return (
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
              touched.name &&
              errors.name && <FormError>{errors.name}</FormError>
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

            {/*<Select*/}
              {/*value={values.exchange}*/}
              {/*onChange={handleChange}*/}
              {/*inputProps={{*/}
                {/*name: 'exchange',*/}
                {/*id: 'exchange',*/}
              {/*}}*/}
            {/*>*/}
              {/*<MenuItem value="">*/}
                {/*<em>None</em>*/}
              {/*</MenuItem>*/}

              {/*{!loading &&*/}
                {/*exchangePagination &&*/}
                {/*exchangePagination.items.slice().sort((a,b) => a.name.localeCompare(b.name)).map(({ _id, name }) => (*/}
                  {/*<MenuItem key={_id} value={name}>*/}
                    {/*{name}*/}
                  {/*</MenuItem>*/}
                {/*))}*/}
            {/*</Select>*/}
            <SelectR
              isClearable
              placeholder=""
              options={exchangeOptions || []}
              onChange={this.handleSelectChangePrepareForFormik.bind(this, 'exchange')}
            />

          </SExchangeSelect>

          <Button type="submit" disabled={!dirty || isSubmitting}>
            Add key
          </Button>
        </FormContainer>
      </SPaper>
    )
  }
}

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

// TODO: Replace it with one in styles.js
const SelectR = styled(ReactSelectComponent)`
  font-family: Roboto;
  font-size: 16px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
  }
`

export const AddExchangeKey = compose(
  graphql(API.addExchangeKeyMutation, { name: 'addExchangeKey' }),
  graphql(API.getExchangesForKeysListQuery, {
    name: 'getExchangesForKeysList',
  }),
  formikEnhancer
)(AddExchangeKeyComponent)
