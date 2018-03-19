import * as React from 'react'
import styled from 'styled-components'
import compareIcon from '../../icons/compare.svg'
import SvgIcon from '../../components/SvgIcon/SvgIcon'
import Button from '../../components/Elements/Button/Button'

interface Rate {
  name: string
  rate: number
}

interface Props {
  rates?: Rate[]
}

export default class Calculator extends React.Component<Props, {}> {
  render() {
    return (
      <CalculatorWrapper>
        <HeadingWrapper>
          <SvgIcon src={compareIcon} width={24} height={24} />
          <Heading>Crypto Calculator</Heading>
        </HeadingWrapper>

        <ShortcutWrapper>
          <ShortcutDesc>Shortcuts:</ShortcutDesc>
          <BtnsContainer>
            <Button title="BTC/USD" />
            <Button title="BTC/USD" />
            <Button title="BTC/USD" />
            <Button title="BTC/USD" />
            <Button title="BTC/USD" />
            <Button title="BTC/USD" />
            <Button title="BTC/USD" />
            <Button title="BTC/USD" />
          </BtnsContainer>

          <input value={this.props.rates[0].rate} />
        </ShortcutWrapper>
      </CalculatorWrapper>
    )
  }
}

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & > * {
    margin-bottom: 16px;
  }
`

const ShortcutDesc = styled.span`
  opacity: 0.5;
  font-family: Roboto;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 6px;
`

const ShortcutWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`

const Heading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  text-align: left;
  color: #ffffff;
  margin-left: 8px;
`

const CalculatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 380px;
  padding: 16px;
  border-radius: 3px;
  box-shadow: 0 2px 6px 0 #00000066;
  background-color: #292d31;
  border: solid 0.5px #4ed8da;
`
