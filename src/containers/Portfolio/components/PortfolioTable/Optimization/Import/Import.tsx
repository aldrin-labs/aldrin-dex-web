import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { ApolloConsumer } from 'react-apollo'
import MdReplay from '@material-ui/icons/Replay'
import { Button as ButtonMUI, Typography } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import { isEqual } from 'lodash-es'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import BarChart from '@components/BarChart/BarChart'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'
import { RebalancePeriod, RiskProfile } from './dataForSelector'
import ReactSelectComponent from '@components/ReactSelectComponent'
import Table from '@containers/Portfolio/components/PortfolioTable/Optimization/Table/Table'
import SwitchButtons from '@components/SwitchButtons/SwitchButtons'
import { MOCK_DATA } from '@containers/Portfolio/components/PortfolioTable/dataMock'
import {
  IProps,
  IData,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/Import/Import.types'
import { OPTIMIZE_PORTFOLIO } from '@containers/Portfolio/components/PortfolioTable/Optimization/api'
import {
  SwitchButtonsWrapper,
  InputContainer,
  TableContainer,
  Chart,
  ImportData,
} from './Import.styles'

const mockData = [
  { coin: 'BCH', percentage: 10.87 },
  { coin: 'ETH', percentage: 10.89 },
  { coin: 'LTC', percentage: 78 },
]

export default class Import extends PureComponent<IProps> {
  state = {
    baseCoin: 'USDT',
    rebalancePeriod: null,
    isRiskFreeAssetEnabled: true,
    riskProfile: null,
    focusedInput: false,
    startDate: null,
    endDate: null,
    optimizedData: [],

    percentages: [2, 7, 12, 17, 22],
  }

  componentDidMount() {
    this.importPortfolio()
  }
  importPortfolio = () => {
    let assets
    if (this.props.isShownMocks) {
      assets = this.props.transformData(MOCK_DATA)
    } else {
      assets =
        this.props.data &&
        this.props.data.myPortfolios[0] &&
        this.props.transformData(this.props.data.myPortfolios[0].portfolioAssets)
    }

    console.log('assets in import portfolio', assets);

    // this.props.updateData(this.sumSameCoins(assets))
    this.props.updateData(assets)
  }

  // sumSameCoins = (rawData: IData[]) => {
  //   let data: IData[] = []
  //   if (!rawData) return
  //   rawData.forEach((asset) => {
  //     const index = data.findIndex((obj) => obj.coin === asset.coin)
  //     if (index >= 0) {
  //       data = data.map(
  //         (el, inx) =>
  //           inx === index
  //             ? Object.assign(el, {
  //                 coin: el.coin,
  //                 percentage:
  //                   Number(asset.percentage) + Number(data[index].percentage),
  //               })
  //             : el
  //       )
  //     } else {
  //       data.push(asset)
  //     }
  //   })
  //
  //   const result = data.map((asset) => {
  //     const { coin, percentage } = asset
  //
  //     return { coin, percentage: Number(percentage) }
  //   })
  //
  //   return result
  // }

  newOptimizeButtonClick = async (
    client: any,
    storeData: IData[],
    baseCoin: string,
    rebalancePeriod: number,
    isRiskFreeAssetEnabled: boolean,
    riskProfile: null,
    startDate: object,
    endDate: object
  ) => {
    // console.log('client', client)
    // console.log('storeData', storeData)
    // console.log('baseCoin', baseCoin)
    // console.log('rebalancePeriod', +rebalancePeriod)
    // console.log('isRiskFreeAssetEnabled', +isRiskFreeAssetEnabled)
    // console.log('riskProfile', riskProfile)
    // console.log('startDate', startDate)
    // console.log('endDate', endDate)

    this.props.toggleLoading()

    const { showWarning, optimizedToState, activeButton, updateData } = this.props

    const mockForQuery = {
      rebalancePeriod: 13,
      riskProfile: '',
      baseCurrency: 'USDT',
      riskFree: 1,
      initialCapital: 1000.0012,
      coinList: ['BCH', 'ETH', 'LTC'],
      startDate: 1531441380,
      endDate: 1531873380,
    }


    //   period: 7,
    //   risk_profile: "medium",
    //   base_currency :"USDT",
    //   risk_free: 1,
    //   initial_capital : 1368.99,
    //   coinList: ["ETH","BCH","EOS","LTC","DASH"],
    //   startDate: 1534082400,
    //   endDate:1536760800

    const otherMockForQuery = {
      rebalancePeriod: 7,
      riskProfile: 'medium',
      baseCurrency: 'USDT',
      riskFree: 1,
      initialCapital: 1368.99,
      coinList: ["ETH","BCH","EOS","LTC","DASH"],
      startDate: 1534082400,
      endDate: 1536760800,
    }

    const myObj = {
      coinList: storeData.map((el: IData) => el.coin),
      // coinList: [
      //   'ETH',
      //   'BCH',
      //   'TRX',
      //   'EOS',
      //   'LTC',
      //   'BTC',
      //   'ADA',
      //   'DASH',
      //   'XLM',
      // ],
      initialCapital: +storeData
        .reduce((acc, el: IData) => acc + +el.percentage, 0)
        .toFixed(2),
      baseCurrency: baseCoin,
      rebalancePeriod: +rebalancePeriod,
      riskFree: +isRiskFreeAssetEnabled,
      riskProfile: riskProfile,
      // startDate: 1528392417,
      // endDate: 1533662817,
      // startDate: +startDate._d/1000,
      // endDate: +endDate._d/1000,
      startDate: startDate.unix(),
      endDate: endDate.unix(),
    }

    console.log('myOb for queryj', myObj)

    const backendResult = await client.query({
      query: OPTIMIZE_PORTFOLIO,
      variables: {
        ...myObj,
        // ...mockForQuery,
        // ...otherMockForQuery,
        // coinList: storeData.map((el: IData) => el.coin),
        // initialCapital: storeData.reduce((acc, el: IData) => {return acc += +el.percentage}, 0),
        // baseCurrency: baseCoin,
        // rebalancePeriod: +rebalancePeriod,
        // riskFree: +isRiskFreeAssetEnabled,
        // riskProfile: riskProfile,
        // startDate: +startDate._d/1000,
        // endDate: +endDate._d/1000,
      },
      fetchPolicy: 'network-only',
    })


    if (backendResult.data.portfolioOptimization === '') {
      showWarning('You get empty response! 🙈')
      this.props.toggleLoading()

      return
    }
    // console.log('awaiteDDDD');

    console.log('backendResult unparsed', backendResult);


    this.props.toggleLoading()
    this.props.setActiveButtonToDefault()
    const backendResultParsed = JSON.parse(
      backendResult.data.portfolioOptimization
    )
    // console.log(backendResultParsed)

    const optimizedData = backendResultParsed.returns

    this.setState({ optimizedData })
    optimizedToState(optimizedData)

    if (storeData.length < optimizedData[activeButton].portfolio_coins_list.length) {
      // console.log('storeData.length < optimizedData');
      this.addRow('USDT', 0)
    }
  }

  onOptimizeButtonClick = async (
    client: any,
    startDate: number,
    endDate: number,
    storeData: IData[],
    expectedReturn: string,
    showWarning: Function,
    optimizePortfolio: Function,
    optimizedToState: Function
  ) => {
    if (this.props.isShownMocks) {
      optimizePortfolio()

      return
    }

    const fakeBackendData = await client.query({
      query: OPTIMIZE_PORTFOLIO,
      variables: {
        expectedPct: Number(expectedReturn) / 100,
        coinList: storeData.map((el: IData) => el.coin),
        startDate,
        endDate,
      },
      fetchPolicy: 'network-only',
    })
    this.props.toggleLoading()

    setTimeout(async () => {
      const { data: backendData } = await client.query({
        query: OPTIMIZE_PORTFOLIO,
        variables: {
          expectedPct: Number(expectedReturn) / 100,
          coinList: storeData.map((el: IData) => el.coin),
          startDate,
          endDate,
        },
        fetchPolicy: 'network-only',
      })

      this.props.toggleLoading()
      this.props.setActiveButtonToDefault()

      if (backendData.portfolioOptimization === '') {
        showWarning('You get empty response! 🙈')

        return
      }

      const backendDataParsed = JSON.parse(backendData.portfolioOptimization)
        .weights_list

      optimizedToState(backendDataParsed)

      const isReturnedCoinsTheSameThatInputed = isEqual(
        backendDataParsed[2].weighted_coins_optimized
          .map((el: IData) => el.coin)
          .sort(),
        storeData.map((el) => el.coin).sort()
      )

      if (!isReturnedCoinsTheSameThatInputed) {
        console.log('Output coins not the same as input coins!')
      }

      optimizePortfolio(backendDataParsed[2])
    }, 2000)
  }


  addRow = (name: string, value: number) => {
    if (this.props.storeData.some((el)=> el.coin === name)) {
      return
    }

    if (this.props.filterValueSmallerThenPercentage >= 0) {
      this.props.showWarning('Turn off the filter first to see new coins.')
    }

    if (name) {
      this.props.updateData(
        [
          ...this.props.storeData,
          { coin: name, percentage: value },
        ]
      )
    }
  }
  deleteRow = (i: number) =>
    this.props.updateData(
      [...this.props.storeData].filter((el, index) => i !== index)
    )

  deleteAllRows = () => this.props.updateData([])

  renderBarChart = () => {
    const { storeData, activeButton,  theme } = this.props
    const { optimizedData } = this.state

    if (!storeData) return
    const formatedData = storeData.map((el: IData, i) => ({
      x: el.coin,
      y: Number(Number(el.percentage).toFixed(2)),
    }))

    // console.log('storeData', storeData);

    // const formatedOptimizedData = optimizedData.map((el: IData, i) => ({
    //   x: el.coin,
    //   y: Number(Number(el.percentage).toFixed(2)),
    // }))
    const formatedOptimizedData = optimizedData.length ? storeData.map((el, i) => ({
      x: el.coin,
      y: +((optimizedData[activeButton].weights[i] * 100).toFixed(2)),
    }) ) : []

    const barChartData = [
      {
        data: formatedData,
        title: 'Original',
        color: '#2496c8',
      },
      {
        data: formatedOptimizedData,
        title: 'Optimized',
        color: '#1869a8',
      },
    ]

    return (
      <ChartContainer background={theme.palette.background.paper}>
        <Chart background={theme.palette.background.default}>
          <BarChart
            height={350}
            showPlaceholder={formatedData.length === 0}
            charts={barChartData}
            alwaysShowLegend={true}
            hideDashForToolTip={true}
          />
        </Chart>
      </ChartContainer>
    )
  }

  onDatesChange = ({ startDate, endDate }) =>
    this.setState({ startDate, endDate })

  onFocusChange = (focusedInput) => this.setState({ focusedInput })

  onToggleRiskSwitch = (e, che) =>
    this.setState({ isRiskFreeAssetEnabled: che }, () => {
      console.log(this.state)
    })

  onSelectChange = (
    name: string,
    optionSelected?: { label: string; value: string } | null
  ) => {
    const value =
      optionSelected && !Array.isArray(optionSelected)
        ? optionSelected.value
        : ''
    this.setState({ [name]: value })

    // console.log('this.staete.startDate', this.state.startDate);

    // console.log(+this.state.startDate._d);
    // console.log(+this.state.endDate._d);
  }

  render() {
    const {
      expectedReturn,
      optimizePortfolio,
      optimizedToState,
      handleChange,
      storeData, // data from redux (data from portfolio and mannualy added)
      optimizedData,
      // startDate,
      // endDate,
      optimizationPeriod,
      setPeriod,
      onBtnClick,
      onNewBtnClick,
      // percentages,
      filterValueSmallerThenPercentage,
      activeButton,
      showSwitchButtons, // optimizedData.length >= 1
      showWarning,
      theme,
    } = this.props

    const {
      baseCoin,
      rebalancePeriod,
      isRiskFreeAssetEnabled,
      riskProfile,
      startDate,
      endDate,
    } = this.state

    let assets: IData[]
    if (this.props.isShownMocks) {
      assets = MOCK_DATA
    } else {
      assets =
        this.props.data &&
        this.props.data.myPortfolios[0] &&
        this.props.transformData(this.props.data.myPortfolios[0].portfolioAssets)
    }

    if (!storeData) {
      return (
        <Typography variant="display1" color="error">
          Erorr during download. Please Refresh the page.{' '}
        </Typography>
      )
    }

    // console.log('assets in RENDER', assets);
    //
    // console.log('storeData in RENDER', storeData);


    const textColor: string = this.props.theme.palette.getContrastText(
      this.props.theme.palette.background.paper
    )

    const fontFamily = theme.typography.fontFamily

    // move it to the state
    const maximumDate = moment()
    const minimumDate = moment().subtract(3, 'years')

    // console.log('maxumumDate', maximumDate);
    // console.log('minimumDate', minimumDate);


    const isAllOptionsFilled =
      baseCoin &&
      rebalancePeriod &&
      riskProfile &&
      startDate &&
      endDate

    return (
      <ApolloConsumer>
        {(client) => (
          <ImportData>
            <TableSelectsContaienr>
            <InputContainer background={theme.palette.background.paper}>
              <InputElementWrapper>
                <StyledInputLabel color={textColor}>Base coin</StyledInputLabel>
                <STextField
                  color={textColor}
                  value={this.state.baseCoin}
                  disabled={true}
                />
              </InputElementWrapper>
              <InputElementWrapper>
                <StyledInputLabel color={textColor}>
                  Rebalance period
                </StyledInputLabel>
                <SelectOptimization
                  options={RebalancePeriod}
                  isClearable={true}
                  singleValueStyles={{
                    fontSize: '0.875rem',
                  }}
                  placeholderStyles={{
                    fontSize: '0.875rem',
                  }}
                  optionStyles={{
                    fontSize: '0.875rem',
                  }}
                  onChange={(
                    optionSelected: { label: string; value: string } | null
                  ) => this.onSelectChange('rebalancePeriod', optionSelected)}
                />
              </InputElementWrapper>
              <InputElementWrapper>
                <StyledInputLabel color={textColor}>
                  Date range
                </StyledInputLabel>
                <StyledWrapperForDateRangePicker
                  color={textColor}
                  background={theme.palette.background.paper}
                  fontFamily={fontFamily}
                >
                  <DateRangePicker
                    isOutsideRange={(date) =>
                      date.isBefore(minimumDate, 'day') ||
                      date.isAfter(maximumDate, 'day')
                    }
                    startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
                    displayFormat="MM-DD-YYYY"
                  />
                </StyledWrapperForDateRangePicker>
              </InputElementWrapper>
              <InputElementWrapper>
                <StyledInputLabel color={textColor}>
                  Risk free asset
                </StyledInputLabel>
                <FlexWrapper>
                  <StyledSwitch
                    onChange={this.onToggleRiskSwitch}
                    checked={this.state.isRiskFreeAssetEnabled}
                  />
                </FlexWrapper>
              </InputElementWrapper>
              <InputElementWrapper>
                <StyledInputLabel color={textColor}>
                  Risk profile
                </StyledInputLabel>
                <SelectOptimization
                  options={RiskProfile}
                  isClearable={true}
                  singleValueStyles={{
                    fontSize: '0.875rem',
                  }}
                  placeholderStyles={{
                    fontSize: '0.875rem',
                  }}
                  optionStyles={{
                    fontSize: '0.875rem',
                  }}
                  onChange={(
                    optionSelected: { label: string; value: string } | null
                  ) => this.onSelectChange('riskProfile', optionSelected)}
                />
              </InputElementWrapper>
              {/*<SelectDates*/}
              {/*setPeriodToStore={setPeriod}*/}
              {/*period={optimizationPeriod}*/}
              {/*/>*/}
              {/*<Input*/}
              {/*color={textColor}*/}
              {/*type="number"*/}
              {/*placeholder="Expected return in %"*/}
              {/*value={expectedReturn || ''}*/}
              {/*onChange={(e) => {*/}
              {/*handleChange(e)*/}
              {/*}}*/}
              {/*/>*/}

              {/*<ButtonMUI*/}
              {/*style={{ marginTop: '1rem' }}*/}
              {/*color={'secondary'}*/}
              {/*variant={'outlined'}*/}
              {/*disabled={expectedReturn === '' || (data && data.length < 1)}*/}
              {/*onClick={() => {*/}
              {/*this.onOptimizeButtonClick(*/}
              {/*client,*/}
              {/*startDate,*/}
              {/*endDate,*/}
              {/*storeData,*/}
              {/*expectedReturn,*/}
              {/*showWarning,*/}
              {/*optimizePortfolio,*/}
              {/*optimizedToState*/}
              {/*)*/}
              {/*}}*/}
              {/*>*/}
              {/*Optimize Portfolio*/}
              {/*</ButtonMUI>*/}
              <ButtonMUI
                style={{ marginTop: '1rem' }}
                color={'secondary'}
                variant={'outlined'}
                disabled={!isAllOptionsFilled}
                // disabled={expectedReturn === '' || (data && data.length < 1)}
                onClick={() => {
                  this.newOptimizeButtonClick(
                    client,
                    storeData,
                    baseCoin,
                    rebalancePeriod,
                    isRiskFreeAssetEnabled,
                    riskProfile,
                    startDate,
                    endDate
                  )
                }}
              >
                Optimize Portfolio
              </ButtonMUI>
            </InputContainer>

            <TableContainer background={theme.palette.background.paper}>
              <SwitchButtonsWrapper>
                <SwitchButtons
                  btnClickProps={client}
                  onBtnClick={onNewBtnClick}
                  values={this.state.percentages}
                  show={this.state.optimizedData.length > 1}
                  activeButton={activeButton}
                />
                <ButtonMUI
                  disabled={isEqual(assets, storeData)}
                  color="secondary"
                  style={{
                    alignSelf: 'center',
                  }}
                  variant="fab"
                  onClick={this.importPortfolio}
                >
                  <MdReplay />
                </ButtonMUI>
              </SwitchButtonsWrapper>
              <Table
                onPlusClick={this.addRow}
                data={storeData}
                optimizedData={
                  this.state.optimizedData.length > 1
                    ? this.state.optimizedData[activeButton].weights
                    : []
                }
                withInput={true}
                onClickDeleteIcon={this.deleteRow}
                filterValueSmallerThenPercentage={
                  filterValueSmallerThenPercentage
                }
                theme={this.props.theme}
              />
              {/*<TableDataDesc show={this.state.optimizedData.length > 1}>*/}
                {/*<StyledInputLabel color={textColor}>*/}
                  {/*Confidence:{' '}*/}
                  {/*{this.state.optimizedData.length > 1*/}
                    {/*? this.state.optimizedData[activeButton]*/}
                        {/*.confidence*/}
                    {/*: ''}*/}
                {/*</StyledInputLabel>*/}
                {/*<StyledInputLabel color={textColor}>*/}
                  {/*Expected return low:{' '}*/}
                  {/*{this.state.optimizedData.length > 1*/}
                    {/*? this.state.optimizedData[activeButton]*/}
                        {/*.exptd_rtrn_low_end*/}
                    {/*: ''}*/}
                {/*</StyledInputLabel>*/}
                {/*<StyledInputLabel color={textColor}>*/}
                  {/*Expected return high:{' '}*/}
                  {/*{this.state.optimizedData.length > 1*/}
                    {/*? this.state.optimizedData[activeButton]*/}
                        {/*.exptd_rtrn_high_end*/}
                    {/*: ''}*/}
                {/*</StyledInputLabel>*/}
              {/*</TableDataDesc>*/}
            </TableContainer>
          </TableSelectsContaienr>
            {this.renderBarChart()}
          </ImportData>
        )}
      </ApolloConsumer>
    )
  }
}

const TableDataDesc = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0.5rem 0.5rem 0.5rem;
  opacity: ${(props: { show: boolean }) => (props.show ? '100' : 0)};
  transition: all 100ms;

  & > label {
    margin: 0.3rem;
  }
`

const FlexWrapper = styled.div`
  height: 35px;
  display: flex;
  align-items: center;
`

const SelectOptimization = styled(ReactSelectComponent)`
  min-height: 35px;
  width: 90px;

  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
  }
