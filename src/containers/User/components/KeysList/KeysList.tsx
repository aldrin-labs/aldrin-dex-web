import * as React from 'react'
import { FormattedDate } from 'react-intl'
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
            {keys.map((key) => (
              <TableRow key={key._id}>
                <KeyTableCell>{key.name}</KeyTableCell>
                <KeyTableCell numeric>{key.exchange.name}</KeyTableCell>
                <KeyTableCell numeric>{key.apiKey}</KeyTableCell>
                <KeyTableCell numeric>
                  {<FormattedDate value={key.date} />}
                </KeyTableCell>
                <KeyTableCell numeric>
                  <DeleteKeyDialog keyName={key.name} />
                </KeyTableCell>
              </TableRow>
            ))}
          </TableBody>
        </KeysTable>
      </KeysListPaper>
    )
  }
}

const KeyTableCell = styled(TableCell)`
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
`

const KeysListPaper = styled(Paper)`
  margin: 8px;
  min-height: 500px;
  overflow-x: auto;
  width: 100%;
`

const KeysTable = styled(Table)`
  table-layout: fixed;
`

export const KeysList = compose(graphql(getKeysQuery))(KeysListComponent)
