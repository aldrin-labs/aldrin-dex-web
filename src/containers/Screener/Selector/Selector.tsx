import React, { SyntheticEvent } from 'react'
import { MenuItem } from 'material-ui/Menu'
import { FormControl } from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import SelectReact, { components } from 'react-select'
import styled from 'styled-components'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import Slider from '@material-ui/lab/Slider'
import { IProps, IState } from './Selector.types'
import { data } from './selectsData'
import dropDownIcon from '@icons/baseline-arrow_drop_down.svg'
import SaveIcon from 'material-ui-icons/Save'
import DeleteIcon from 'material-ui-icons/Delete'

const initialState = {
  timeInterval: '',
  industry: [],

  marketCapSlider: '',
  changeInPercentage: '',
  simpleMovingAverage: '',
  closingPriceAverage: '',
  averageVolume: '',
  averageVolumeOnBalance: '',
  low: '',
  high: '',

  changeInPercentageInput: '',
  simpleMovingAverageInput: '',
  closingPriceAverageInput: '',
  averageVolumeInput: '',
  averageVolumeOnBalanceInput: '',

  showFilters: false,
}

export default class ScreenerSelect extends React.Component<IProps, IState> {
  state: IState = Object.assign({}, initialState)

  changeInPercentageRef = React.createRef()
  simpleMovingAverageRef = React.createRef()
  closingPriceAverageRef = React.createRef()
  averageVolumeRef = React.createRef()
  averageVolumeOnBalanceRef = React.createRef()

  componentWillMount = () => {
    const savedState = JSON.parse(localStorage.getItem('savedState'))

    if (savedState) {
      this.loadValuesFromLocalStorage()
    }
  }

  handleSliderChange = (event: SyntheticEvent, value: string | number) => {
    this.setState({
      [event.target.id]: value,
    })
  }

  handleSelectChangeWithInput(
    name: string,
    optionSelected: { label: string; value: string } | null,
    actionObj: { action: string }
  ) {
    const value = optionSelected ? optionSelected : ''

    console.log('action: ', actionObj)

    switch (actionObj.action) {
      case 'clear': {
        this.setState(
          {
            [name]: value,
            [`${name}Input`]: '',
          },
          () => {
            console.log(this.state)
          }
        )

        return
      }
      case 'select-option': {
        this.setState(
          {
            [name]: value,
          },
          () => {
            console.log(this.state)
          }
        )

        this[`${name}Ref`].current.focus()

        return
      }
      default:
        return
    }
  }

  handleSelectChangeWithoutInput(
    name: string,
    optionSelected: { label: string; value: string } | null
  ) {
    const value = optionSelected ? optionSelected : ''

    console.log(optionSelected)

    this.setState(
      {
        [name]: value,
      },
      () => {
        console.log(this.state)
      }
    )
  }

