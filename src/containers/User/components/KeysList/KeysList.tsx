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
import { Loading } from '@components/Loading'

import { getKeysQuery } from '../../api'
import { DeleteKeyDialog } from './'

// TODO: hoc loader fix

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
              keys.map((key) => (
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
