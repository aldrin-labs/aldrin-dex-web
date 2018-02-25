import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withFormik } from 'formik'

import { Loading } from '@components/Loading'

import { withErrorFallback } from '@hoc'

import * as actions from './actions'
import * as selectors from './selectors'

const UserComp = (props: any) => {
  return (
    <div>
      Hello <button onClick={() => console.log(props)}>Test</button>
      {/* <Loading /> */}
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  check: selectors.checker(state)
})

const mapDispatchToProps = (dispatch: any) => ({
  addExchangeKey: () => dispatch(actions.addExchangeKey())
})

export const Settings = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withErrorFallback
)(UserComp)
