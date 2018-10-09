import * as React from 'react'
import { FormattedDate } from 'react-intl'
import styled from 'styled-components'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Loading } from '@components/Loading'

import { getCryptoWalletsQuery } from '@containers/User/api'
import { DeleteCryptoWalletDialog } from '@containers/User/components/CryptoWalletsList'
import QueryRenderer from '@components/QueryRenderer'

class CryptoWalletsListComponent extends React.Component {
  state = {
    wallets: null,
  }

  componentDidMount() {
    if (this.props.data.myPortfolios && this.props.data.myPortfolios.length > 0) {
      this.setState({ wallets: this.props.data.myPortfolios[0].cryptoWallets })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.myPortfolios && this.props.data.myPortfolios.length > 0) {
      this.setState({ wallets: nextProps.data.myPortfolios[0].cryptoWallets })
    }
  }

  render() {
    if (this.props.data.loading) {
      return <Loading centerAligned={true} />
    }

    const { wallets } = this.state

    return (
      <CryptoWalletsListPaper>
        <CryptoWalletsTable>
          <TableHead>
            <TableRow>
              <CryptoWalletTableCell>Name</CryptoWalletTableCell>
              <CryptoWalletTableCell numeric={true}>
                Blockchain / Network
              </CryptoWalletTableCell>
              <CryptoWalletTableCell numeric={true}>Address</CryptoWalletTableCell>
              <CryptoWalletTableCell numeric={true}>Date</CryptoWalletTableCell>
              <CryptoWalletTableCell numeric={true}>Delete key</CryptoWalletTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallets &&
              wallets.map((wallet) => {
                const {
                  _id,
                  name,
                  baseAsset,
                  address,
                  date = Date.now(),
                } = wallet
                return (
                  <TableRow key={_id}>
                    <CryptoWalletTableCell>{name}</CryptoWalletTableCell>
                    <CryptoWalletTableCell numeric={true}>
                      {baseAsset}
                    </CryptoWalletTableCell>
                    <CryptoWalletTableCell numeric={true}>
                      {address}
                    </CryptoWalletTableCell>
                    <CryptoWalletTableCell numeric={true}>
                      {<FormattedDate value={date} />}
                    </CryptoWalletTableCell>
                    <CryptoWalletTableCell numeric={true}>
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
  return (
    <QueryRenderer
      component={CryptoWalletsListComponent}
      query={getCryptoWalletsQuery}
    />
  )
}
