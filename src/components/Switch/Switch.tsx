import * as React from 'react'
import styled from 'styled-components'

interface Props {
  onClick?: Function
  values?: string[]
  isActive?: boolean
}

export default class Switch extends React.Component<Props> {
  render() {
    const { onClick, values, isActive } = this.props
    const [first, second] = values || ['', '']

    return (
      <Container>
        {first && <Desc>{first}</Desc>}
        <Label>
          <Input type="checkbox" onClick={onClick} checked={isActive} />
          <Slider />
        </Label>
        {second && <Desc>{second}</Desc>}
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
  background-color: #7fcac380;
  transition: 0.4s;
  border-radius: 34px;

  & :before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: -5px;
    bottom: -3px;
    background-color: #4ed8da;
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
  width: 34px;
  height: 14px;

  & ${Input} {
    display: none;
  }
`