`

const StyledInputLabel = styled(InputLabel)`
  color: ${(props: { color: string }) => props.color};
  //font-size: 0.75rem;
  font-size: 0.875rem;
`

const InputElementWrapper = styled.div`
  margin-bottom: 22px;
  display: flex;
  flex-direction: column;
  //margin-bottom: 14px;

  &:not(:nth-child(3)) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const STextField = styled(TextField)`
  width: 90px;
  && > div:before {
    border-bottom: 1px solid #c1c1c1;
  }
  
  && > div {
    font-size: 0.875rem;
  }
`

const StyledSwitch = styled(Switch)``

const StyledWrapperForDateRangePicker = styled.div`
  width: 206px;
  padding: 6px 0;

  & .DateInput {
    width: 95px;
  }

  & .DateInput:first-child .DateInput_input {
    padding-left: 0;
  }

  & .DateInput_input {
    padding: 5px;
    //font-size: 14px;
    font-size: 0.875rem;
    font-family: ${(props: { fontFamily: string }) => props.fontFamily};
    font-weight: 400;
    height: 36px;
    color: ${(props: { color: string }) => props.color};
    background: ${(props: { background: string }) => props.background};
  }

  & .DateRangePicker_picker {
    font-family: ${(props: { fontFamily: string }) => props.fontFamily};
    z-index: 10;
  }

  & .DateRangePickerInput {
    border: 0;
    background: ${(props: { background: string }) => props.background};
    border-bottom: 1px solid #c1c1c1;
  }

  & .DateInput_input__focused {
    border-bottom: 1px solid #fff;
    transition: all 100ms;
  }

  & .DateRangePickerInput_arrow_svg {
    fill: ${(props: { color: string }) => props.color};
    width: 14px;
    height: 14px;
  }
`

const ChartContainer = styled.div`
  min-height: 400px;
  width: 49%;
  margin: 0 0 0 2rem;
  padding: 15px;
  box-shadow: 0 2px 6px 0 #00000066;
  background: ${(props: { background: string }) => props.background};
`


const TableSelectsContaienr = styled.div`
  width: 49%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`
