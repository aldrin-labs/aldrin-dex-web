import React, { Component, MouseEvent } from 'react'
import Icon from '@material-ui/icons/FeedbackOutlined'
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core'

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
    const { anchorEl } = this.state

    return (
      <>
        <Tooltip enterDelay={300} title="Feedback">
          <IconButton
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <Icon />
          </IconButton>
        </Tooltip>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={() => {
              this.openLink('https://ccai.typeform.com/to/CoUVp3')
            }}
          >
            Give Feedback
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.openLink('https://ccai.typeform.com/to/NqojKr')
            }}
          >
            <Typography variant="body1" color="error">
              Report bug
            </Typography>
          </MenuItem>
        </Menu>
      </>
    )
  }
}
