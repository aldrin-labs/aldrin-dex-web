import Delete from 'material-ui-icons/Delete'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import React from 'react'
import styled from 'styled-components'
import TextField from 'material-ui/TextField'

const SWrapper = styled.div`
  width: 100%;
  max-width: 360px;
`

export class ProfileKeys extends React.Component {
  state = {
    checked: [0],
    APIKeys: [{ id: 1, name: 'Kukoin', key: 'djawk77datcwahdkaw' }, { id: 2, name: 'Rekoin', key: 'DJjcslakcaslkwa' }],
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

  deleteAPIKey = name = e => {
    console.log(111, name, e.target.value)
  }
  render() {
    const { APIKeys } = this.state
    return (
      <SWrapper>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography type="title" color="inherit">
              API Keys
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {APIKeys.map(({ id, name, key }) => (
            <ListItem key={id} dense button>
              {/* <Checkbox checked={this.state.checked.indexOf(value) !== -1} tabIndex={-1} disableRipple /> */}
              <ListItemText primary={name} secondary={key} />
              <ListItemSecondaryAction>
                <IconButton aria-label="Comments">
                  <Delete name={'naruta'} onClick={this.deleteAPIKey} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <input />
        </List>
      </SWrapper>
    )
  }
}
