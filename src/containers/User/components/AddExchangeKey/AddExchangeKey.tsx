import * as React from 'react'
import styled from 'styled-components'
import { withFormik } from 'formik'
import Yup from 'yup'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import InputLabel from '@material-ui/core/InputLabel'

import * as API from '@containers/User/api'
import SelectExchangeList from '@components/SelectExchangeList/SelectExchangeList'
import { handleSelectChangePrepareForFormik } from '@utils/UserUtils'

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
    secretOfApiKey: Yup.string()
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
    secretOfApiKey: '',
    exchange: '',
  }),
  handleSubmit: async (values, { props, setSubmitting }) => {
    const variables = {
      name: values.name,
      apiKey: values.apiKey,
      secret: values.secretOfApiKey,
      exchange: values.exchange.toLowerCase(),
      date: Math.round(+Date.now() / 1000),
    }

    try {
      await props.addExchangeKey({
        variables,
        update: (proxy, { data: { addExchangeKey } }) => {
          const proxyData = proxy.readQuery({ query: API.getKeysQuery })
          proxyData.myPortfolios[0].keys.push(addExchangeKey)
          proxy.writeQuery({ query: API.getKeysQuery, data: proxyData })
        },
      })

      props.forceUpdateUserContainer()
      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  },
})

class AddExchangeKeyComponent extends React.Component {
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

    return (
      <SPaper>
        <Typography variant="title">Add new key</Typography>
        <FormContainer onSubmit={handleSubmit} autoComplete="new-password">
          <input type="hidden" value="something" />

          <STextField
            error={touched.name && !!errors.name}
            id="name"
            name="name"
            label="Name"
            autoComplete="off"
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
          {/* https://medium.com/paul-jaworski/turning-off-autocomplete-in-chrome-ee3ff8ef0908 */}
          <input type="hidden" value="something" />
          <STextField
            error={touched.apiKey && !!errors.apiKey}
            id="apiKey"
            type="text"
            name="apiKey"
            label="API Key"
            autoComplete="off"
            value={values.apiKey}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter API key here..."
            margin="normal"
            helperText={
              touched.apiKey &&
              errors.apiKey && <FormError>{errors.apiKey}</FormError>
            }
          />
          <STextField
            error={touched.secretOfApiKey && !!errors.secretOfApiKey}
            id="secretOfApiKey"
            name="secretOfApiKey"
            label="Secret"
            autoComplete="off"
            value={values.secretOfApiKey}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter secret key here..."
            type="text"
            margin="normal"
            helperText={
              touched.secretOfApiKey &&
              errors.secretOfApiKey && <FormError>{errors.secretOfApiKey}</FormError>
            }
          />
          <SExchangeSelect>
            <InputLabel htmlFor="exchange">Exchange</InputLabel>
            <SelectExchangeList
              isClearable={true}
              onChange={handleSelectChangePrepareForFormik.bind(
                this,
                'exchange'
              )}
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
  min-height: 50px;
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
  formikEnhancer
)(AddExchangeKeyComponent)
