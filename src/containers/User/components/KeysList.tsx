import React from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'

import { getKeysQuery, deleteExchangeKeyMutation } from '../api'

// TODO: hoc loader fix

const KeysListComponent = props => {
  if (props.data.loading) {
    return <div>Loading</div>
  }

  const { keys } = props.data.getProfile
  const { deleteExchangeKey } = props
  const deleteSelectedExchangeKey = async (name: string) => {
    try {
      const deleted = await deleteExchangeKey({
        variables: {
          name,
        },
      })
      console.log('Key deleted:', deleted.data)
    } catch (error) {
      console.error(error)
    }
  }

  console.log(keys)
  return (
    <KeysListPaper>
      <KeysTable>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell numeric>Exchange</TableCell>
            <TableCell numeric>Api key</TableCell>
            <TableCell numeric>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map(n => (
            <TableRow key={n._id}>
              <TableCell>{n.name}</TableCell>
              <TableCell numeric>{n.exchange.name}</TableCell>
              <TableCell numeric>{n.apiKey}</TableCell>
              <TableCell numeric>{n.date}</TableCell>
              <Button onClick={() => deleteSelectedExchangeKey(n.name)}>Test</Button>
            </TableRow>
          ))}
        </TableBody>
      </KeysTable>
    </KeysListPaper>
  )
}

const KeysListPaper = styled(Paper)`
  margin: 8px;
  min-height: 500px;
  overflow-x: auto;
  width: 100%;
`

const KeysTable = styled(Table)`
  min-width: 700;
`

export const KeysList = compose(
  graphql(getKeysQuery),
  graphql(deleteExchangeKeyMutation, { name: 'deleteExchangeKey' })
)(KeysListComponent)
