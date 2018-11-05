import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { ApolloConsumer } from 'react-apollo'
import MdReplay from '@material-ui/icons/Replay'
import { Button as ButtonMUI, Typography, Card } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import { isEqual } from 'lodash-es'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import BarChart from '@components/BarChart/BarChart'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'
import { RebalancePeriod } from './dataForSelector'
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
import { StyledCardHeader } from '../Optimization.styles'

export default class Import extends PureComponent<IProps> {
  state = {
    baseCoin: 'USDT',
    rebalancePeriod: null,
    isRiskFreeAssetEnabled: true,
    focusedInput: false,
    startDate: null,
    endDate: null,
    percentages: ['min', 'low', 'med', 'high', 'max'],
    totalPriceOfAllAssets: 0,
    initialPortfolio: [],
    isUSDTInInitialPortfolioExists: false,
  }

  componentDidMount() {
    this.importPortfolio()
  }
  importPortfolio = () => {
    const assets = this.props.isShownMocks
      ? this.props.transformData(MOCK_DATA)
      : this.props.data &&
        this.props.data.myPortfolios[0] &&
        this.props.transformData(
          this.props.data.myPortfolios[0].portfolioAssets
        )

    this.props.updateData(assets[0])
    const isUSDTInInitialPortfolioExists = assets[0].some(
      (elem) => elem.coin === 'USDT'
    )
    this.setState({
      isUSDTInInitialPortfolioExists,
      initialPortfolio: assets[0],
      totalPriceOfAllAssets: assets[1],
    })
  }

  newOptimizeButtonClick = async (
    client: any,
    storeData: IData[],
    baseCoin: string,
    rebalancePeriod: number,
    isRiskFreeAssetEnabled: boolean,
    startDate: object,
    endDate: object
  ) => {
    const { totalPriceOfAllAssets, isUSDTInInitialPortfolioExists } = this.state
    const { showWarning, optimizedToState, activeButton } = this.props

    // TODO: Should create another function to remove USDT first, and then optimize
    // should double check for if we have USDT
    if (
      !isUSDTInInitialPortfolioExists &&
      !isRiskFreeAssetEnabled &&
      storeData.some((el) => el.coin === 'USDT')
    ) {
      console.log('delete row')
      this.deleteRowByCoinName('USDT')
      storeData = storeData.filter((el) => el.coin !== 'USDT')
    }

    this.props.toggleLoading()

    const myObj = {
      coinList: storeData.map((el: IData) => el.coin),
      initialCapital: +totalPriceOfAllAssets.toFixed(2),
      baseCurrency: baseCoin,
      rebalancePeriod: +rebalancePeriod,
      riskFree: +isRiskFreeAssetEnabled,
      startDate: startDate.unix(),
      endDate: endDate.unix(),
    }

    console.log('myOb for queryj', myObj)

    let backendResult

    try {
      backendResult = await client.query({
        query: OPTIMIZE_PORTFOLIO,
        variables: {
          ...myObj,
        },
        fetchPolicy: 'network-only',
      })
    } catch (e) {
      showWarning(`You got an error! 🙈`)
      this.props.toggleLoading()
      console.log('ERROR IN AWAIT FUNC:', e)
      return
    }

    const backendResultParsed = JSON.parse(
      backendResult.data.portfolioOptimization
    )

    if (backendResultParsed === '') {
      showWarning('You got empty response! 🙈')
      this.props.toggleLoading()

      return
    }

    if (backendResultParsed.error) {
      showWarning(`You got an error! 🙈`)
      this.props.toggleLoading()
      console.log('ERROR', backendResultParsed.error)

      return
    }

    this.props.toggleLoading()
    this.props.setActiveButtonToDefault()

    const optimizedData = backendResultParsed.returns
    console.log('optimizedData', optimizedData)

    if (
      storeData.length < optimizedData[activeButton].portfolio_coins_list.length
    ) {
      console.log('storeData.length < optimizedData')
      this.addRow('USDT', 0)
    }

    optimizedToState(optimizedData)
  }

  addRow = (name: string, value: number) => {
    if (this.props.storeData.some((el) => el.coin === name)) {
      return
    }

    if (this.props.filterValueSmallerThenPercentage >= 0) {
      this.props.showWarning('Disable Dust filter first to see added coins')
    }

    if (name) {
      this.props.updateData([
        ...this.props.storeData,
        { coin: name, percentage: value },
      ])
    }
  }

  deleteRow = (i: number) =>
    this.props.updateData(
      [...this.props.storeData].filter((el, index) => i !== index)
    )
  deleteRowByCoinName = (name: string) =>
    this.props.updateData(
      [...this.props.storeData].filter((el) => el.coin !== name)
    )