  handleSelectChangeMaterial = (event: SyntheticEvent) => {
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

  handleToggleFilters = () => {
    this.setState((prevState) => ({ showFilters: !prevState.showFilters }))
  }

  handleSaveClick = () => {
    this.updateLocalStorage()
  }

  handleDeleteAllClick = () => {
    this.deleteCurrentValues()
  }

  deleteCurrentValues = () => {
    this.setState({ ...initialState, showFilters: true })
  }

  updateLocalStorage = () => {
    localStorage.setItem('savedState', JSON.stringify(this.state))
  }

  loadValuesFromLocalStorage = () => {
    const savedState = JSON.parse(localStorage.getItem('savedState'))

    this.setState(savedState)
  }

  render() {
    const { showFilters } = this.state

    return (
      <MainWrapper>
        <ToggleFiltersContainer onClick={this.handleToggleFilters}>
          Screener
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
        <ButtonsContainer>
          <ActionButton onClick={this.handleSaveClick}>
            <SaveIcon />
          </ActionButton>
          <ActionButton isDeleteColor={true} onClick={this.handleDeleteAllClick}>
            <DeleteIcon />
          </ActionButton>
        </ButtonsContainer>
        <SContainer autoComplete="off" showFilters={showFilters}>
          <SColumnForm>
            <SFormControl value={this.state.timeInterval}>
              <SelectLabel>Time interval</SelectLabel>
              <SelectR
                styles={customStyles}
                isClearable
                placeholder=""
                value={this.state.timeInterval}
                options={data.timeInterval}
                components={{ DropdownIndicator }}
                onChange={this.handleSelectChangeWithoutInput.bind(
                  this,
                  'timeInterval'
                )}
              />
            </SFormControl>

            <SFormControl>
              <SelectLabel>Industry</SelectLabel>
              <SSelect
                key="industry"
                value={this.state.industry}
                onChange={this.handleSelectChangeMaterial}
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
              <SelectLabel>Simple Moving Average</SelectLabel>
              <SelectR
                styles={customStyles}
                isClearable
                placeholder=""
                value={this.state.simpleMovingAverage}
                options={data.simpleMovingAverage}
                components={{ DropdownIndicator }}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'simpleMovingAverage'
                )}
              />
              <Input
                name="simpleMovingAverageInput"
                onChange={this.handleInputChange}
                value={this.state.simpleMovingAverageInput}
                innerRef={this.simpleMovingAverageRef}
              />
            </SFormControl>
            <SFormControl value={this.state.closingPriceAverage}>
              <SelectLabel>Closing Price Average</SelectLabel>
              <SelectR
                styles={customStyles}
                isClearable
                placeholder=""
                value={this.state.closingPriceAverage}
                options={data.closingPriceAverage}
                components={{ DropdownIndicator }}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'closingPriceAverage'
                )}
              />
              <Input
                name="closingPriceAverageInput"
                onChange={this.handleInputChange}
                value={this.state.closingPriceAverageInput}
                innerRef={this.closingPriceAverageRef}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl>
              <SelectLabel>Market Cap Slider</SelectLabel>
              <STextField
                fullWidth
                select
                value={[{ label: 100, value: 200 }]}
                SelectProps={{
                  multiple: true,

                  MenuProps: {
                    PaperProps: {
                      style: {
                        background: '#ff',
                      },
                    },
                  },
                  renderValue: () => this.state.marketCapSlider.toString(),
                }}
              >
                <SliderContainer>
                  <SliderWrapper>
                    <SliderLabel>Market Cap Slider</SliderLabel>
                    <SliderMaterial
                      id="marketCapSlider"
                      value={this.state.marketCapSlider}
                      step={1}
                      aria-labelledby="label"
                      min={0}
                      max={100}
                      onChange={this.handleSliderChange}
                    />
                    <SliderValueWrapper>
                      {this.state.marketCapSlider}
                    </SliderValueWrapper>
                  </SliderWrapper>
                </SliderContainer>
              </STextField>
            </SFormControl>
            <SFormControl value={this.state.changeInPercentage}>
              <SelectLabel>Change %</SelectLabel>
              <SelectR
                styles={customStyles}
                isClearable
                placeholder=""
                value={this.state.changeInPercentage}
                options={data.changeInPercentage}
                components={{ DropdownIndicator }}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'changeInPercentage'
                )}
              />
              <Input
                name="changeInPercentageInput"
                onChange={this.handleInputChange}
                value={this.state.changeInPercentageInput}
                innerRef={this.changeInPercentageRef}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.averageVolume}>
              <SelectLabel>Average Volume</SelectLabel>
              <SelectR
                styles={customStyles}
                isClearable
                placeholder=""
                value={this.state.averageVolume}
                options={data.averageVolume}
                components={{ DropdownIndicator }}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'averageVolume'
                )}
              />
              <Input
                name="averageVolumeInput"
                onChange={this.handleInputChange}
                value={this.state.averageVolumeInput}
                innerRef={this.averageVolumeRef}
              />
            </SFormControl>
            <SFormControl value={this.state.averageVolumeOnBalance}>
              <SelectLabel>On-Balance Volume</SelectLabel>
              <SelectR
                styles={customStyles}
                isClearable
                placeholder=""
                value={this.state.averageVolumeOnBalance}
                options={data.averageVolumeOnBalance}
                components={{ DropdownIndicator }}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'averageVolumeOnBalance'
                )}
              />
              <Input
                name="averageVolumeOnBalanceInput"
                onChange={this.handleInputChange}
                value={this.state.averageVolumeOnBalanceInput}
                innerRef={this.averageVolumeOnBalanceRef}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.low}>
              <SelectLabel>Low</SelectLabel>
              <SelectR
                styles={customStyles}
                isClearable
                placeholder=""
                options={data.low}
                value={this.state.low}
                components={{ DropdownIndicator }}
                onChange={this.handleSelectChangeWithoutInput.bind(this, 'low')}
              />
            </SFormControl>
            <SFormControl value={this.state.high}>
              <SelectLabel>High</SelectLabel>
              <SelectR
                styles={customStyles}
                isClearable
                placeholder=""
                options={data.high}
                value={this.state.high}
                components={{ DropdownIndicator }}
                onChange={this.handleSelectChangeWithoutInput.bind(
                  this,
                  'high'
                )}
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
    return {
      [':hover']: {
        color: '#fff',
      },
      display: 'flex',
      width: '19px',
      boxSizing: 'border-box',
      color: 'hsl(0, 0%, 80%)',
      padding: '2px',
      transition: 'color 150ms',
    }
  },
  dropdownIndicator: (base, state) => ({
    [':hover']: {
      color: '#fff',
    },
    display: 'flex',
    boxSizing: 'border-box',
    color: 'hsl(0, 0%, 80%)',
    transition: 'color 150ms',
  }),
  valueContainer: (base, state) => ({
    ...base,
    paddingLeft: 0,
  }),
  singleValue: (base, state) => ({
    ...base,
    color: '#fff',
    marginLeft: '0',
  }),
  placeholder: (base, state) => ({
    ...base,
    marginLeft: 0,
  }),
  input: (base, state) => ({
    ...base,
    color: '#fff',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
}

const DropdownIndicator = (props) =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <SvgIcon
        src={dropDownIcon}
        width={19}
        height={19}
        style={{
          verticalAlign: 'middle',
        }}
      />
    </components.DropdownIndicator>
  )

