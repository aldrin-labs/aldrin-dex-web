import React from 'react'
import { InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl } from 'material-ui/Form'
import Typography from 'material-ui/Typography'
import Select from 'material-ui/Select'
import styled from 'styled-components'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '../../../components/SvgIcon/SvgIcon'

import { IProps, IState } from './Selector.types'
import { data } from './selectsData'

export default class ScreenerSelect extends React.Component<IProps, IState> {
  state: IState = {
    timeInterval: '',
    industry: [],

    marketCap: '',
    changeInPercentage: '',
    simpleMovingAverage: '',
    closingPriceAverage: '',
    averageVolume: '',
    averageVolumeOnBalance: '',
    // chaikinMoneyFlow: '',

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
    const inputValue = event.target.value
    // TODO: But regex should be changed for multiple zeros catch

    if (!/^([0-9]+\.|[0-9]+\.[0-9]{1,2}|[0-9]+|)$/.test(inputValue)) {
      return
    }

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
            <SFormControl value={this.state.timeInterval}>
              <InputLabel htmlFor="timeInterval">Time Interval</InputLabel>
              <SSelect
                value={this.state.timeInterval}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'timeInterval',
                  id: 'timeInterval',
                }}
              >
                {data.timeInterval.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              {/*<FormHelperText>Label demo. Select timeInterval!</FormHelperText>*/}
            </SFormControl>

            <SFormControl value={this.state.industry}>
              <InputLabel htmlFor="industry">Industry</InputLabel>
              <SSelect
                key="industry"
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
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.simpleMovingAverage}>
              <InputLabel htmlFor="simpleMovingAverage">
                Simple Moving Average
              </InputLabel>
              <SSelect
                key="simpleMovingAverage"
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
                value={this.state.InputSimpleMovingAverage}
              />
            </SFormControl>
            <SFormControl value={this.state.closingPriceAverage}>
              <InputLabel htmlFor="closingPriceAverage">
                Closing Price Average
              </InputLabel>
              <SSelect
                key="closingPriceAverage"
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
                value={this.state.InputClosingPriceAverage}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.marketCap}>
              <InputLabel htmlFor="marketCap">Market Cap</InputLabel>
              <SSelect
                key="marketCap"
                value={this.state.marketCap}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'marketCap',
                  id: 'marketCap',
                }}
              >
                {data.marketCap.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputMarketCap"
                onChange={this.handleInputChange}
                value={this.state.InputMarketCap}
              />
            </SFormControl>
            {/*<SFormControl value={this.state.chaikinMoneyFlow}>*/}
            {/*<InputLabel htmlFor="chaikinMoneyFlow">*/}
            {/*Chaikin Money Flow*/}
            {/*</InputLabel>*/}
            {/*<SSelect*/}
            {/*key="chaikinMoneyFlow"*/}
            {/*value={this.state.chaikinMoneyFlow}*/}
            {/*onChange={this.handleSelectChange}*/}
            {/*inputProps={{*/}
            {/*name: 'chaikinMoneyFlow',*/}
            {/*id: 'chaikinMoneyFlow',*/}
            {/*}}*/}
            {/*>*/}
            {/*{data.chaikinMoneyFlow.map(({ value, label }) => (*/}
            {/*<MenuItem key={label} value={value}>*/}
            {/*{label}*/}
            {/*</MenuItem>*/}
            {/*))}*/}
            {/*</SSelect>*/}
            {/*<Input*/}
            {/*name="InputChaikinMoneyFlow"*/}
            {/*onChange={this.handleInputChange}*/}
            {/*value={this.state.InputChaikinMoneyFlow}*/}
            {/*/>*/}
            {/*</SFormControl>*/}
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.averageVolume}>
              <InputLabel htmlFor="averageVolume">Average Volume</InputLabel>
              <SSelect
                key="averageVolume"
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
                value={this.state.InputAverageVolume}
              />
            </SFormControl>
            <SFormControl value={this.state.averageVolumeOnBalance}>
              <InputLabel htmlFor="averageVolumeOnBalance">
                On-Balance Volume
              </InputLabel>
              <SSelect
                key="averageVolumeOnBalance"
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
                value={this.state.InputAverageVolumeOnBalance}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.changeInPercentage}>
              <InputLabel htmlFor="changeInPercentage">Change %</InputLabel>
              <SSelect
                key="changeInPercentage"
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
                value={this.state.InputChangeInPercentage}
              />
            </SFormControl>
            <SFormControl value={this.state.three3MonthLow}>
              <InputLabel htmlFor="three3MonthLow">3-Month Low</InputLabel>
              <SSelect
                key="three3MonthLow"
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
                value={this.state.InputThree3MonthLow}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.one1HourLow}>
              <InputLabel htmlFor="one1HourLow">Hourly Low</InputLabel>
              <SSelect
                key="one1HourLow"
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
                value={this.state.InputOne1HourLow}
              />
            </SFormControl>
            <SFormControl value={this.state.one1HourHigh}>
              <InputLabel htmlFor="one1HourHigh">Hourly High</InputLabel>
              <SSelect
                key="one1HourHigh"
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
                value={this.state.InputOne1HourHigh}
              />
            </SFormControl>
            <SFormControl value={this.state.three3MonthHigh}>
              <InputLabel htmlFor="three3MonthHigh">3-Month High</InputLabel>
              <SSelect
                key="three3MonthHigh"
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
                value={this.state.InputThree3MonthHigh}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.one1DayLow}>
              <InputLabel htmlFor="one1DayLow">1-Day Low</InputLabel>
              <SSelect
                key="one1DayLow"
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
              <Input
                name="InputOne1DayLow"
                onChange={this.handleInputChange}
                value={this.state.InputOne1DayLow}
              />
            </SFormControl>
            <SFormControl value={this.state.one1DayHigh}>
              <InputLabel htmlFor="one1DayHigh">1 Day High</InputLabel>
              <SSelect
                key="one1DayHigh"
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
                value={this.state.InputOne1DayHigh}
              />
            </SFormControl>
            <SFormControl value={this.state.twelve12MonthLow}>
              <InputLabel htmlFor="twelve12MonthLow">12-Month Low</InputLabel>
              <SSelect
                key="twelve12MonthLow"
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
                value={this.state.InputTwelve12MonthLow}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.one1MonthLow}>
              <InputLabel htmlFor="one1MonthLow">1-Month Low</InputLabel>
              <SSelect
                key="one1MonthLow"
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
                value={this.state.InputOne1MonthLow}
              />
            </SFormControl>
            <SFormControl value={this.state.one1MonthHigh}>
              <InputLabel htmlFor="one1MonthHigh">1-Month High</InputLabel>
              <SSelect
                key="one1MonthHigh"
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
                value={this.state.InputOne1MonthHigh}
              />
            </SFormControl>
            <SFormControl value={this.state.twelve12MonthHigh}>
              <InputLabel htmlFor="twelve12MonthHigh">12-Month High</InputLabel>
              <SSelect
                key="twelve12MonthHigh"
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
                value={this.state.InputTwelve12MonthHigh}
              />
            </SFormControl>
          </SColumnForm>
        </SContainer>
      </MainWrapper>
    )
  }
}

const SContainer = styled.form`
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

  text-align: left;
  padding: 10px 0 0px;
  color: rgb(255, 255, 255);

  font-size: 0.7em;
  line-height: 0.7em;
`

const SFormControl = styled(FormControl)`
  width: 150px;

  & ${Input} {
    display: ${(props: { value?: boolean | string }) =>
      props.value && !(props.value === 'Any') ? 'block' : 'none'};
  }

  && {
    margin: 5px 10px;
  }
`

const SColumnForm = styled.div`
  display: flex;
  flex-direction: column;

  && label {
    font-size: 0.7em;
  }
`

const ToggleFiltersContainer = styled.div`
  font-family: Roboto;
  color: white;
  text-align: center;
  user-select: none;
  padding: 20px;
  width: 57vw;
`

// TODO: Just a hack, replace it with the normal material-ui ovverriding withStyles
const SSelect = styled(Select)`
  && > div > div {
    min-height: 0.8em;
  }

  && svg {
    font-size: 1.7em;
    top: calc(50% - 12px);
  }

  && {
    font-size: 0.7em;
  }
`

const SFilterWrapper = styled.div`
  display: flex;
`
