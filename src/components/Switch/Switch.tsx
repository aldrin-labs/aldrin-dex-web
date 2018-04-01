import * as React from 'react'
import styled from 'styled-components'

interface Props {
  onClick: Function
  values: string[]
}

export default class Switch extends React.Component<Props> {
  render() {
    const { onClick, values } = this.props
    const [first, second] = values

    return (
      <Container>
        <Desc>{first}</Desc>
        <Label>
          <Input type="checkbox" onClick={onClick} />
          <Slider />
        </Label>
        <Desc>{second}</Desc>
      </Container>
    )
  }
}

const Desc = styled.span`
  font-family: Roboto;
  font-size: 1em;
  margin: 0 10px;
  color: #fff;
  font-weight: 500;
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  & :before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`

const Input = styled.input`
  :checked + ${Slider}:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`

// & :checked + ${Slider} {
//   background-color: #2196f3;
// }
// & :focus + ${Slider} {
//   box-shadow: 0 0 1px #2196f3;
// }

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  & ${Input} {
    display: none;
  }
`
