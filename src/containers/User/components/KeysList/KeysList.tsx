import * as React from 'react'
import { FormattedDate } from 'react-intl'
import styled from 'styled-components'

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import { Loading } from '@components/Loading'

import { getKeysQuery } from '@containers/User/api'
import { DeleteKeyDialog } from '@containers/User/components/KeysList'
import QueryRenderer from '@components/QueryRenderer'

class KeysListComponent extends React.Component {
  state = {
    keys: null,
  }

  componentDidMount() {
    if (this.props.data.getProfile) {
      this.setState({ keys: this.props.data.getProfile.keys })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.getProfile) {
      this.setState({ keys: nextProps.data.getProfile.keys })
    }
  }

  render() {
    if (this.props.data.loading) {
      return <Loading centerAligned />
    }

    const { keys } = this.state

    return (
      <KeysListPaper>
        <KeysTable>
          <TableHead>
            <TableRow>
              <KeyTableCell>Name</KeyTableCell>
              <KeyTableCell numeric>Exchange</KeyTableCell>
              <KeyTableCell numeric>Api key</KeyTableCell>
              <KeyTableCell numeric>Date</KeyTableCell>
              <KeyTableCell numeric>Delete key</KeyTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys &&
              keys.map((key) => {
                const { _id, name, exchange, apiKey, date } = key
                return (
                  <TableRow key={_id}>
                    <KeyTableCell>{name}</KeyTableCell>
                    <KeyTableCell numeric>
                      {exchange ? exchange.name : ''}
                    </KeyTableCell>
                    <KeyTableCell numeric>{apiKey}</KeyTableCell>
                    <KeyTableCell numeric>
                      {<FormattedDate value={date} />}
                    </KeyTableCell>
                    <KeyTableCell numeric>
                      <DeleteKeyDialog keyName={name} />
                    </KeyTableCell>
                  </TableRow>
                )
              })}
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

export default function() {
  return <QueryRenderer component={KeysListComponent} query={getKeysQuery} />
}
