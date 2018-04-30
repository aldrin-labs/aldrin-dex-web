import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import btcIcon from 'src/icons/bitcoin.svg'

const mocks = [
  { number: '9713,19', name: 'Current rate USD', color: '#4ed8da' },
  { number: '904,79', name: 'Low: 25 Mar 2017', color: '#ff687a' },
  { number: '20078,10', name: 'High: 17 Dec 2017', color: '#65c000' },
  { number: '5,808 B', name: 'Volume 24h USD' },
  { number: '164,3 B', name: 'Market Cap #1 USD' },
  { number: '+748,77%', name: 'Change in year USD', color: '#65c000' },
]

export default class PriceChart extends React.Component {
  render() {
    return (
      <Container>
        <HeadingWrapper>
          <SvgIcon src={btcIcon} />
          <Heading>Bitcoin Price Chart (1y)</Heading>
        </HeadingWrapper>

        <InfoContainer>
          {mocks.map((mock) => {
            return (
              <InfoItem>
                <InfoNumber color={mock.color}>{mock.number}</InfoNumber>
                <InfoDetail>{mock.name}</InfoDetail>
              </InfoItem>
            )
          })}
        </InfoContainer>
      </Container>
    )
  }
}

const InfoDetail = styled.span`
  opacity: 0.5;
  font-family: Roboto;
  font-size: 14px;
  text-align: left;
  color: #fff;
`

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const InfoNumber = styled.span`
  color: ${(props) => (props.color ? props.color : '#fff')};
`

const InfoItem = styled.div`
  width: 33%;
  display: flex;
  flex-direction: column;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
`

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Heading = styled.span`
  font-family: Roboto;
  font-size: 1.225em;
  font-weight: 500;
  text-align: left;
  color: #fff;
`