  renderBarChart = () => {
    const { storeData, activeButton, theme, rawOptimizedData } = this.props

    if (!storeData) {
      return
    }

    const formatedData = storeData.map((el: IData) => ({
      x: el.coin,
      y: Number(Number(el.percentage).toFixed(2)),
    }))

    const formatedOptimizedData = rawOptimizedData.length
      ? storeData.map((el, i) => ({
          x: el.coin,
          y: +(rawOptimizedData[activeButton].weights[i] * 100).toFixed(2),
        }))
      : []

    const barChartData = [
      {
        data: formatedData,
        title: 'Original',
        color: '#fff',
      },
      {
        data: formatedOptimizedData,
        title: 'Optimized',
        color: '#4ed8da',
      },
    ]

    return (
      <ChartContainer className="PortfolioDistributionChart">
        <StyledCardHeader title="Portfolio Distribution" />
        <InnerChartContainer>
          <Chart background={theme.palette.background.default}>
            <BarChart
              height={340}
              showPlaceholder={formatedData.length === 0}
              charts={barChartData}
              alwaysShowLegend={true}
              hideDashForToolTip={true}
              xAxisVertical={true}
            />
          </Chart>
        </InnerChartContainer>
      </ChartContainer>
    )
  }

  onDatesChange = ({ startDate, endDate }) =>
    this.setState({ startDate, endDate })

  onFocusChange = (focusedInput) => this.setState({ focusedInput })

  onToggleRiskSwitch = (e, che) => {
    this.setState({ isRiskFreeAssetEnabled: che })
  }

  onSelectChange = (
    name: string,
    optionSelected?: { label: string; value: string } | null
  ) => {
    const value =
      optionSelected && !Array.isArray(optionSelected)
        ? optionSelected.value
        : ''
    this.setState({ [name]: value })
  }

  onResetClick = () => {
    const { optimizedToState } = this.props

    optimizedToState([])
    this.importPortfolio()
  }

  render() {
    const {
      storeData, // data from redux (data from portfolio and mannualy added)
      onNewBtnClick,
      filterValueSmallerThenPercentage,
      activeButton,
      theme,
    } = this.props

    const {
      baseCoin,
      rebalancePeriod,
      isRiskFreeAssetEnabled,
      startDate,
      endDate,
      initialPortfolio,
    } = this.state

    if (!storeData) {
      return (
        <Typography variant="h4" color="error">
          Erorr during download. Please Refresh the page.{' '}
        </Typography>
      )
    }

    const textColor: string = this.props.theme.palette.getContrastText(
      this.props.theme.palette.background.paper
    )

    const fontFamily = theme.typography.fontFamily

    // move it to the state
    const maximumDate = moment()
    const minimumDate = moment().subtract(3, 'years')

    const isAllOptionsFilled =
      baseCoin && rebalancePeriod && startDate && endDate

    return (
      <ApolloConsumer>
        {(client) => (
          <ImportData>
            <TableSelectsContaienr>
              <InputContainer className="OptimizationInput">
                <StyledCardHeader title="Back-test input" />
                <InputInnerContainer>
                  <InputElementWrapper>
                    <StyledInputLabel color={textColor}>
                      Base coin
                    </StyledInputLabel>
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
                      ) =>
                        this.onSelectChange('rebalancePeriod', optionSelected)
                      }
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
                  <ButtonMUI
                    color={'secondary'}
                    variant={'outlined'}
                    disabled={!isAllOptionsFilled}
                    onClick={() => {
                      this.newOptimizeButtonClick(
                        client,
                        storeData,
                        baseCoin,
                        rebalancePeriod,
                        isRiskFreeAssetEnabled,
                        startDate,
                        endDate
                      )
                    }}
                  >
                    Optimize Portfolio
                  </ButtonMUI>
                </InputInnerContainer>
              </InputContainer>

              <TableContainer className="RiskProfileTable">
                <StyledCardHeader title="Risk Profile" />

                <SwitchButtonsWrapper>
                  <SwitchButtons
                    btnClickProps={client}
                    onBtnClick={onNewBtnClick}
                    values={this.state.percentages}
                    show={this.props.rawOptimizedData.length > 1}
                    activeButton={activeButton}
                  />
                  <ButtonMUI
                    disabled={isEqual(initialPortfolio, storeData)}
                    color="secondary"
                    style={{
                      alignSelf: 'center',
                    }}
                    variant="fab"
                    onClick={this.onResetClick}
                  >
                    <MdReplay />
                  </ButtonMUI>
                </SwitchButtonsWrapper>
                <Table
                  onPlusClick={this.addRow}
                  data={storeData}
                  optimizedData={
                    this.props.rawOptimizedData.length > 1
                      ? this.props.rawOptimizedData[activeButton].weights
                      : []
                  }
                  activeButton={activeButton}
                  withInput={true}
                  onClickDeleteIcon={this.deleteRow}
                  filterValueSmallerThenPercentage={
                    filterValueSmallerThenPercentage
                  }
                  theme={this.props.theme}
                />
              </TableContainer>
            </TableSelectsContaienr>
            {this.renderBarChart()}
          </ImportData>
        )}
      </ApolloConsumer>
    )
  }
}

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
  font-size: 0.875rem;
`

const InputElementWrapper = styled.div`
  margin-bottom: 38px;
  display: flex;
  flex-direction: column;

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

const ChartContainer = styled(Card)`
  min-height: 400px;
  width: 49%;
  margin: 0 0 0 2rem;
`

const TableSelectsContaienr = styled.div`
  width: 49%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const InputInnerContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  min-width: 100px;
  padding: 0 15px 17px 15px;
`

export const InnerChartContainer = styled.div`
  padding: 0 15px 15px 15px;
`
