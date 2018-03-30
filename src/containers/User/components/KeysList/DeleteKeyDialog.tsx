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

import { deleteExchangeKeyMutation } from '../../api'

const DeleteKeyDialogComponent = ({
  handleClickOpen,
  handleClose,
  open,
  keyName = 'none',
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
      <DialogTitle id="form-dialog-title">Delete key {keyName}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To delete key please enter it's name:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="keyNameInput"
          name="keyNameInput"
          label="Key name"
          onChange={handleChange}
          value={values.keyNameInput}
          error={errors && !!errors.keyNameInput}
          type="text"
          fullWidth
        />
        <Typography color="error">{errors.keyNameInput}</Typography>
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
    keyNameInput: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    keyNameInput: '',
  }),
  handleSubmit: async ({ keyNameInput }, props) => {
    const { keyName, handleClose, deleteExchangeKey } = props.props
    const variables = {
      name: keyNameInput,
      removeTrades: true
    }
    const checkKeyName = R.equals(keyName, keyNameInput)

    if (checkKeyName) {
      try {
        props.setSubmitting(true)
        await deleteExchangeKey({ variables })
        await handleClose()
      } catch (error) {
        console.log(error)
        props.setFieldError('keyNameInput', 'Request error!')
        props.setSubmitting(false)
      }
    } else {
      props.setFieldError('keyNameInput', 'Key name error! Check again!')
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

export const DeleteKeyDialog = compose(
  graphql(deleteExchangeKeyMutation, { name: 'deleteExchangeKey' }),
  handleState,
  formikDialog
)(DeleteKeyDialogComponent)
