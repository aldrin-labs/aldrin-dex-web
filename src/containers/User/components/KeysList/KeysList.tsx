import * as React from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table'
import Paper from 'material-ui/Paper'

import { getKeysQuery } from '../../api'
import { DeleteKeyDialog } from './'

// TODO: hoc loader fix

class KeysListComponent extends React.Component {
  render() {
    if (this.props.data.loading) {
      return <div>Loading</div>
    }

    const { keys } = this.props.data.getProfile

    return (
      <KeysListPaper>
        <KeysTable>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell numeric>Exchange</TableCell>
              <TableCell numeric>Api key</TableCell>
              <TableCell numeric>Date</TableCell>
              <TableCell numeric>Delete key</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map((n) => (
              <TableRow key={n._id}>
                <TableCell>{n.name}</TableCell>
                <TableCell numeric>{n.exchange.name}</TableCell>
                <TableCell numeric>{n.apiKey}</TableCell>
                <TableCell numeric>{n.date}</TableCell>
                <TableCell numeric>
                  <DeleteKeyDialog keyName={n.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </KeysTable>
      </KeysListPaper>
    )
  }
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

export const KeysList = compose(graphql(getKeysQuery))(KeysListComponent)
