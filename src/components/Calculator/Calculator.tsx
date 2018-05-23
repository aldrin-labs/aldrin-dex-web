import * as React from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import debounce from 'lodash/debounce'

import Button from '@components/Elements/Button/Button'
import AutoSuggestion from '@components/AutoSuggestion/AutoSuggestion'
import QueryRenderer from '@components/QueryRenderer'

import { Props, State } from './types'

class Calculator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.refetch = debounce(this.refetch, 300)

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
      const exec = reg.exec(String(calculatedRate))
      if (!exec) return ''
      const { index } = exec
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

    rates.forEach((propsRate) => {
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

    rates.forEach((propsRate) => {
      if (propsRate.name === rateName) {
        this.setState({
          currentRate: propsRate,
          secondValue: this.calcRate(propsRate.rate, firstValue),
        })
      }
    })
  }

  refetch = (q: string) => {
    console.log('refetch: ', q)
    this.props.refetch({ page: 1, perPage: 20, filter: { q } })
  }

  render() {
    const { rates, data } = this.props
    const { firstValue, secondValue, currentRate } = this.state
    const match = currentRate.name.match(/([a-z]+)/gi)
    const [firstRateName, secondRateName] = match || ['', '']

    const suggestions = data.assetPagination.items.map((item) => ({
      title: item.symbol,
      _id: item._id,
    }))

    const options = ['BTC', 'USD', 'ETH', 'XRP']

    const value = data.variables.filter.q
      ? data.variables.filter.q.toLowerCase()
      : ''

    return (
      <React.Fragment>
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

            {/*<RateSelect
              value={firstRateName}
              defaultValue={firstRateName}
              onChange={this.onSelectFirstRate}
            >
              {options.map((opt) => {
                return (
                  <RateSelectOption key={opt} value={opt}>
                    {opt}
                  </RateSelectOption>
                )
              })}
            </RateSelect>*/}
            {/* <AutoSuggestion
              select
              value={value}
              suggestions={suggestions}
              onChange={this.refetch}
            /> */}
          </ExchangeContainer>

          <ExchangeContainer>
            <Input value={secondValue} disabled />

            <RateSelect
              value={secondRateName}
              defaultValue={secondRateName}
              onChange={this.onSelectSecondRate}
            >
              {options.map((opt) => {
                return (
                  <RateSelectOption key={opt} value={opt}>
                    {opt}
                  </RateSelectOption>
                )
              })}
            </RateSelect>
          </ExchangeContainer>
        </ShortcutWrapper>
      </React.Fragment>
    )
  }
}

const RateSelectOption = styled.option`
  font-family: Roboto, sans-serif;
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
  font-family: Roboto, sans-serif;
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
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  color: #ffffff80;
  padding: 10px 0;
`

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin-bottom: 16px;
    margin-right: 16px;
  }
`

const ShortcutDesc = styled.span`
  opacity: 0.5;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  color: #ffffff;
  margin: 8px 0;
`

const ShortcutWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const CalculatorQuery = gql`
  query CalculatorQuery(
    $page: Int
    $perPage: Int
    $filter: FilterFindManyAssetInput
  ) {
    assetPagination(page: $page, perPage: $perPage, filter: $filter) {
      items {
        _id
        name
        symbol
      }
    }
  }
`

export default function(props: any) {
  const variables = { page: 1, perPage: 20, filter: {} }
  return (
    <QueryRenderer
      query={CalculatorQuery}
      variables={variables}
      component={Calculator}
      {...props}
    />
  )
}
