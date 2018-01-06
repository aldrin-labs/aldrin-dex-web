import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'

import HomePage from 'components/pages/HomePage'

const SampleList = props => {
  const { classes, data } = props
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
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
      </Table>
    </Paper>
  )
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
})

const StyledList = withStyles(styles)(SampleList)

export default class CoinMarketCap extends Component {
  state = {
    loading: false,
    loaded: false,
    marketData: [],
  }

  async componentDidMount() {
    // testing, move to HOC
    this.setState({
      loading: true,
    })
    const data = await fetch(
      'https://api.coinmarketcap.com/v1/ticker/?limit=10',
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
    // console.log(this.state.marketData)
    return (
      <HomePage>
        <StyledList data={marketData} />
      </HomePage>
    )
  }
}

SampleList.propTypes = {
  classes: PropTypes.object.isRequired,
}
