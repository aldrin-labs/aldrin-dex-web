import React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

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

const Keys = (props) => (
  <div>{console.log(props)}</div>
)

export const KeysList = compose(
  graphql(getKeys, { name: 'keysList' }),
)(Keys)
