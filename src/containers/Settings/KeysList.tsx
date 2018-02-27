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

const Keys = props => <div>{console.log(111, dasprops)}</div>

export const KeysList = compose(
  graphql(getKeys, { name: 'keysList' }),
  LoaderHOC(null, 'keysList'),
  withErrorFallback,
)(Keys)
