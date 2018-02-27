import React from 'react'
import styled from 'styled-components'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { propType } from 'graphql-anywhere'

import { Loading } from '@components/Loading'
import { withErrorFallback } from '@hoc'

const getKeys = gql`
  query getKeys {
    getProfile {
      username
      imageUrl
      email
      emailSubscription
      portfolioId
      keys {
        name
        date
        credentials {
          public
          secret
        }
        exchange {
          name
          symbol
        }
      }
    }
  }
`

const renderWhileLoading = (component, propName = 'data') =>
  branch(props => props[propName] && props[propName].loading, renderComponent(component))

const renderForError = (component, propName = 'data') =>
  branch(props => props[propName] && props[propName].error, renderComponent(component))

const Error = props => (
  <span>
    Something went wrong try to <button onClick={props.refetch}>refetch</button>
  </span>
)

const setRefetchProp = (propName = 'data') =>
  withProps(props => ({ refetch: props[propName] && props[propName].data }))

const Keys = props => <div>{console.log(props)}</div>

export const KeysList = compose(
  graphql(getKeys, { name: 'keysList' }),
  renderWhileLoading(Loading, 'keysList'),
  setRefetchProp('keysList'),
  renderForError(Error, 'keysList')
)(Keys)
