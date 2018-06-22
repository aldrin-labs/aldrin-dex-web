import * as React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import styled from 'styled-components'

import Selector from '../Selector/Selector'
import ScreenerTabs from '../ScreenerTabs/ScreenerTabs'
import ScreenerTable from '../ScreenerTable/ScreenerTable.tsx'
import ScreenerSearch from '../ScreenerSearch/ScreenerSearch'
import UserForm from '../UserForm'
import { IProps, IState } from './Screener.types'

class ScreenerBase extends React.Component<IProps, IState> {
  state: IState = {
    tab: 'marketSummary',
    searchText: ''
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

  onChangeSearchText = (newSearchText: string) => {
    // const newSearchText = e.target.value
    //
    // this.setState(({searchText: newSearchText}), () => {
    //   console.log(this.state.searchText);
    // })

    this.setState({searchText: newSearchText})
  }


  render() {
    return (
      <div>
        <ScreenerTabs onChangeTab={this.onChangeTab} tab={this.state.tab} />
        <Selector />
        <ScreenerSearch searchText={this.state.searchText} onChangeSearchText={this.onChangeSearchText} />
        <ScreenerTable searchText={this.state.searchText} tab={this.state.tab} />
      </div>
    )
  }
}

export const Screener = compose(
  connect((state) => ({
    count: console.log(state),
  }))
)(ScreenerBase)
