import React from 'react'
import { withFormik } from 'formik'
import Yup from 'yup'
import { compose, withStateHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import * as R from 'ramda'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'

import { deleteCryptoWalletMutation, getCryptoWalletsQuery } from '@containers/User/api'

const DeleteCryptoWalletDialogComponent = ({
  handleClickOpen,
  handleClose,
  open,
  wallet = null,
  handleChange,
  values,
  handleSubmit,
  errors,
}) => (
    <div>
      <Button onClick={handleClickOpen}>Delete</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete crypto wallet {wallet.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To delete crypto wallet please enter it's name:
        </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="cryptoWalletNameInput"
            name="cryptoWalletNameInput"
            label="CryptoWallet name"
            onChange={handleChange}
            value={values.cryptoWalletNameInput}
            error={errors && !!errors.cryptoWalletNameInput}
            type="text"
            fullWidth
          />
          <Typography color="error">{errors.cryptoWalletNameInput}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
        </Button>
          <Button onClick={handleSubmit} color="primary">
            Delete
        </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

const formikDialog = withFormik({
  validationSchema: Yup.object().shape({
    cryptoWalletNameInput: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    cryptoWalletNameInput: '',
  }),
  handleSubmit: async ({ cryptoWalletNameInput }, props: any) => {
    const { wallet, handleClose, deleteCryptoWallet } = props.props

    const variables = {
      address: wallet.address,
      assetName: wallet.baseAsset.name,
    }
    const checkCryptoWalletName = R.equals(wallet.name, cryptoWalletNameInput)

    if (checkCryptoWalletName) {
      try {
        props.setSubmitting(true)
        await deleteCryptoWallet({
          variables,
          update: (proxy, { data: { deleteCryptoWallet } }) => {
            let proxyData = proxy.readQuery({ query: getCryptoWalletsQuery })
            const cryptoWallets = proxyData.getProfile.cryptoWallets.slice()
            const index = cryptoWallets.findIndex((v) => v._id === deleteCryptoWallet._id)
            cryptoWallets.splice(index, 1)
            proxyData = {
              ...proxyData,
              getProfile: { ...proxyData.getProfile, cryptoWallets },
            }
            proxy.writeQuery({ query: getCryptoWalletsQuery, data: proxyData })
          },
        })
        await handleClose()
      } catch (error) {
        console.log(error)
        props.setFieldError('cryptoWalletNameInput', 'Request error!')
        props.setSubmitting(false)
      }
    } else {
      props.setFieldError('cryptoWalletNameInput', 'CryptoWallet name error! Check again!')
    }
  },
})

const handleState = withStateHandlers(
  ({ open = false }) => ({
    open,
  }),
  {
    handleClickOpen: () => () => ({
      open: true,
    }),
    handleClose: () => () => ({
      open: false,
    }),
  }
)

export const DeleteCryptoWalletDialog = compose(
  graphql(deleteCryptoWalletMutation, { name: 'deleteCryptoWallet' }),
  graphql(getCryptoWalletsQuery),
  handleState,
  formikDialog
)(DeleteCryptoWalletDialogComponent)
