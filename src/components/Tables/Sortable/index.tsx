import React, { Component } from 'react'

import Table from '../WithCheckboxesAndSummary'
import { Props } from '../WithCheckboxesAndSummary/index.types'

interface State {
  currentSort: number | null
}

export default class Container extends Component<Props, State> {
  state = {
    currentSort: null,
  }

  render() {
    return <Table />
  }
}
