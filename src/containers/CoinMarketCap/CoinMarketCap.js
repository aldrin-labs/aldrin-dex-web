import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import styled from 'styled-components'

const SPaper = styled(Paper)`
  width: 100%;
  margin-top: 5px;
  overflow-x: auto;
`

const STable = styled(Table)`
  min-width: 700px;
  max-width: 1100px;
  margin: 0 auto;
`

const CoinsList = props => {
  const { data } = props
  return (
    <SPaper>
      <STable>
        <TableHead>
          <TableRow>
            <TableCell numeric>Rank</TableCell>
            <TableCell numeric>Name</TableCell>
            <TableCell numeric>Market Cap</TableCell>
            <TableCell numeric>Price</TableCell>
            <TableCell numeric>Volume 24h</TableCell>
            <TableCell numeric>Change 24h</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => (
            <TableRow key={n.id}>
              <TableCell>{n.rank}</TableCell>
              <TableCell numeric>{n.name}</TableCell>
              <TableCell numeric>{n.market_cap_usd}</TableCell>
              <TableCell numeric>{n.price_usd}</TableCell>
              <TableCell numeric>{n['24h_volume_usd']}</TableCell>
              <TableCell numeric>{n.percent_change_24h}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </STable>
    </SPaper>
  )
}

export default class CoinMarketCap extends Component {
  state = {
    loading: false,
    loaded: false,
    marketData: [],
  }

  async componentDidMount() {
    //TODO: move to HOC
    this.setState({
      loading: true,
    })
    const data = await fetch(
      'https://api.coinmarketcap.com/v1/ticker/?limit=25',
    )
    const json = await data.json()
    console.log(json)
    this.setState({
      loaded: true,
      loading: false,
    })
    this.setState({
      marketData: [...json],
    })
  }

  render() {
    const { marketData } = this.state
    return (
        <CoinsList data={marketData} />
    )
  }
}

