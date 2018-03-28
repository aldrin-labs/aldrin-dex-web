import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import menuIcon from '../../icons/menu.svg'

export default class MarketCapWidget extends React.Component {
  render() {
    const dndStyles = { cursor: '-webkit-grab' }

    return (
      <Container>
        <HeadingWrapper>
          <div>
            <Heading>Market Cap</Heading>
          </div>
          <span className="dnd" style={dndStyles}>
            <SvgIcon src={menuIcon} width={24} height={24} />
          </span>
        </HeadingWrapper>

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
      </Container>
    )
  }
}

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

const Heading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  text-align: left;
  color: #fff;
`

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
  margin-top: 16px;
`
