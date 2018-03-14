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
import * as R from 'ramda'

import * as actions from '../../actions'
import * as API from '../../api'

const SAppBar = styled(AppBar)``

const SWrapper = styled.div`
  width: 100%;
  max-width: 360px;
`

const SelectTitle = styled(Typography)`
  letter-spacing: 0.5px;
  font-size: 20px !important;
`

class SelectPortfolioComponent extends React.Component {
  readonly state = {
    allKeysSelected: false,
  }

  componentDidMount() {
    // if(R.equals(this.props.keys.getProfile.keys.map))
  }
  readonly handleToggle = (value: any) => () => {
    const { selectedAccounts } = this.props
    const currentIndex = selectedAccounts.indexOf(value)
    const newChecked = [...selectedAccounts]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    this.props.selectAccount(newChecked)
    this.props.onLoad(123)
  }

  readonly handleToggleAll = () => {
    const allKeys = this.props.keys.getProfile.keys.map(key => key._id)
    this.setState((prevState, props) => {
      return { allKeysSelected: !prevState.allKeysSelected };
    });
    this.props.selectAllKeys(allKeys)
  }

  render() {
    console.log(this.props)
    if (this.props.keys.loading) {
      return <Typography variant="title">Loading</Typography>
    }
    const { keys } = this.props.keys.getProfile

    return (
      <SWrapper>
        {/* <SAppBar position="static" color="primary">
          <Toolbar>
            <SelectTitle variant="title" color="inherit">
              Accounts & Wallets
            </SelectTitle>
          </Toolbar>
        </SAppBar> */}
        <List>
          <Typography>Check</Typography>
          {keys.length === 0 && <Typography variant="title">No keys</Typography>}
          {keys.length > 0 && (
            <ListItem dense button onClick={this.handleToggleAll}>
              <Checkbox checked={this.state.allKeysSelected} disableRipple />
              <ListItemText primary="Select all" />
            </ListItem>
          )}
          {keys.map(key => (
            <ListItem key={key._id} dense button onClick={this.handleToggle(key._id)}>
              <Checkbox
                checked={this.props.selectedAccounts.indexOf(key._id) !== -1}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={key.name} />
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

const mapStateToProps = (state: any) => ({
  portfolio: state.portfolio,
  selectedAccounts: state.portfolio.selectedAccounts,
})

const mapDispatchToProps = (dispatch: any) => ({
  selectAccount: (accounts: any) => dispatch(actions.selectAccount(accounts)),
  onLoad: data => dispatch(actions.onLoad(data)),
  selectAllKeys: (keys: any) => dispatch(actions.selectAllKeys(keys))
})

export const PortfolioList = compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(API.getKeysQuery, { name: 'keys' })
)(SelectPortfolioComponent)
