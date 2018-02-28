import React from 'react'
import styled from 'styled-components'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { propType } from 'graphql-anywhere'

import { withErrorFallback, LoaderHOC } from '@hoc/index'

import { getProfile } from './api'

const Keys = (props: any) => <div>{console.log(111, dasprops)}</div>

export const KeysList = compose(
  graphql(getProfile, { name: 'profile' }),
  LoaderHOC(null, 'keysList'),
  withErrorFallback,
)(Keys)
