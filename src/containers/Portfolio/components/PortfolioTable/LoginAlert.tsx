import React from 'react'
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import { Link } from 'react-router-dom'
import { IProps, IState } from 'LoginAlert.types'
export class LoginAlert extends React.Component<IProps, IState> {
  state = {
    open: true,
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    return (
      <div>
        <Dialog
          open={true}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'You need to login first!'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              To see your portfolio you need to login first
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link to={'/'}>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                Back to main
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
