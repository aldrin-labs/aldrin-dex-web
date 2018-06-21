import * as React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import styled from 'styled-components'

import Selector from './Selector/Selector'
import ScreenerTabs from './ScreenerTabs/ScreenerTabs'
import ScreenerTable from './ScreenerTable/ScreenerTable.tsx'
import UserForm from './UserForm'
import { IProps, IState } from './Screener.types'

class ScreenerBase extends React.Component<IProps, IState> {
  state: IState = {
    tab: 'marketSummary',
  }

  onChangeTab = (
    kind:
      | 'marketSummary'
      | 'overview'
      | 'performance'
      | 'oscillators'
      | 'trendFollowing'
  ) => {
    this.setState({ tab: kind })
  }

  render() {
    return (
      <div>
        <ScreenerTabs onChangeTab={this.onChangeTab} tab={this.state.tab} />
        <Selector />
        <ScreenerTable />
      </div>
    )
  }
}

export const Screener = compose(
  connect((state) => ({
    count: console.log(state),
  }))
)(ScreenerBase)
