import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { Loading } from '@components/Loading'

import { withErrorFallback } from '@hoc'

import * as actions from './actions'
console.log(actions.addTodo.getType())

const UserComp = props => {
  console.log(111, props)
  return (
    <div>
      Hello <button onClick={props.addTodo}>Checing </button>
      <Loading />
    </div>
  )
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

export const User = connect(mapStateToProps, mapDispatchToProps)(UserComp)
