import React, { Component } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow
} from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FirstPageIcon from 'material-ui-icons/FirstPage'
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import LastPageIcon from 'material-ui-icons/LastPage'


import { withErrorFallback, LoaderHOC } from '@hoc/index'

import { getProfile } from '../../api'

const Keys = (props: any) => <div>{console.log(111, props)}</div>

export const KeysList = compose(
  graphql(getProfile, { name: 'profile' }),
  LoaderHOC(null, 'keysList'),
  withErrorFallback,
)(Keys)
