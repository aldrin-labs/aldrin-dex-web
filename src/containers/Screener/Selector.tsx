import React from 'react'
import Input, { InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import Select from 'material-ui/Select'
import styled from 'styled-components'

const SContainer = styled.form`
  margin-top: 15px !important;
  align-self: center;
  margin: 0 auto;
`

const TextDemo = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  flex-direction: column;
`

const STypography = styled(Typography)`
  margin: 20px;
`

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`

const SFormControl = styled(FormControl)`
  width: 200px;
  margin: 10px !important;
`

class ScreenerSelect extends React.Component {
  state = {
    coin: '',
    marketCap: '',
    price: '',
    peg: '',
    volume: '',
    data: {
      coin: [
        { label: 'USD', value: 'USD' },
        { label: 'BTC', value: 'BTC' },
        { label: 'LTC', value: 'LTC' },
        { label: 'ETH', value: 'ETH' },
        { label: 'DOGE', value: 'DOGE' },
        { label: 'Monero', value: 'Monero' },
      ],
      marketCap: [
        { label: 'any', value: 'any' },
        { label: 'mega', value: 'Mega ($200bln and more)' },
        { label: 'large', value: 'Large ($10bln to $200bln)' },
        { label: 'mid', value: 'Mid ($2bln to $10bln)' },
        { label: 'small', value: 'Small ($300mln to $2bln' },
        { label: 'micro', value: 'Micro ($50mln to $300mln)' },
      ],
      price: [
        { label: 'any', value: 'any' },
        { label: 'low', value: 'low' },
        { label: 'high', value: 'high' },
      ],
      peg: [
        { label: 'any', value: 'any' },
        { label: 'low', value: 'low' },
        { label: 'high', value: 'high' },
        { label: 'over', value: 'over' },
        { label: 'under', value: 'under' },
      ],
      volume: [
        { label: 'any', value: 'any' },
        { label: 'Under 50k', value: 'Under 50k' },
        { label: 'Under 100k', value: 'Under 100k' },
        { label: 'Under 250k', value: 'Under 250k' },
        { label: 'Over 50k', value: 'Over 50k' },
        { label: 'Over 500k', value: 'Over 500k' },
      ]
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {

    return (
      <MainWrapper>
      <SContainer autoComplete="off">
        <SFormControl>
          <InputLabel htmlFor="coin">Coin</InputLabel>
          <Select
            value={this.state.coin}
            onChange={this.handleChange}
            inputProps={{
              name: 'coin',
              id: 'coin',
            }}
          >
            {this.state.data.coin.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </Select>
          <FormHelperText>Label demo. Select coin!</FormHelperText>
        </SFormControl>
        <SFormControl>
          <InputLabel htmlFor="marketCap">Market Cap</InputLabel>
          <Select
            value={this.state.marketCap}
            onChange={this.handleChange}
            inputProps={{
              name: 'marketCap',
              id: 'marketCap',
            }}
          >
            {this.state.data.marketCap.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </Select>
        </SFormControl>
        <SFormControl>
          <InputLabel htmlFor="price">Price</InputLabel>
          <Select
            value={this.state.price}
            onChange={this.handleChange}
            inputProps={{
              name: 'price',
              id: 'price',
            }}
          >
            {this.state.data.price.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </Select>
        </SFormControl>
        <SFormControl>
          <InputLabel htmlFor="peg">PEG</InputLabel>
          <Select
            value={this.state.peg}
            onChange={this.handleChange}
            inputProps={{
              name: 'peg',
              id: 'peg',
            }}
          >
            {this.state.data.peg.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </Select>
        </SFormControl>
        <SFormControl>
          <InputLabel htmlFor="volume">Volume</InputLabel>
          <Select
            value={this.state.volume}
            onChange={this.handleChange}
            inputProps={{
              name: 'volume',
              id: 'volume',
            }}
          >
            {this.state.data.volume.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </Select>
        </SFormControl>
      </SContainer>
      <TextDemo>
      {this.state.coin &&
        <Typography type="title" color="inherit">
          Selected coin: {this.state.coin}
        </Typography>
      }
      {this.state.marketCap &&
        <STypography type="title" color="inherit">
          Selected market cap: {this.state.marketCap}
        </STypography>
      }
      {this.state.price &&
        <STypography type="title" color="inherit">
          Selected price: {this.state.price}
        </STypography>
      }
      {this.state.peg &&
        <STypography type="title" color="inherit">
          Selected PEG: {this.state.peg}
        </STypography>
      }
      {this.state.volume &&
        <STypography type="title" color="inherit">
          Selected volume: {this.state.volume}
        </STypography>
      }
      </TextDemo>
      </MainWrapper>
    )
  }
}

export default ScreenerSelect
