import React from 'react'
import {InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Typography from 'material-ui/Typography'
import Select from 'material-ui/Select'
import styled from 'styled-components'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '../../../components/SvgIcon/SvgIcon'

import { IProps, IState } from './Selector.types'


const data = {
  coin: [
    { label: 'USD', value: 'USD' },
    { label: 'BTC', value: 'BTC' },
    { label: 'LTC', value: 'LTC' },
    { label: 'ETH', value: 'ETH' },
    { label: 'DOGE', value: 'DOGE' },
    { label: 'Monero', value: 'Monero' },
  ],
  marketCap: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  price: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  peg: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  volume: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  performance: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  performance2: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  twenty20DayHighLow: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  twenty20DaySimpleMoving: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  fifty50DaySimpleMoving: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  fifty50DayHighLow: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  averageTrueRange: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  twoHundreds200SimpleMoving: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  fiftyTwo52WeekHighLow: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  rsi14: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  change: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  pattern: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  gap: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  changeFromOpen: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  candleStick: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  volatility: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
}

export default class ScreenerSelect extends React.Component<IProps, IState> {
  state: IState = {
    coin: '',
    marketCap: '',
    price: '',
    peg: '',
    volume: '',

    performance: '',
    performance2: '',
    twenty20DayHighLow: '',
    twenty20DaySimpleMoving: '',
    fifty50DaySimpleMoving: '',
    fifty50DayHighLow: '',
    averageTrueRange: '',
    twoHundreds200SimpleMoving: '',
    fiftyTwo52WeekHighLow: '',
    rsi14: '',
    change: '',
    pattern: '',
    gap: '',
    changeFromOpen: '',
    candleStick: '',
    volatility: '',

    showFilters: false,
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  hangleToggleFilters = () => {
    this.setState((prevState) => ({ showFilters: !prevState.showFilters }))
  }

  render() {
    const { showFilters } = this.state

    return (
      <MainWrapper>
        <ToggleFiltersContainer onClick={this.hangleToggleFilters}>
          {showFilters ? 'Hide' : 'Show'} signals
          <SvgIcon
            src={sortIcon}
            width={12}
            height={12}
            style={{
              verticalAlign: 'middle',
              marginLeft: '4px',
              transform: showFilters ? 'rotate(180deg)' : null,
              transition: 'all 0.3s ease'
            }}
          />
        </ToggleFiltersContainer>
        <SContainer autoComplete="off" showFilters={showFilters}>
          <SColumnForm showFilters={showFilters}>
          <SFormControl>
          <InputLabel htmlFor="coin">Coin</InputLabel>
          <SSelect
          value={this.state.coin}
          onChange={this.handleChange}
          inputProps={{
          name: 'coin',
          id: 'coin',
          }}
          >
              <Input/>
              {data.coin.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </SSelect>
          {/*<FormHelperText>Label demo. Select coin!</FormHelperText>*/}
            {/*<Input/>*/}
          </SFormControl>
          <SFormControl>
          <InputLabel htmlFor="marketCap">Market Cap</InputLabel>
          <SSelect
          value={this.state.marketCap}
          onChange={this.handleChange}
          inputProps={{
          name: 'marketCap',
          id: 'marketCap',
          }}
          >
          {data.marketCap.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </SSelect><Input/>
          </SFormControl>
          {/*<SFormControl>*/}
          {/*<InputLabel htmlFor="price">Price</InputLabel>*/}
          {/*<SSelect*/}
          {/*value={this.state.price}*/}
          {/*onChange={this.handleChange}*/}
          {/*inputProps={{*/}
          {/*name: 'price',*/}
          {/*id: 'price',*/}
          {/*}}*/}
          {/*>*/}
          {/*{data.price.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}*/}
          {/*</SSelect>*/}
          {/*</SFormControl>*/}
          <SFormControl>
          <InputLabel htmlFor="peg">PEG</InputLabel>
          <SSelect
          value={this.state.peg}
          onChange={this.handleChange}
          inputProps={{
          name: 'peg',
          id: 'peg',
          }}
          >
          {data.peg.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </SSelect><Input/>
          </SFormControl>
          <SFormControl>
          <InputLabel htmlFor="volume">Volume</InputLabel>
          <SSelect
          value={this.state.volume}
          onChange={this.handleChange}
          inputProps={{
          name: 'volume',
          id: 'volume',
          }}
          >
          {data.volume.map(({ value, label }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </SSelect><Input/>
          </SFormControl>
          </SColumnForm>
          <SColumnForm showFilters={showFilters}>
            <SFormControl>
              <InputLabel htmlFor="performance">Performance</InputLabel>
              <SSelect
                value={this.state.performance}
                onChange={this.handleChange}
                inputProps={{
                  name: 'performance',
                  id: 'performance',
                }}
              >
                {data.performance.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="performance2">Performance 2</InputLabel>
              <SSelect
                value={this.state.performance2}
                onChange={this.handleChange}
                inputProps={{
                  name: 'performance2',
                  id: 'performance2',
                }}
              >
                {data.performance2.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="twenty20DayHighLow">
                20-days High/Low
              </InputLabel>
              <SSelect
                value={this.state.twenty20DayHighLow}
                onChange={this.handleChange}
                inputProps={{
                  name: 'twenty20DayHighLow',
                  id: 'twenty20DayHighLow',
                }}
              >
                {data.twenty20DayHighLow.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="twenty20DaySimpleMoving">
                20-Day Simple Moving Average Beta
              </InputLabel>
              <SSelect
                value={this.state.twenty20DaySimpleMoving}
                onChange={this.handleChange}
                inputProps={{
                  name: 'twenty20DaySimpleMoving',
                  id: 'twenty20DaySimpleMoving',
                }}
              >
                {data.twenty20DaySimpleMoving.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl>
              <InputLabel htmlFor="fifty50DaySimpleMoving">
                50-Day Simple Moving Average
              </InputLabel>
              <SSelect
                value={this.state.fifty50DaySimpleMoving}
                onChange={this.handleChange}
                inputProps={{
                  name: 'fifty50DaySimpleMoving',
                  id: 'fifty50DaySimpleMoving',
                }}
              >
                {data.fifty50DaySimpleMoving.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="fifty50DayHighLow">
                50-Day High/Low
              </InputLabel>
              <SSelect
                value={this.state.fifty50DayHighLow}
                onChange={this.handleChange}
                inputProps={{
                  name: 'fifty50DayHighLow',
                  id: 'fifty50DayHighLow',
                }}
              >
                {data.fifty50DayHighLow.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="averageTrueRange">
                Average True Range
              </InputLabel>
              <SSelect
                value={this.state.averageTrueRange}
                onChange={this.handleChange}
                inputProps={{
                  name: 'averageTrueRange',
                  id: 'averageTrueRange',
                }}
              >
                {data.averageTrueRange.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="twoHundreds200SimpleMoving">
                200-Day Simple Moving Average
              </InputLabel>
              <SSelect
                value={this.state.twoHundreds200SimpleMoving}
                onChange={this.handleChange}
                inputProps={{
                  name: 'twoHundreds200SimpleMoving',
                  id: 'twoHundreds200SimpleMoving',
                }}
              >
                {data.twoHundreds200SimpleMoving.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl>
              <InputLabel htmlFor="fiftyTwo52WeekHighLow">
                52-Week High/Low
              </InputLabel>
              <SSelect
                value={this.state.fiftyTwo52WeekHighLow}
                onChange={this.handleChange}
                inputProps={{
                  name: 'fiftyTwo52WeekHighLow',
                  id: 'fiftyTwo52WeekHighLow',
                }}
              >
                {data.fiftyTwo52WeekHighLow.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="rsi14">RSI (14)</InputLabel>
              <SSelect
                value={this.state.rsi14}
                onChange={this.handleChange}
                inputProps={{
                  name: 'rsi14',
                  id: 'rsi14',
                }}
              >
                {data.rsi14.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="change">Change</InputLabel>
              <SSelect
                value={this.state.change}
                onChange={this.handleChange}
                inputProps={{
                  name: 'change',
                  id: 'change',
                }}
              >
                {data.change.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="pattern">Pattern</InputLabel>
              <SSelect
                value={this.state.pattern}
                onChange={this.handleChange}
                inputProps={{
                  name: 'pattern',
                  id: 'pattern',
                }}
              >
                {data.pattern.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl>
              <InputLabel htmlFor="gap">Gap</InputLabel>
              <SSelect
                value={this.state.gap}
                onChange={this.handleChange}
                inputProps={{
                  name: 'gap',
                  id: 'gap',
                }}
              >
                {data.gap.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="changeFromOpen">Change From Open</InputLabel>
              <SSelect
                value={this.state.changeFromOpen}
                onChange={this.handleChange}
                inputProps={{
                  name: 'changeFromOpen',
                  id: 'changeFromOpen',
                }}
              >
                {data.changeFromOpen.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="candleStick">Candlestick</InputLabel>
              <SSelect
                value={this.state.candleStick}
                onChange={this.handleChange}
                inputProps={{
                  name: 'candleStick',
                  id: 'candleStick',
                }}
              >
                {data.candleStick.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="volatility">Volatility</InputLabel>
              <SSelect
                value={this.state.volatility}
                onChange={this.handleChange}
                inputProps={{
                  name: 'volatility',
                  id: 'volatility',
                }}
              >
                {data.volatility.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect><Input/>
            </SFormControl>
          </SColumnForm>
        </SContainer>
        {/*<TextDemo>*/}
        {/*{this.state.coin &&*/}
        {/*<Typography type="title" color="inherit">*/}
        {/*Selected coin: {this.state.coin}*/}
        {/*</Typography>*/}
        {/*}*/}
        {/*{this.state.marketCap &&*/}
        {/*<STypography type="title" color="inherit">*/}
        {/*Selected market cap: {this.state.marketCap}*/}
        {/*</STypography>*/}
        {/*}*/}
        {/*{this.state.price &&*/}
        {/*<STypography type="title" color="inherit">*/}
        {/*Selected price: {this.state.price}*/}
        {/*</STypography>*/}
        {/*}*/}
        {/*{this.state.peg &&*/}
        {/*<STypography type="title" color="inherit">*/}
        {/*Selected PEG: {this.state.peg}*/}
        {/*</STypography>*/}
        {/*}*/}
        {/*{this.state.volume &&*/}
        {/*<STypography type="title" color="inherit">*/}
        {/*Selected volume: {this.state.volume}*/}
        {/*</STypography>*/}
        {/*}*/}
        {/*</TextDemo>*/}
      </MainWrapper>
    )
  }
}

const SContainer = styled.form`
  padding-bottom: 15px;

  display: ${(props: { showFilters?: boolean }) =>
    props.showFilters ? 'flex' : 'none'};
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
  && {
    margin: 10px;
  }
`

const SColumnForm = styled.div`
display: flex;
    flex-direction: column;
`

const ToggleFiltersContainer = styled.div`
  font-family: Roboto;
  color: white;
  text-align: center;
  user-select: none;
  padding: 20px;
  width: 57vw;
`

// TODO: Just a hack, replace it with the normal material-ui ovverriding
const SSelect = styled(Select)`
  && > div > div {
        min-height: 1.8875em;
  }
`

const Input = styled.input`
  box-sizing: border-box;
  border-bottom: 2px solid rgb(78, 216, 218);
  background: transparent;
  border-top: none;
  border-left: none;
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 10px 0 0px;
  color: rgb(255, 255, 255);
`

const SFilterWrapper = styled.div`
  display: flex;
`
