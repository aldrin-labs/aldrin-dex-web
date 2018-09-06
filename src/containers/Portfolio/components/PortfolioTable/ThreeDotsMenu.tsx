import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from 'react-icons/lib/md/more-vert'
import styled from 'styled-components'

const options = ['main', 'industry', 'rebalance', 'correlation', 'optimization']

const ITEM_HEIGHT = 48

class LongMenu extends React.Component {
  state = {
    anchorEl: null,
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { anchorEl } = this.state

    return (
      <Container>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              selected={option === 'Pyxis'}
              onClick={() => this.props.onMenuItemClick(option)}
            >
              {option.toUpperCase()}
            </MenuItem>
          ))}
        </Menu>
      </Container>
    )
  }
}

const Container = styled.div`
  display: block;
  padding: 0.75rem;
  margin-top: 0.5rem;

  @media (min-width: 1290px) {
    display: none;
  }
`

export default LongMenu
