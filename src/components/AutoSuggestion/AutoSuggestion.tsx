import * as React from 'react'

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

  // onPressSuggestion = (item: { price: number; title: string }) => {
  //   const { onChangePrice } = this.props
  //   this.onChangeText(item.title)
  //   this.setState({ tips: null })
  //   if (onChangePrice) onChangePrice(String(item.price))
  // }

  render() {
    const { select, suggestions } = this.props
    const { value } = this.state

    return (
      <div style={select ? { position: 'relative' } : {}}>
        <input
          value={value}
          onChange={this.onChangeText}
          style={
            select
              ? {
                  width: '50px',
                  padding: '5px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  marginLeft: '15px',
                }
              : {}
          }
        />
        <div
          style={
            select
              ? {
                  position: 'absolute',
                  left: '15px',
                  top: '40px',
                  backgroundColor: '#303030',
                  maxHeight: '100px',
                  overflowY: 'scroll',
                  display: 'flex',
                  color: '#fff',
                  flexDirection: 'column',
                }
              : {}
          }
        >
          {suggestions &&
            suggestions.map((item) => {
              return (
                <span
                  key={item.title}
                  style={{ padding: '5px' }}
                  // onClick={() => this.onPressSuggestion(item)}
                >
                  {item.title}
                </span>
              )
            })}
        </div>
      </div>
    )
  }
}
