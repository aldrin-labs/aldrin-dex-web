import * as React from 'react'
import styled from 'styled-components'

export interface Suggestion {
  title: string
  _id: any
}

export interface Props {
  value?: string
  suggestions: Suggestion[]
  select?: boolean
  style?: any
  onChange?: Function
  onChangePrice?: Function
}

export interface State {
  value: string
}

export default class AutoSuggestion extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      value: props.value || '',
    }

    this.onPressSuggestion = this.onPressSuggestion.bind(this)
  }

  onChangeText = (e: any): void => {
    const value = e.target.value

    if (value) {
      const { onChange } = this.props

      this.setState({ value }, () => {
        if (onChange) onChange(value)
      })
    } else {
      this.setState({ value })
    }
  }

  onPressSuggestion = (item: { price: number; title: string }) => {
    const { onChangePrice } = this.props
    // this.onChangeText(item.title)
    this.setState({ value: null })
    if (onChangePrice) onChangePrice(String(item.price))
  }

  render() {
    const { select, suggestions } = this.props
    const { value } = this.state

    return (
      <div style={select ? { position: 'relative' } : {}}>
        <div>
          <Input
            value={value}
            onChange={this.onChangeText}
            style={select ? {} : {}}
          />
        </div>
        {this.state.value !== '' ? (
          <SuggestionContainer style={select ? {} : {}}>
            {suggestions &&
              suggestions.slice(0, 5).map((item) => {
                return (
                  <Suggestion
                    key={item.title}
                    style={{ padding: '5px' }}
                    onClick={() => this.onPressSuggestion(item)}
                  >
                    {item.title}
                  </Suggestion>
                )
              })}
          </SuggestionContainer>
        ) : null}
      </div>
    )
  }
}

const Input = styled.input`
  box-sizing: border-box;
  background: transparent;
  border-top: none;
  border-left: none;
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  color: #fff;
  padding: 10px 0;
  transition: border-bottom 0.3s;

  &:focus {
    border-bottom: 2px solid rgb(78, 216, 218);
  }
`

const SuggestionContainer = styled.div`
  box-shadow: 0 2px 6px 0 #00000066;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 2.875rem;
  width: 100%;
  background-color: #393e44;
  font-family: Roboto, sans-serif;
  color: #fff;
  font-weight: 300;
  font-size: 16px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
`

const Suggestion = styled.span`
  cursor: pointer;
  padding: 10px 20px;

  &:hover {
    background-color: #292d31;
  }
`