const SContainer = styled.form`
  display: ${(props: { showFilters?: boolean }) =>
    props.showFilters ? 'flex' : 'none'};
`

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  position: static;
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
  padding: 10px 0 0;
  color: rgb(255, 255, 255);

  font-size: 0.7em;
  line-height: 0.7em;
`

// TODO: remove any from the opacity & pointer-events props

const SFormControl = styled(FormControl)`
  width: 150px;
  min-height: 63px;

  & ${Input} {
    opacity: ${(props: { value?: boolean | string | string[] }) =>
      props.value && props.value!.hasOwnProperty('value') ? '1' : '0'};
  }

  & ${Input} {
    pointer-events: ${(props: { value?: boolean | string | string[] }) =>
      props.value && props.value!.hasOwnProperty('value') ? 'auto' : 'none'};
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
  padding: 20px 20px 35px;
  width: 57vw;
`

const ButtonsContainer = styled.div`
  display: flex;
  user-select: none;
  flex-direction: column;
  position: absolute;
  top: 110px;
  right: 30px;
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
    font-size: 12px;
    margin-top: 0;
  }
`

const SelectR = styled(SelectReact)`
  font-family: Roboto;
  font-size: 12px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
  }
`

const SelectLabel = styled.label`
  font-size: 0.6em;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  line-height: 1;
`

const SliderWrapper = styled.div`
  width: 100px;
  outline: none;
`

const SliderLabel = styled.div`
  text-align: center;
  font-size: 0.6em;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  line-height: 1;
`

const SliderMaterial = styled(Slider)`
  & > div {
    background-color: rgb(78, 216, 218);
  }
`

const SliderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
`

const SliderValueWrapper = styled.div`
  text-align: center;
  color: #fff;
`

const STextField = styled(TextField)`
  && svg {
    font-size: 1.7em;
    top: calc(50% - 12px);
  }

  && > div {
    font-size: 12px;
    margin-top: 0;
  }
`

const ActionButton = styled.button`
  border: none;
  margin: 0;
  padding: 1.75px 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  text-align: inherit;
  outline: none;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  & svg {
    color: white;
    padding-bottom: 7px;
    width: 33px;
    height: 33px;
  }

  &:hover svg {
      color: ${(props: { isDeleteColor?: boolean }) =>
  props.isDeleteColor ? '#f44336' : '#4caf50'};
}
`

const Label = styled.label``

const Span = styled.span``

const Checkbox = styled.input`
  display: none;

  & + ${Label} ${Span} {
    display: inline-block;

    width: 18px;

    height: 18px;

    cursor: pointer;
    vertical-align: middle;

    border: 1.5px solid #909294;
    border-radius: 3px;
    background-color: transparent;
  }

  & + ${Label}:hover ${Span} {
    border-color: #4ed8da;
  }

  &:checked + ${Label} ${Span} {
    border-color: #4ed8da;
    background-color: #4ed8da;
    background-image: url('https://image.flaticon.com/icons/png/128/447/447147.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 14px;
  }
`

const CheckBoxLabel = styled.label`
  color: #fff;
  font-family: Roboto;
  padding-left: 10px;
  padding-top: 1px;
`

const CheckBoxContainer = styled.div`
  display: flex;
`
