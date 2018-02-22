import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { Loading } from '@components/Loading'

import { withErrorFallback } from '@hoc'

import * as actions from './actions'
import * as selectors from './selectors'
console.log(actions.addTodo.getType())

const UserComp = props => {
  console.log(111, props)
  return (
    <div>
      Hello <button onClick={Yoba}>Test</button>
      <Loading />
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  check: selectors.checker(state)
})

function mapDispatchToProps(dispatch) {
  return {
    addTodo: () => dispatch(actions.addTodo()),
  }
}

// export const User = connect(mapStateToProps, mapDispatchToProps)(UserComp)

export const User = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withErrorFallback
)(UserComp)
