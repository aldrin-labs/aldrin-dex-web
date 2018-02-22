import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { Loading } from '@components/Loading'

import { withErrorFallback } from '@hoc'

import * as actions from './actions'
console.log(actions.addTodo.getType())

const UserComp = props => {
  console.log(111, props)
  return (
    <div>
      Hello <button onClick={Yoba}>{this.props.nnn}</button>
      <Loading />
    </div>
  )
}

function Yoba() {
  throw new Error('I crashed!');
}

function mapStateToProps(state) {
  return {
    check: state.user.check,
  }
}

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
