import React from 'react'
import styled from 'styled-components'

export interface IProps {
  show: boolean
  values: number[]
  onBtnClick: Function
  activeButton: number
  btnClickProps?: any
}
const SwitchButtons = (props: IProps) => (
  <BtnsContainer show={props.show}>
    {props.values.map((percentage, i) => (
      <Btn
        onClick={() => {
          props.onBtnClick(i, props.btnClickProps)
        }}
        active={i === props.activeButton}
        key={percentage}
      >
        {`${percentage}%`}
      </Btn>
    ))}
  </BtnsContainer>
)

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto 20px auto;
  max-height: 2rem;
  position: relative;
  top: ${(props: { show: boolean }) => (props.show ? '0' : '-100px')};
  z-index: ${(props: { show: boolean }) => (props.show ? '1' : '-10')};
  opacity: ${(props: { show: boolean }) => (props.show ? '1' : '0')};
  transition: top 0.3s ease-in, opacity 0.3s ease-out;
`

const Btn = styled.button`
  border-radius: 2px;
  background-color: ${(props: { active: boolean }) =>
    props.active ? '#4ed8da' : '#4c5055'};
  margin-right: 16px;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${(props: { active: boolean }) =>
    props.active ? '#4c5055' : '#4ed8da'};
  cursor: pointer;
  transition: all 0.25s linear;
`

export default SwitchButtons
