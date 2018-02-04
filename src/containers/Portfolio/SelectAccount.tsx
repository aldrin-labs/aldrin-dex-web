import Autorenew from 'material-ui-icons/Autorenew'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import React from 'react'
import styled from 'styled-components'

const SAppBar = styled(AppBar)`
`

const SWrapper = styled.div`
  width: 100%;
  max-width: 360px;
`

class AccountSelector extends React.Component {
  state = {
    checked: [0],
  }

  handleToggle = value => () => {
    const { checked } = this.state
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    this.setState({
      checked: newChecked,
    })
  }

  render() {

    return (
      <SWrapper>
        <SAppBar position="static" color="primary">
          <Toolbar>
            <Typography type="title" color="inherit">
              Accounts & Wallets
            </Typography>
          </Toolbar>
        </SAppBar>
        <List>
          {[0, 1, 2, 3].map(value => (
            <ListItem key={value} dense button onClick={this.handleToggle(value)}>
              <Checkbox checked={this.state.checked.indexOf(value) !== -1} tabIndex={-1} disableRipple />
              <ListItemText primary={`Account ${value + 1}`} />
              <ListItemSecondaryAction>
                <IconButton aria-label="Comments">
                  <Autorenew />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </SWrapper>
    )
  }
}

export const SelectAccount = AccountSelector
