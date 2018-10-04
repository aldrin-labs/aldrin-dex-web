import React, { PureComponent } from 'react'
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

import { RebalancePeriod, RiskProfile } from './dataForSelector'
// import { SelectR } from '@styles/cssUtils'
import ReactSelectComponent from '@components/ReactSelectComponent'
import Table from '@containers/Portfolio/components/PortfolioTable/Optimization/Table/Table'
import SwitchButtons from '@components/SwitchButtons/SwitchButtons'
import { MOCK_DATA } from '@containers/Portfolio/components/PortfolioTable/dataMock'
import {
  IProps,
  IData,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/Import/Import.types'
import { OPTIMIZE_PORTFOLIO } from '@containers/Portfolio/components/PortfolioTable/Optimization/api'
// import SelectDates from '@components/SelectTimeRangeDropdown'

import {
  SwitchButtonsWrapper,
  HelperForCentering,
  InputContainer,
  TableContainer,
  Input,
  Chart,
  ImportData,
} from './Import.styles'
// import { Chart, ImportData } from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization.styles'
import styled from 'styled-components'

export default class Import extends PureComponent<IProps> {
  state = {
    isRiskFreeAssetEnabled: true,
    riskProfile: null,
    focusedInput: false,
    startDate: null,
    endDate: null,
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
        this.props.data.getProfile &&
        this.props.transformData(this.props.data.getProfile.portfolio.assets)
    }

    this.props.updateData(this.sumSameCoins(assets))
  }

  sumSameCoins = (rawData: IData[]) => {
    let data: IData[] = []
    if (!rawData) return
    rawData.forEach((asset) => {
      const index = data.findIndex((obj) => obj.coin === asset.coin)
      if (index >= 0) {
        data = data.map(
          (el, inx) =>
            inx === index
              ? Object.assign(el, {
                  coin: el.coin,
                  percentage:
                    Number(asset.percentage) + Number(data[index].percentage),
                })
              : el
        )
      } else {
        data.push(asset)
      }
    })

    const result = data.map((asset) => {
      const { coin, percentage } = asset

      return { coin, percentage: Number(percentage) }
    })

    return result
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

  isEqual = (assets: IData[], storeData: IData[]): boolean => {
    const s = this.sumSameCoins(assets)

    return isEqual(s, storeData)
  }

  addRow = (name: string, value: number) => {
    if (this.props.filterValueSmallerThenPercentage >= 0) {
      this.props.showWarning('Turn off the filter first to see new coins.')
    }
    if (name) {
      this.props.updateData(
        this.sumSameCoins([
          ...this.props.storeData,
          { coin: name, percentage: value },
        ])
      )
    }
  }
  deleteRow = (i: number) =>
    this.props.updateData(
      [...this.props.storeData].filter((el, index) => i !== index)
    )

  deleteAllRows = () => this.props.updateData([])

  renderBarChart = () => {
    const { optimizedData, storeData, theme } = this.props

    if (!storeData) return
    const formatedData = storeData.map((el: IData, i) => ({
      x: el.coin,
      y: Number(Number(el.percentage).toFixed(2)),
    }))
    const formatedOptimizedData = optimizedData.map((el: IData, i) => ({
      x: el.coin,
      y: Number(Number(el.percentage).toFixed(2)),
    }))

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
      <Chart background={theme.palette.background.default}>
        <BarChart
          height={300}
          showPlaceholder={formatedData.length === 0}
          charts={barChartData}
          alwaysShowLegend={true}
        />
      </Chart>
    )
  }

  onDatesChange = ({ startDate, endDate }) =>
    this.setState({ startDate, endDate })

  onFocusChange = (focusedInput) => this.setState({ focusedInput })

  onToggleRiskSwitch = (e,che) => this.setState({isRiskFreeAssetEnabled: che}, ()=> {console.log(this.state)})

  render() {
    const {
      expectedReturn,
      optimizePortfolio,
      optimizedToState,
      handleChange,
      storeData, // data from redux (data from portfolio and mannualy added)
      optimizedData,
      startDate,
      endDate,
      optimizationPeriod,
      setPeriod,
      onBtnClick,
      percentages,
      filterValueSmallerThenPercentage,
      activeButton,
      showSwitchButtons, // optimizedData.length >= 1
      showWarning,
    } = this.props

    let assets: IData[]
    if (this.props.isShownMocks) {
      assets = MOCK_DATA
    } else {
      assets =
        this.props.data &&
        this.props.data.getProfile &&
        this.props.transformData(this.props.data.getProfile.portfolio.assets)
    }

    const data: IData[] =
      this.props.data &&
      this.props.data.getProfile &&
      this.props.transformData(this.props.data.getProfile.portfolio.assets)
    if (!storeData) {
      return (
        <Typography variant="display1" color="error">
          Erorr during download. Please Refresh the page.{' '}
        </Typography>
      )
    }
    const textColor: string = this.props.theme.palette.getContrastText(
      this.props.theme.palette.background.paper
    )
    return (
      <ApolloConsumer>
        {(client) => (
          <ImportData>
            <InputContainer>
              <InputElementWrapper>
                <StyledInputLabel>Base coin</StyledInputLabel>
                <STextField color={textColor} value={`USDT`} disabled={true} />
              </InputElementWrapper>
              <InputElementWrapper>
                <StyledInputLabel>Rebalance period</StyledInputLabel>
                <SelectOptimization
                  options={RebalancePeriod}
                  isClearable={true}
                />
              </InputElementWrapper>
              <InputElementWrapper>
                <StyledInputLabel>Date range</StyledInputLabel>
                <StyledWrapperForDateRangePicker>
                  <DateRangePicker
                    startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
                  />
                </StyledWrapperForDateRangePicker>
              </InputElementWrapper>
              <InputElementWrapper>
                <StyledInputLabel>Risk free asset</StyledInputLabel>
                <FlexWrapper>
                  <StyledSwitch
                    onChange={this.onToggleRiskSwitch}
                    checked={this.state.isRiskFreeAssetEnabled}
                  />
                </FlexWrapper>
              </InputElementWrapper>
              <InputElementWrapper visibility={!!this.state.isRiskFreeAssetEnabled}>
                <StyledInputLabel>Risk profile</StyledInputLabel>
                <SelectOptimization
                  options={RiskProfile}
                  isClearable={true}
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

              <ButtonMUI
                style={{ marginTop: '1rem' }}
                color={'secondary'}
                variant={'outlined'}
                disabled={expectedReturn === '' || (data && data.length < 1)}
                onClick={() => {
                  this.onOptimizeButtonClick(
                    client,
                    startDate,
                    endDate,
                    storeData,
                    expectedReturn,
                    showWarning,
                    optimizePortfolio,
                    optimizedToState
                  )
                }}
              >
                Optimize Portfolio
              </ButtonMUI>
            </InputContainer>

            <TableContainer>
              <SwitchButtonsWrapper>
                <SwitchButtons
                  btnClickProps={client}
                  onBtnClick={onBtnClick}
                  values={percentages}
                  show={showSwitchButtons}
                  activeButton={activeButton}
                />
                <ButtonMUI
                  disabled={this.isEqual(assets, storeData)}
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
                optimizedData={optimizedData}
                withInput
                onClickDeleteIcon={this.deleteRow}
                filterValueSmallerThenPercentage={
                  filterValueSmallerThenPercentage
                }
                theme={this.props.theme}
              />
            </TableContainer>
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
  font-size: 0.75rem;
`

const InputElementWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
  
  &:not(:nth-child(3)) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  visibility: ${(props: { visibility?: boolean }) =>
  props.visibility === undefined || props.visibility === true ? '' : 'hidden'};
  
`

const STextField = styled(TextField)`
  width: 90px;
  && > div:before {
    border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  }
`

const StyledSwitch = styled(Switch)``

const StyledWrapperForDateRangePicker = styled.div`
  width: 206px;
  padding: 6px 0;

  & .DateInput {
    width: 95px;
  }

  & .DateInput_input {
    padding: 5px;
    font-size: 14px;
  }

  & .DateRangePicker_picker {
    z-index: 10;
  }

  & .DateRangePickerInput_arrow_svg {
    width: 14px;
    height: 14px;
  }
`
