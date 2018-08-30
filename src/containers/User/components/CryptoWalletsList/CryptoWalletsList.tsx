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

import { getCryptoWalletsQuery } from '@containers/User/api'
import { DeleteCryptoWalletDialog } from '@containers/User/components/CryptoWalletsList'
import QueryRenderer from '@components/QueryRenderer'

class CryptoWalletsListComponent extends React.Component {
  state = {
    wallets: null,
  }

  componentDidMount() {
    if (this.props.data.getProfile) {
      this.setState({ wallets: this.props.data.getProfile.cryptoWallets })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.getProfile) {
      this.setState({ wallets: nextProps.data.getProfile.cryptoWallets })
    }
  }

  render() {
    if (this.props.data.loading) {
      return <Loading centerAligned />
    }

    const { wallets } = this.state

    return (
      <CryptoWalletsListPaper>
        <CryptoWalletsTable>
          <TableHead>
            <TableRow>
              <CryptoWalletTableCell>Name</CryptoWalletTableCell>
              <CryptoWalletTableCell numeric>Blockchain / Network</CryptoWalletTableCell>
              <CryptoWalletTableCell numeric>Address</CryptoWalletTableCell>
              <CryptoWalletTableCell numeric>Date</CryptoWalletTableCell>
              <CryptoWalletTableCell numeric>Delete key</CryptoWalletTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallets &&
              wallets.map((wallet) => {
                const { _id, name, baseAsset, address, date = Date.now() } = wallet
                return (
                  <TableRow key={_id}>
                    <CryptoWalletTableCell>{name}</CryptoWalletTableCell>
                    <CryptoWalletTableCell numeric>
                      {baseAsset ? baseAsset.name : ''}
                    </CryptoWalletTableCell>
                    <CryptoWalletTableCell numeric>{address}</CryptoWalletTableCell>
                    <CryptoWalletTableCell numeric>
                      {<FormattedDate value={date} />}
                    </CryptoWalletTableCell>
                    <CryptoWalletTableCell numeric>
                      <DeleteCryptoWalletDialog wallet={wallet} />
                    </CryptoWalletTableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </CryptoWalletsTable>
      </CryptoWalletsListPaper>
    )
  }
}

const CryptoWalletTableCell = styled(TableCell)`
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
`

const CryptoWalletsListPaper = styled(Paper)`
  margin: 8px;
  min-height: 500px;
  overflow-x: auto;
  width: 100%;
`

const CryptoWalletsTable = styled(Table)`
  table-layout: fixed;
`

export default function () {
  return <QueryRenderer component={CryptoWalletsListComponent} query={getCryptoWalletsQuery} />
}
