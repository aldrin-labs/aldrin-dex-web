import React from 'react'
import styled from 'styled-components'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { propType } from 'graphql-anywhere'

import { withErrorFallback, LoaderHOC } from '@hoc'

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

const Error = props => (
  <span>
    Something went wrong try to <button onClick={props.refetch}>refetch</button>
  </span>
)

const setRefetchProp = (propName = 'data') =>
  withProps(props => ({ refetch: props[propName] && props[propName].data }))

const Keys = props => <div>{console.log(prosps)}</div>

export const KeysList = compose(
  graphql(getKeys, { name: 'keysList' }),
  LoaderHOC(null, 'keysList'),
  setRefetchProp('keysList'),
  withErrorFallback
)(Keys)
