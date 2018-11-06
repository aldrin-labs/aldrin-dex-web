import React, { Component, MouseEvent } from 'react'
import { Button } from '@material-ui/core'
import config from '@utils/linkConfig'

export default class Feedback extends Component {
  state = {
    anchorEl: null,
  }

  handleClick = (event: MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  openLink = (link: string = '') => {
    this.handleClose()
    window.open(link, 'CCAI Feedback')
  }

  render() {
    return (
      <>
        <Button
          onClick={() => {
            this.openLink(config.feedbackLink)
          }}
          color="secondary"
          variant="contained"
          size="small"
          style={{ margin: '0.5rem 1rem' }}
        >
          Feedback
        </Button>
        <Button
          onClick={() => {
            this.openLink(config.bugLink)
          }}
          size="small"
          style={{ margin: '0.5rem 1rem' }}
        >
          Report bug
        </Button>
      </>
    )
  }
}
