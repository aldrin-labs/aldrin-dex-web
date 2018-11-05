import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import { connect } from 'react-redux'

import * as actions from '@containers/User/actions'


class ShowTips extends Component {
  state = {
    anchorEl: null,
  }

  render() {
    return (
      <Button
      onClick={this.props.showToolTip}
      size="small"
      style={{ margin: '0.5rem 1rem' }}
    >
      Show tips
    </Button>
    )
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  showToolTip: () => dispatch(actions.showToolTip()),
})

const storeComponent = connect(
  mapDispatchToProps
)(ShowTips)

export default storeComponent