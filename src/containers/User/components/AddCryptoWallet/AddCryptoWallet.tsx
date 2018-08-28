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
import { InputLabel } from 'material-ui/Input'
import SelectWalletList from '@components/SelectWalletList/SelectWalletList'

import * as API from '@containers/User/api'

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
    address: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    asset: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
  }),
  mapPropsToValues: (props: any) => ({
    name: '',
    address: '',
    asset: '',
  }),
  handleSubmit: async (
    values,
    { props: { addCryptoWallet }, setSubmitting }
  ) => {
    const variables = {
      address: values.address,
      assetName: values.asset,
      name: values.name,
      //      date: Date.now(),
    }

    try {
      await addCryptoWallet({
        variables,
        update: (proxy, { data: { addCryptoWallet } }) => {
          const proxyData = proxy.readQuery({ query: API.getCryptoWalletsQuery })
          proxyData.getProfile.cryptoWallets.push(addCryptoWallet)
          proxy.writeQuery({ query: API.getCryptoWalletsQuery, data: proxyData })
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

class AddCryptoWalletComponent extends React.Component {
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
    } = this.props

    return (
      <SPaper>
        <Typography variant="title">Add new crypto wallet</Typography>
        <FormContainer onSubmit={handleSubmit}>
          <STextField
            error={touched.name && !!errors.name}
            id="name"
            name="name"
            label="Name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter cryptoWallet name here..."
            type="text"
            margin="normal"
            helperText={
              touched.name &&
              errors.name && <FormError>{errors.name}</FormError>
            }
          />
          <STextField
            error={touched.address && !!errors.address}
            id="address"
            name="address"
            label="Address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter wallet address here..."
            type="text"
            margin="normal"
            helperText={
              touched.address &&
              errors.address && <FormError>{errors.address}</FormError>
            }
          />
          <SSelect>
            <InputLabel htmlFor="asset">Wallet</InputLabel>
            <SelectWalletList
              isClearable
              onChange={this.handleSelectChangePrepareForFormik.bind(this, 'asset')}
            />
          </SSelect>

          <Button type="submit" disabled={!dirty || isSubmitting}>
            Add cryptoWallet
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

const SSelect = styled.div`
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

export const AddCryptoWallet = compose(
  graphql(API.addCryptoWalletMutation, { name: 'addCryptoWallet' }),
  formikEnhancer
)(AddCryptoWalletComponent)
