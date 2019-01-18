import React from 'react'
import config from '@core/utils/linkConfig'
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core'

const DialogComponent = ({
  openWarning,
  warningMessage,
  isSaveError,
  isSystemError,
  isCurrentAssetsChanged,
  hideWarning,
  onSaveClick,
  openLink,
  onReset,
  createNewSnapshot,
}) => (
  <Dialog
    fullScreen={false}
    open={openWarning}
    aria-labelledby="responsive-dialog-title"
  >
    <DialogTitle id="responsive-dialog-title">{warningMessage}</DialogTitle>
    <DialogActions>
      {isSaveError && (
        <>
          <Button
            onClick={() => {
              hideWarning()
              onSaveClick()
            }}
            color="secondary"
            autoFocus={true}
          >
            Save anyway
          </Button>
          <Button
            onClick={() => {
              hideWarning()
              onSaveClick(true)
            }}
            size="small"
            style={{ margin: '0.5rem 1rem' }}
          >
            Delete empty and save
          </Button>
        </>
      )}
      {isSystemError && (
        <>
          <Button onClick={hideWarning} color="secondary" autoFocus={true}>
            ok
          </Button>
          <Button
            onClick={() => {
              openLink(config.bugLink)
            }}
            size="small"
            style={{ margin: '0.5rem 1rem' }}
          >
            Report bug
          </Button>
        </>
      )}
      {isCurrentAssetsChanged && (
        <Button
          id="resetRebalancedPortfolioButton"
          onClick={() => {
            onReset(null, true)
            createNewSnapshot()
            hideWarning()
          }}
          color="secondary"
          autoFocus={true}
        >
          Reset my rebalanced portfolio and update snapshot
        </Button>
      )}
    </DialogActions>
  </Dialog>
)

export default DialogComponent
