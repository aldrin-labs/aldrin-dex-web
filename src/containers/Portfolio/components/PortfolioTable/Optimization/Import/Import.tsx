import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { ApolloConsumer } from 'react-apollo'

import Table from '../Table/Table'
import SwitchButtons from '@components/SwitchButtons/SwitchButtons'
import { MOCK_DATA } from '../../dataMock'
import { IProps, IData } from './import.types'
import { OPTIMIZE_PORTFOLIO } from '../api'

class Import extends PureComponent<IProps> {
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

  importPortfolio = () => {
    let assets
    if (this.props.isShownMocks) {
      assets = MOCK_DATA
    } else {
      assets = this.props.transfromData(
        this.props.data.getProfile.portfolio.assets
      )
    }

    this.props.updateData(this.sumSameCoins(assets))
  }

  addRow = (name: string, value: number) => {
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

  render() {
    const {
      expectedReturn,
      optimizePortfolio,
      handleChange,
      storeData,
      startDate,
      endDate,
      onBtnClick,
      percentages,
      activeButton,
      showSwitchButtons, // optimizedData.length >= 1
    } = this.props

    const data: IData[] = this.props.transfromData(
      this.props.data.getProfile.portfolio.assets
    )

    return (
      <ApolloConsumer>
        {(client) => (
          <>
            <InputContainer>
              <SwitchButtons
                btnClickProps={client}
                onBtnClick={onBtnClick}
                values={percentages}
                show={showSwitchButtons}
                activeButton={activeButton}
              />
              <Button onClick={this.importPortfolio}>Import Portfolio</Button>
              <Input
                type="number"
                placeholder="Expected return in %"
                value={expectedReturn || ''}
                onChange={(e) => {
                  handleChange(e)
                }}
              />
              <Button
                disabled={expectedReturn === '' || (data && data.length < 1)}
                onClick={async () => {
                  const { data: backendData } = await client.query({
                    query: OPTIMIZE_PORTFOLIO,
                    variables: {
                      expectedPct: 0.15,
                      coinList: ['BTC', 'ETH', 'LTC'], // storeData.map(data: IData=> data.coin)
                      startDate: 1531441380,
                      endDate: 1531873380,
                    },
                  })

                  optimizePortfolio(
                    JSON.parse(backendData.portfolioOptimization)
                  )
                }}
              >
                Optimize Portfolio
              </Button>
            </InputContainer>

            <TableContainer>
              <Table
                onPlusClick={this.addRow}
                data={storeData}
                withInput
                onClickDeleteIcon={this.deleteRow}
              />
            </TableContainer>
          </>
        )}
      </ApolloConsumer>
    )
  }
}

const InputContainer = styled.div`
  margin: auto 2rem auto 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 300px;

  @media (max-width: 1080px) {
    margin: auto;
    flex-wrap: wrap;
  }
`

const TableContainer = styled.div`
  @media (max-width: 600px) {
    margin-top: 1rem;
  }
`

const Button = styled.div`
  border-radius: 2px;
  background-color: #4c5055;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: ${(props: { disabled?: boolean }) =>
    props.disabled ? 'not-allowed' : 'pointer'};
  text-transform: uppercase;
  margin-top: 10px;

  &:nth-child(1) {
    margin: 0;
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
