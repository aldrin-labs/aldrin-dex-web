import Autorenew from 'material-ui-icons/Autorenew'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import { withTheme } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import * as R from 'ramda'

import { Loading } from '@components'

import * as actions from '../../actions'
import * as API from '../../api'

const SWrapper = styled.div`
  width: 100%;
  max-width: 360px;
`

const SelectTitle = styled(Typography)`
  letter-spacing: 0.5px;
  font-size: 20px !important;
`

const SToolbar = styled(Toolbar)`
  background-color: ${props => props.theme ? props.theme.palette.background.paper : ''}
`

class SelectPortfolioComponent extends React.Component {
  state = {
    allKeysSelected: false,
  }

  componentDidMount() {
    // if(R.equals(this.props.keys.getProfile.keys.map))
  }
  handleToggle = (value: any) => () => {
    const { selectedAccounts } = this.props
    const currentIndex = selectedAccounts.indexOf(value)
    const newChecked = [...selectedAccounts]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    this.props.selectAccount(newChecked)
  }

  handleToggleAll = () => {
    const allKeys = this.props.keys.getProfile.keys.map(key => key._id)
    this.setState((prevState, props) =>
      ({ allKeysSelected: !prevState.allKeysSelected }));
    this.props.selectAllKeys(allKeys)
  }

  render() {
    console.log(this.props)
    if (this.props.keys.loading) {
      return <Loading />
    }

    if (this.props.keys.error) {
      if (this.props.keys.error.message.toLowerCase().includes('jwt')) {
        return <Loading />
      }

      return <Typography variant="title" color="error">Error!</Typography>
    }

    const { keys } = this.props.keys.getProfile
      console.log(333, this.props)

    return (
      <SWrapper>
        <AppBar position="static">
          <SToolbar theme={this.props.theme}>
            <SelectTitle variant="title">
              Accounts & Wallets
            </SelectTitle>
          </SToolbar>
        </AppBar>
        <List>
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
  withTheme(),
  connect(mapStateToProps, mapDispatchToProps),
  graphql(API.getKeysQuery, { name: 'keys' })
)(SelectPortfolioComponent)
