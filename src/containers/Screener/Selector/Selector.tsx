import React from 'react'
import { InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl } from 'material-ui/Form'
import Typography from 'material-ui/Typography'
import Select from 'material-ui/Select'
import SelectReact from 'react-select'
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
    low: '',
    high: '',

    marketCapInput: '',
    changeInPercentageInput: '',
    simpleMovingAverageInput: '',
    closingPriceAverageInput: '',
    averageVolumeInput: '',
    averageVolumeOnBalanceInput: '',
    lowInput: '',
    highInput: '',

    showFilters: false,
  }

  myRef = React.createRef()

  handleInputNewChange = (...sd) => {
    console.log('sd', sd)
  }

  onChangeFunc(name, optionSelected, action) {
    const value = optionSelected ? optionSelected.value : ''

    console.log('action: ', action)


    this.setState({
      [name]: value,
    }, () => {
      console.log(this.state);
    })

    // this[`myRef`].current.focus()
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
    const { showFilters, closingPriceAverage } = this.state

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
                name="simpleMovingAverageInput"
                onChange={this.handleInputChange}
                value={this.state.simpleMovingAverageInput}
              />
            </SFormControl>
            <SFormControl value={this.state.closingPriceAverage}>
              <Label>
                Closing Price Average
              </Label>
              <SelectR
                styles={customStyles}
                isClearable
                options={data.closingPriceAverage}
                onChange={this.onChangeFunc.bind(this, 'closingPriceAverage')}
                onInputChange={this.handleInputNewChange}
              />
                <Input
                  autoFocus
                  name="closingPriceAverageInput"
                  onChange={this.handleInputChange}
                  value={this.state.closingPriceAverageInput}
                  innerRef={this.myRef}
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
                name="marketCapInput"
                onChange={this.handleInputChange}
                value={this.state.marketCapInput}
              />
            </SFormControl>
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
                name="changeInPercentageInput"
                onChange={this.handleInputChange}
                value={this.state.changeInPercentageInput}
              />
            </SFormControl>
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
                name="averageVolumeInput"
                onChange={this.handleInputChange}
                value={this.state.averageVolumeInput}
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
                name="averageVolumeOnBalanceInput"
                onChange={this.handleInputChange}
                value={this.state.averageVolumeOnBalanceInput}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.low}>
              <InputLabel htmlFor="low">Low</InputLabel>
              <SSelect
                key="low"
                value={this.state.low}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'low',
                  id: 'low',
                }}
              >
                {data.low.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="InputLow"
                onChange={this.handleInputChange}
                value={this.state.InputLow}
              />
            </SFormControl>
            <SFormControl value={this.state.high}>
              <InputLabel htmlFor="high">High</InputLabel>
              <SSelect
                key="high"
                value={this.state.high}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: 'high',
                  id: 'high',
                }}
              >
                {data.high.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
              <Input
                name="high"
                onChange={this.handleInputChange}
                value={this.state.high}
              />
            </SFormControl>
          </SColumnForm>
        </SContainer>
      </MainWrapper>
    )
  }
}

const customStyles = {
  control: () => {
    return {
      position: 'relative',
      boxSizing: 'border-box',
      cursor: 'default',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      outline: '0',
      transition: 'all 100ms',
      backgroundColor: 'transparent',
      minHeight: '0.8em',
      border: 'none',
    }
  },
  menu: (base, state) => ({
    ...base,
    backgroundColor: '#424242',
    minWidth: '250px',
  }),
  option: (base, state) => ({
    ...base,
    color: '#fff',
    fontSize: '1.5em',
    fontFamily: 'Roboto',
    backgroundColor: state.isSelected
      ? 'rgba(255, 255, 255, 0.2)'
      : state.isFocused
        ? 'rgba(255, 255, 255, 0.1)'
        : '#424242',
    [':active']: null,
  }),
  clearIndicator: (base, state) => {
    return ({
      [':hover']: {
        color: '#fff'
      },
      display: 'flex',
      width: '20px',
      boxSizing: 'border-box',
      color: 'hsl(0, 0%, 80%)',
      padding: '2px',
      transition: 'color 150ms',
    })
  },
  dropdownIndicator: (base, state) => ({
    [':hover']: {
      color: '#fff'
    },
    display: 'flex',
    width: '20px',
    boxSizing: 'border-box',
    color: 'hsl(0, 0%, 80%)',
    padding: '2px',
    transition: 'color 150ms',
  }),
  valueContainer: (base, state) => ({
    ...base,
    paddingLeft: 0,
  }),
  singleValue: (base, state) => ({
    ...base,
    color: '#fff',
    marginLeft: '0'
  }),
  placeholder: (base, state) => ({
    ...base,
    marginLeft: 0,
  }),
  input: (base, state) => ({
    ...base,
    color: '#fff'
  })
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

//   & ${Input} {
//     display: ${(props: { value?: boolean | string }) =>
// props.value && !(props.value === 'Any') ? 'block' : 'none'};
// }

const SFormControl = styled(FormControl)`
  width: 150px;
  
  & ${Input} {
  opacity: ${(props: { value?: boolean | string }) =>
  props.value && !(props.value === 'Any') ? '1' : '0'};
}

  && {
    margin: 5px 10px;
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

const SelectR = styled(SelectReact)`
  font-family: Roboto;
  font-size: 12px;
  border-bottom: 1px solid #c1c1c1;

  &:hover {
    border-bottom: 1px solid #fff;
  }
`

const Label = styled.label`
    font-size: 0.6em;
    color: rgba(255, 255, 255, 0.7);
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1;
`

const SFilterWrapper = styled.div`
  display: flex;
`
