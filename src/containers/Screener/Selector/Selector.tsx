import React from 'react'
import { InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Typography from 'material-ui/Typography'
import Select from 'material-ui/Select'
import styled from 'styled-components'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '../../../components/SvgIcon/SvgIcon'

import { IProps, IState } from './Selector.types'

const data = {
  industry: [
    { label: 'Smart Contracts', value: 'smartContracts' },
    { label: 'Payments', value: 'payments' },
    { label: 'Blockchain Platform', value: 'blockchain' },
    { label: 'Payment Coin', value: 'paymentCoin' },
    { label: 'Privacy Coin', value: 'privacyCoin' },
    {
      label: 'Third Generation Blockchain',
      value: 'thirdGenerationBlockchain',
    },
    {
      label: 'Scalable Blockchain as a Service Platform',
      value: 'scalableBlockchain',
    },
  ],
  marketCap: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  coin: [
    { label: 'USD', value: 'USD' },
    { label: 'BTC', value: 'BTC' },
    { label: 'LTC', value: 'LTC' },
    { label: 'ETH', value: 'ETH' },
    { label: 'DOGE', value: 'DOGE' },
    { label: 'Monero', value: 'Monero' },
  ],
  averageVolume: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  averageVolumeOnBalance: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  chaikinMoneyFlow: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  changeInDigits: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  changeInPercentage: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  closingPriceAverage: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  simpleMovingAverage: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  one1DayLow: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  one1DayHigh: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  one1HourLow: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  one1HourHigh: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  one1MonthLow: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  one1MonthHigh: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  three3MonthLow: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  three3MonthHigh: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  twelve12MonthLow: [
    { label: 'Value Below', value: 'valueBelow' },
    { label: 'Value Below or Equal', value: 'valueBelowOrEqual' },
    { label: 'Value Above', value: 'valueAbove' },
    { label: 'Value Above or Equal', value: 'valueAboveOrEqual' },
    { label: 'Value Equals To', value: 'valueEqualsTo' },
    { label: 'Value Not Equal To', value: 'valueNotEqualTo' },
  ],
  twelve12MonthHigh: [
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
    coin: [],
    industry: [],

    marketCap: '',
    changeInDigits: '',
    changeInPercentage: '',
    simpleMovingAverage: '',
    closingPriceAverage: '',
    averageVolume: '',
    averageVolumeOnBalance: '',
    chaikinMoneyFlow: '',

    one1DayLow: '',
    one1DayHigh: '',
    one1HourLow: '',
    one1HourHigh: '',
    one1MonthLow: '',
    one1MonthHigh: '',
    three3MonthLow: '',
    three3MonthHigh: '',
    twelve12MonthLow: '',
    twelve12MonthHigh: '',

    InputMarketCap: '',
    InputChangeInDigits: '',
    InputChangeInPercentage: '',
    InputSimpleMovingAverage: '',
    InputClosingPriceAverage: '',
    InputAverageVolume: '',
    InputAverageVolumeOnBalance: '',
    InputChaikinMoneyFlow: '',

    InputOne1HourLow: '',
    InputOne1HourHigh: '',
    InputOne1DayLow: '',
    InputOne1DayHigh: '',
    InputOne1MonthLow: '',
    InputOne1MonthHigh: '',
    InputThree3MonthLow: '',
    InputThree3MonthHigh: '',
    InputTwelve12MonthLow: '',
    InputTwelve12MonthHigh: '',

    showFilters: false,
  }

  handleSelectChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }
  handleInputChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        console.log(this.state)
      }
    )
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
              transition: 'all 0.3s ease',
            }}
          />
        </ToggleFiltersContainer>
        <SContainer autoComplete="off" showFilters={showFilters}>
          <SColumnForm>
            <SFormControl>
              <InputLabel htmlFor="coin">Coin</InputLabel>
              <SSelect
                value={this.state.coin}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'coin',
                  id: 'coin',
                }}
                multiple={true}
              >
                {data.coin.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              {/*<FormHelperText>Label demo. Select coin!</FormHelperText>*/}
            </SFormControl>

            <SFormControl>
              <InputLabel htmlFor="industry">Industry</InputLabel>
              <SSelect
                value={this.state.industry}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'industry',
                  id: 'industry',
                }}
                multiple={true}
              >
                {data.industry.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
            </SFormControl>

            <SFormControl>
              <InputLabel htmlFor="simpleMovingAverage">
                Simple Moving Average
              </InputLabel>
              <SSelect
                value={this.state.simpleMovingAverage}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'simpleMovingAverage',
                  id: 'simpleMovingAverage',
                }}
              >
                {data.simpleMovingAverage.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputSimpleMovingAverage"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="closingPriceAverage">
                Closing Price Average
              </InputLabel>
              <SSelect
                value={this.state.closingPriceAverage}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'closingPriceAverage',
                  id: 'closingPriceAverage',
                }}
              >
                {data.closingPriceAverage.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputClosingPriceAverage"
                onChange={this.handleInputChange}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl>
              <InputLabel htmlFor="marketCap">Market Cap</InputLabel>
              <SSelect
                value={this.state.marketCap}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'marketCap',
                  id: 'marketCap',
                }}
              >
                <Input
                  name="InputMarketCap"
                  onChange={this.handleInputChange}
                />
                {data.marketCap.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input name="InputMarketCap" onChange={this.handleInputChange} />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="chaikinMoneyFlow">
                Chaikin Money Flow
              </InputLabel>
              <SSelect
                value={this.state.chaikinMoneyFlow}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'chaikinMoneyFlow',
                  id: 'chaikinMoneyFlow',
                }}
              >
                {data.chaikinMoneyFlow.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputChaikinMoneyFlow"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="averageVolume">Average Volume</InputLabel>
              <SSelect
                value={this.state.averageVolume}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'averageVolume',
                  id: 'averageVolume',
                }}
              >
                {data.averageVolume.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputAverageVolume"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="averageVolumeOnBalance">
                On-Balance Volume
              </InputLabel>
              <SSelect
                value={this.state.averageVolumeOnBalance}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'averageVolumeOnBalance',
                  id: 'averageVolumeOnBalance',
                }}
              >
                {data.averageVolumeOnBalance.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputAverageVolumeOnBalance"
                onChange={this.handleInputChange}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl>
              <InputLabel htmlFor="changeInDigits">Change</InputLabel>
              <SSelect
                value={this.state.changeInDigits}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'changeInDigits',
                  id: 'changeInDigits',
                }}
              >
                {data.changeInDigits.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputChangeInDigits"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="changeInPercentage">Change %</InputLabel>
              <SSelect
                value={this.state.changeInPercentage}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'changeInPercentage',
                  id: 'changeInPercentage',
                }}
              >
                {data.changeInPercentage.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputChangeInPercentage"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="one1HourLow">Hourly Low</InputLabel>
              <SSelect
                value={this.state.one1HourLow}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'one1HourLow',
                  id: 'one1HourLow',
                }}
              >
                {data.one1HourLow.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputOne1HourLow"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="one1HourHigh">Hourly High</InputLabel>
              <SSelect
                value={this.state.one1HourHigh}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'one1HourHigh',
                  id: 'one1HourHigh',
                }}
              >
                {data.one1HourHigh.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputOne1HourHigh"
                onChange={this.handleInputChange}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl>
              <InputLabel htmlFor="one1DayLow">1-Day Low</InputLabel>
              <SSelect
                value={this.state.one1DayLow}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'one1DayLow',
                  id: 'one1DayLow',
                }}
              >
                {data.one1DayLow.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input name="InputOne1DayLow" onChange={this.handleInputChange} />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="one1DayHigh">1 Day High</InputLabel>
              <SSelect
                value={this.state.one1DayHigh}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'one1DayHigh',
                  id: 'one1DayHigh',
                }}
              >
                {data.one1DayHigh.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputOne1DayHigh"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="three3MonthLow">3-Month Low</InputLabel>
              <SSelect
                value={this.state.three3MonthLow}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'three3MonthLow',
                  id: 'three3MonthLow',
                }}
              >
                {data.three3MonthLow.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputThree3MonthLow"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="three3MonthHigh">3-Month High</InputLabel>
              <SSelect
                value={this.state.three3MonthHigh}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'three3MonthHigh',
                  id: 'three3MonthHigh',
                }}
              >
                {data.three3MonthHigh.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputThree3MonthHigh"
                onChange={this.handleInputChange}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl>
              <InputLabel htmlFor="one1MonthLow">1-Month Low</InputLabel>
              <SSelect
                value={this.state.one1MonthLow}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'one1MonthLow',
                  id: 'one1MonthLow',
                }}
              >
                {data.one1MonthLow.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputOne1MonthLow"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="one1MonthHigh">1-Month High</InputLabel>
              <SSelect
                value={this.state.one1MonthHigh}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'one1MonthHigh',
                  id: 'one1MonthHigh',
                }}
              >
                {data.one1MonthHigh.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputOne1MonthHigh"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="twelve12MonthLow">12-Month Low</InputLabel>
              <SSelect
                value={this.state.twelve12MonthLow}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'twelve12MonthLow',
                  id: 'twelve12MonthLow',
                }}
              >
                {data.twelve12MonthLow.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputTwelve12MonthLow"
                onChange={this.handleInputChange}
              />
            </SFormControl>
            <SFormControl>
              <InputLabel htmlFor="twelve12MonthHigh">12-Month High</InputLabel>
              <SSelect
                value={this.state.twelve12MonthHigh}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'twelve12MonthHigh',
                  id: 'twelve12MonthHigh',
                }}
              >
                {data.twelve12MonthHigh.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputTwelve12MonthHigh"
                onChange={this.handleInputChange}
              />
            </SFormControl>
          </SColumnForm>
        </SContainer>
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

  && svg {
    top: calc(50% - 17px);
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
