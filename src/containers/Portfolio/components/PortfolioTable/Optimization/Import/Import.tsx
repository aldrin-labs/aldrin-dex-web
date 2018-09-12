import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { ApolloConsumer } from 'react-apollo'
import { MdReplay } from 'react-icons/lib/md'
import { Button as ButtonMUI } from '@material-ui/core'
import { isEqual } from 'lodash-es'

import Table from '@containers/Portfolio/components/PortfolioTable/Optimization/Table/Table'
import SwitchButtons from '@components/SwitchButtons/SwitchButtons'
import { MOCK_DATA } from '@containers/Portfolio/components/PortfolioTable/dataMock'
import {
  IProps,
  IData,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/Import/import.types'
import { OPTIMIZE_PORTFOLIO } from '@containers/Portfolio/components/PortfolioTable/Optimization/api'
import SelectDates from '@components/SelectTimeRangeDropdown'

class Import extends PureComponent<IProps> {
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
        this.props.transformData(this.props.data.getProfile.portfolio.assets)
    }

    this.props.updateData(this.sumSameCoins(assets))
  }

  sumSameCoins = (rawData: IData[]) => {
    let data: IData[] = []

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
      console.log('Variables')
      console.log({
        expectedPct: Number(expectedReturn),
        coinList: storeData.map((el: IData) => el.coin),
        startDate,
        endDate,
      })
      console.log('Data')
      console.log(backendData)

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
        // showWarning('Output coins not the same as input coins!')
        console.log('Output coins not the same as input coins!')
        // return
      }

      optimizePortfolio(backendDataParsed[2])
    }, 2000)
  }

  isEqual = (assets: IData[], storeData: IData[]): boolean => {
    const s = this.sumSameCoins(assets)

    return isEqual(s, storeData)
  }

  addRow = (name: string, value: number) => {
    console.log(this.props.filterValueSmallerThenPercentage)
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
        this.props.transformData(this.props.data.getProfile.portfolio.assets)
    }

    const data: IData[] =
      this.props.data &&
      this.props.transformData(this.props.data.getProfile.portfolio.assets)

    return (
      <ApolloConsumer>
        {(client) => (
          <>
            <InputContainer>
              <SelectDates
                setPeriodToStore={setPeriod}
                period={optimizationPeriod}
              />
              <Input
                type="number"
                placeholder="Expected return in %"
                value={expectedReturn || ''}
                onChange={(e) => {
                  handleChange(e)
                }}
              />
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
              />
            </TableContainer>
            <HelperForCentering />
          </>
        )}
      </ApolloConsumer>
    )
  }
}

const SwitchButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const HelperForCentering = styled.div`
  width: 224px;
  min-width: 100px;
  opacity: 0;
`

const InputContainer = styled.div`
  margin: auto 2rem auto 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 100px;

  @media (max-width: 1080px) {
    margin: auto;
    flex-wrap: wrap;
  }
`

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  place-content: flex-end;
  width: 50%;
  max-width: 50rem;
  @media (max-width: 600px) {
    margin-top: 1rem;
  }
`

const Input = styled.input`
  box-sizing: border-box;
  background: transparent;
  border-top: none;
  border-left: none;
  border-bottom: 2px solid rgba(78, 216, 218, 0.3);
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 10px 0 0px;
  color: rgb(255, 255, 255);
  transition: all 0.25s ease-out;

  &:focus {
    border-bottom: 2px solid rgb(78, 216, 218);
  }
`

export default Import
