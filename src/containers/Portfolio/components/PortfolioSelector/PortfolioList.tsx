import Checkbox from '@material-ui/core/Checkbox'
import List, { ListItem, ListItemText } from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { withTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import * as actions from '../../actions'
import * as API from '../../api'
import { LoginAlert } from '../PortfolioTable/LoginAlert'

import { IProps, IState } from './PortfolioList.types'
import { Loading } from '@components/Loading/Loading'

const SWrapper = styled.div`
  width: 100%;
  max-width: 320px;
`

const SelectTitle = styled(Typography)`
  letter-spacing: 0.5px;
  font-size: 20px !important;
`

const SToolbar = styled(Toolbar)`
  background-color: ${(props) =>
    props.theme ? props.theme.palette.background.paper : ''};
`

class SelectPortfolioComponent extends React.Component<IProps, IState> {
  state: IState = {
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
    const allKeys = this.props.keys.getProfile.keys.map((key) => key._id)
    this.setState((prevState, props) => ({
      allKeysSelected: !prevState.allKeysSelected,
    }))
    this.props.selectAllKeys(allKeys)
  }

  render() {
    if (this.props.keys.loading) {
      return <Loading centerAligned />
    }

    if (this.props.keys.error) {
      if (this.props.keys.error.message.toLowerCase().includes('jwt')) {
        return <LoginAlert />
      }

      return (
        <Typography variant="title" color="error">
          Error!
        </Typography>
      )
    }

    const { keys } = this.props.keys.getProfile

    return (
      <SWrapper>
        <AppBar position="static">
          <SToolbar theme={this.props.theme}>
            <SelectTitle variant="title">Api keys</SelectTitle>
          </SToolbar>
        </AppBar>
        <List>
          {keys.length === 0 && (
            <Typography variant="title">No keys</Typography>
          )}
          {keys.length > 0 && (
            <ListItem dense button onClick={this.handleToggleAll}>
              <Checkbox checked={this.state.allKeysSelected} disableRipple />
              <ListItemText primary="Select all" />
            </ListItem>
          )}
          {keys.map((key) => (
            <ListItem
              key={key._id}
              dense
              button
              onClick={this.handleToggle(key._id)}
            >
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
  onLoad: (data: any) => dispatch(actions.onLoad(data)),
  selectAllKeys: (keys: any) => dispatch(actions.selectAllKeys(keys)),
})

export const PortfolioList = compose(
  withTheme(),
  connect(mapStateToProps, mapDispatchToProps),
  graphql(API.getKeysQuery, { name: 'keys' })
)(SelectPortfolioComponent)
