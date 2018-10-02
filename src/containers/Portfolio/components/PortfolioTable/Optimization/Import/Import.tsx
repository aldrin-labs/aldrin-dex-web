import React, { PureComponent } from 'react'
import { ApolloConsumer } from 'react-apollo'
import MdReplay from '@material-ui/icons/Replay'
import { Button as ButtonMUI, Typography } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import { isEqual } from 'lodash-es'
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch'

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

import { SwitchButtonsWrapper, HelperForCentering, InputContainer, TableContainer, Input } from './Import.styles'
import styled from 'styled-components'


export default class Import extends PureComponent<IProps> {
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
    const textColor: string= this.props.theme.palette.getContrastText(this.props.theme.palette.background.paper)
    return (
      <ApolloConsumer>
        {(client) => (
          <>
            <InputContainer>
              <InputLabel>
                Base coin
              </InputLabel>
              <TextField
                color={textColor}
                value={`USDT`}
                // disabled={true}
              />
              <InputLabel>
                Rebalance period
              </InputLabel>
              <SelectOptimization
                options={RebalancePeriod}
                isClearable={true}
                // placeholder={` `}
              />
              <InputLabel>
                Date range
              </InputLabel>
              <SelectOptimization
                isClearable={true}
                // placeholder={` `}
              />
              <InputLabel>
                Risk free asset
              </InputLabel>
              <FlexWrapper>
                <Typography variant="caption">No</Typography>
                <Switch
                  // onChange={this.onToggleUSDBTC}
                  // checked={isUSDCurrently}
                  checked={true}
                />
                <Typography variant="caption">Yes</Typography>
              </FlexWrapper>
              <InputLabel>
                Risk profile
              </InputLabel>
              <SelectOptimization
                options={RiskProfile}
                isClearable={true}
                // placeholder={` `}
              />




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
          </>
        )}
      </ApolloConsumer>
    )
  }
}


const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`

const SelectOptimization = styled(ReactSelectComponent)`

  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
  }
  
`
