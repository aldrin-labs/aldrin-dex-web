import React from 'react'
import {
  Dialog,
  IconButton,
  Button,
  Typography,
  Slide,
  DialogActions,
  DialogContent,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { connect } from 'react-redux'
import { toggleMobilePopup } from '@containers/App/actions'

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  )
}

const Transition = (props: any) => {
  return <Slide direction="up" {...props} />
}

const PopUp = ({
  mobilePopup,
  togglePopUp,
}: {
  mobilePopup: boolean
  togglePopUp: () => void
}) => {
  return (
    <Dialog
      css={`
        opacity: 0.75;
      `}
      TransitionComponent={Transition}
      fullScreen
      open={isMobileDevice() && mobilePopup}
    >
      <DialogContent
        css={`
          display: flex;
          flex-direction: column;
          place-items: center;
          place-content: center;
        `}
      >
        <IconButton
          css={`
            align-self: end;
          `}
          color="secondary"
          onClick={togglePopUp}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
        <Typography color="error" variant="h2">
          We are currently in beta and don't support your screen resolution.
          Please open the desktop version of this page.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" size="large" onClick={togglePopUp}>
          okay
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = (store: any) => ({
  themeMode: store.ui.theme,
  mobilePopup: store.ui.mobilePopup,
  chartPageView: store.chart.view,
})

const mapDispatchToProps = (dispatch: any) => ({
  togglePopUp: () => dispatch(toggleMobilePopup()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopUp)
