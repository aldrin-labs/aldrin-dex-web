import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
} from '@material-ui/core'
import privacyPolicy from '@utils/privacyPolicy'

export default ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <Dialog open={open} scroll={'paper'} aria-labelledby="scroll-dialog-title">
    <DialogTitle id="scroll-dialog-title">Privacy Policy</DialogTitle>
    <DialogContent>
      <DialogContentText>{privacyPolicy}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClick} color="secondary">
        Ok
      </Button>
    </DialogActions>
  </Dialog>
)
