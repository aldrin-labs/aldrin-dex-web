import Autorenew from 'material-ui-icons/Autorenew'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import * as actions from '../../actions'
import * as API from './api'

const SAppBar = styled(AppBar)`
`

const SWrapper = styled.div`
  width: 100%;
  max-width: 360px;
`

const SelectTitle = styled(Typography)`
  letter-spacing: 0.5px;
  font-size: 20px !important;
`

class AccountSelector extends React.Component {

  handleToggle = (value: any) => () => {
    const { selectedAccounts } = this.props
    const currentIndex = selectedAccounts.indexOf(value)
    const newChecked = [...selectedAccounts]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    console.log(this.props.keys.getProfile)
    this.props.selectAccount(newChecked)
  }

  render() {

    return (
      <SWrapper>
        <SAppBar position="static" color="primary">
          <Toolbar>
            <SelectTitle variant="title" color="inherit">
              Accounts & Wallets
            </SelectTitle>
          </Toolbar>
        </SAppBar>
        <List>
          {[0, 1, 2, 3, 4].map((value) => (
            <ListItem key={value} dense button onClick={this.handleToggle(value)}>
              <Checkbox checked={this.props.selectedAccounts.indexOf(value) !== -1} tabIndex={-1} disableRipple />
              <ListItemText primary={`Account ${value + 1}`} />
              {/* <ListItemSecondaryAction>
                <IconButton aria-label="Comments">
                  <Autorenew />
                </IconButton>
              </ListItemSecondaryAction> */}
            </ListItem>
          ))}
        </List>
      </SWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.portfolio,
  selectedAccounts: state.portfolio.selectedAccounts
})


const mapDispatchToProps = (dispatch: any) => ({
  selectAccount: (accounts: any) => dispatch(actions.selectAccount(accounts))
})


export const SelectAccount = compose(
  graphql(API.getKeys, { name: 'keys' }),
  connect(mapStateToProps, mapDispatchToProps)
)(AccountSelector)
