import * as React from 'react'
import styled from 'styled-components'

interface Props {
  onClick?: () => void
  style?: Object
  title: string
  mRight?: boolean
}

export default class Button extends React.Component<Props, {}> {
  onClick = (e: MouseEvent) => {
    const { onClick } = this.props

    if (onClick) onClick()
  }

  render() {
    const { style, title, mRight } = this.props
    let btnStyle = {}
    if (mRight) btnStyle = { ...btnStyle, marginRight: '24px' }

    return (
      <Btn onClick={this.onClick} style={{ ...style, ...btnStyle }}>
        {title}
      </Btn>
    )
  }
}

const Btn = styled.button`
  border-radius: 2px;
  background-color: #4c5055;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
  text-transform: uppercase;
`
