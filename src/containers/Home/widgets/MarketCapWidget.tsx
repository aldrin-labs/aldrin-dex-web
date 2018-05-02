import * as React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import AreaChart from '@components/AreaChart'
import Widget from '@components/Widget'
import { yearData } from '@containers/Profile/components/chartMocks'

export default class MarketCapWidget extends React.Component {
  render() {
    return (
      <Widget heading="Market Cap">
        <InfoBlock>
          <InfoItem>
            <InfoItemKey>24h Vol:</InfoItemKey>
            <InfoItemValue>$20.0 B</InfoItemValue>
          </InfoItem>
        </InfoBlock>

        <InfoBlock>
          <InfoItem>
            <InfoItemKey>24h high:</InfoItemKey>
            <InfoItemValue style={{ color: '#65c000' }}>$600.0 B</InfoItemValue>
          </InfoItem>

          <InfoItem>
            <InfoItemKey>24h low:</InfoItemKey>
            <InfoItemValue style={{ color: '#ff687a' }}>$580.0 B</InfoItemValue>
          </InfoItem>
        </InfoBlock>

        <BigNumbersContainer>
          <Dot />
          <BigNumberContainer>
            <BigNumber
              style={{
                color: '#fff',
              }}
            >
              590 B
            </BigNumber>

            <Detail>Current rate USD</Detail>
          </BigNumberContainer>

          <BigNumberContainer>
            <BigNumber style={{ color: '#ff687a' }}>-1,67%</BigNumber>

            <Detail>Change in day</Detail>
          </BigNumberContainer>
        </BigNumbersContainer>

        <AreaChart data={yearData.slice(0, 20)} />

        <Btn to="/chart">Open chart</Btn>
      </Widget>
    )
  }
}

const Btn = styled(Link)`
  border-radius: 3px;
  background-color: #282c2f;
  border-color: transparent;
  color: #fff;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  width: 15em;
`

const Dot = styled.div`
  background-color: #4ed8da;
  width: 8px;
  height: 8px;
  border-radius: 50%;
`

const Detail = styled.span`
  opacity: 0.5;
  font-family: Roboto;
  font-size: 14px;
  text-align: left;
  color: #ffffff;
`

const BigNumber = styled.span`
  font-family: Roboto;
  font-size: 35px;
  text-align: left;
`

const BigNumberContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: space-around;
  align-items: center;
`

const BigNumbersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

const InfoItemValue = styled.span`
  font-family: Roboto;
  font-size: 16px;
  letter-spacing: 0.7px;
  text-align: left;
  color: #fff;
  padding-left: 16px;
`

const InfoItemKey = styled.span`
  font-family: Roboto;
  font-size: 16px;
  letter-spacing: 0.7px;
  text-align: left;
  color: #ffffff80;
`

const InfoItem = styled.div`
  margin-right: 40px;
`

const InfoBlock = styled.div`
  display: flex;
  margin-top: 16px;
`
