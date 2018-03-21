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
  rates: Rate[]
}

interface State {
  currentRate: Rate
  firstValue: string
  secondValue: string
}

// const shortcuts = []

export default class Calculator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      currentRate: props.rates[0],
      firstValue: '',
      secondValue: '',
    }
  }

  calcRate = (rate: number, value: string): string => {
    const num = Number(value)
    if (num === 0) return ''
    const calculatedRate = rate * num
    const flooredRate = Math.floor(calculatedRate)

    if (flooredRate === 0) {
      const reg = /[1-9]/
      const { index } = reg.exec(String(calculatedRate))
      return String(calculatedRate.toFixed(index))
    }

    return String(flooredRate)
  }

  onChangeFirstValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { currentRate } = this.state
    const { rate } = currentRate
    const { value } = e.target
    const sanitizedValue = value.replace(/\D+/gi, '')

    this.setState({
      firstValue: sanitizedValue,
      secondValue: this.calcRate(rate, sanitizedValue),
    })
  }

  onChangeCurrentRate = (index: number) => {
    const { rates } = this.props
    const { firstValue } = this.state
    const clickedRate = rates[index]
    this.setState({
      currentRate: clickedRate,
      secondValue: this.calcRate(clickedRate.rate, firstValue),
    })
  }

  onSelectFirstRate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { rates } = this.props
    const { currentRate, firstValue } = this.state
    const { value } = e.target

    const secondRatePart = currentRate.name.replace(/[a-z]+\//gi, '')
    const rateName = `${value}/${secondRatePart}`

    rates.forEach(propsRate => {
      if (propsRate.name === rateName) {
        this.setState({
          currentRate: propsRate,
          secondValue: this.calcRate(propsRate.rate, firstValue),
        })
      }
    })
  }

  onSelectSecondRate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { rates } = this.props
    const { currentRate, firstValue } = this.state
    const { value } = e.target

    const firstRatePart = currentRate.name.replace(/\/[a-z]+/gi, '')
    const rateName = `${firstRatePart}/${value}`

    rates.forEach(propsRate => {
      if (propsRate.name === rateName) {
        this.setState({
          currentRate: propsRate,
          secondValue: this.calcRate(propsRate.rate, firstValue),
        })
      }
    })
  }

  render() {
    const { rates } = this.props
    const { firstValue, secondValue, currentRate } = this.state
    const [firstRateName, secondRateName] = currentRate.name.match(/([a-z]+)/gi)

    const options = ['BTC', 'USD', 'ETH', 'XRP']

    return (
      <CalculatorWrapper>
        <HeadingWrapper>
          <SvgIcon src={compareIcon} width={24} height={24} />
          <Heading>Crypto Calculator</Heading>
        </HeadingWrapper>

        <ShortcutWrapper>
          <ShortcutDesc>Shortcuts:</ShortcutDesc>
          <BtnsContainer>
            {rates.map((rateBtn, i) => (
              <Button
                key={rateBtn.name}
                title={rateBtn.name}
                active={currentRate.name === rateBtn.name}
                onClick={() => this.onChangeCurrentRate(i)}
              />
            ))}
          </BtnsContainer>

          <ExchangeContainer>
            <Input
              value={firstValue}
              onChange={this.onChangeFirstValue}
              style={{
                borderBottom: 'solid 2px #4ed8da',
                color: '#fff',
              }}
            />

            <RateSelect
              value={firstRateName}
              defaultValue={firstRateName}
              onChange={this.onSelectFirstRate}
            >
              {options.map(opt => {
                return (
                  <RateSelectOption key={opt} value={opt}>
                    {opt}
                  </RateSelectOption>
                )
              })}
            </RateSelect>
          </ExchangeContainer>

          <ExchangeContainer>
            <Input value={secondValue} disabled />

            <RateSelect
              value={secondRateName}
              defaultValue={secondRateName}
              onChange={this.onSelectSecondRate}
            >
              {options.map(opt => {
                return (
                  <RateSelectOption key={opt} value={opt}>
                    {opt}
                  </RateSelectOption>
                )
              })}
            </RateSelect>
          </ExchangeContainer>
        </ShortcutWrapper>
      </CalculatorWrapper>
    )
  }
}

const RateSelectOption = styled.option`
  font-family: Roboto;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  color: #ffffffde;
  margin-left: 15px;
  border: none;
  background-color: #292d31;
  outline: none;
`

const RateSelect = styled.select`
  font-family: Roboto;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  color: #ffffffde;
  margin-left: 15px;
  border: none;
  background: transparent;
  outline: none;
`

const ExchangeContainer = styled.div`
  display: flex;
  align-items: center;
`

const Input = styled.input`
  box-sizing: border-box;
  border-bottom: solid 1px #ffffff1e;
  background: transparent;
  border-top: none;
  border-left: none;
  outline: none;
  border-right: none;
  width: 75%;
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  color: #ffffff80;
  padding: 10px 0;
`

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
  margin: 8px 0;
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
  width: 380px;
  padding: 16px;
  border-radius: 3px;
  box-shadow: 0 2px 6px 0 #00000066;
  background-color: #292d31;
  border: solid 0.5px #4ed8da;
`
