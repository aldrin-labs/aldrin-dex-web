import styled from 'styled-components'
import { Button } from '@material-ui/core'

export {
  ButtonsWrapper,
  ButtonsInnerWrapper,
  UndistributedMoneyContainer,
  UndistributedMoneyText,
  AddMoneyContainer,
  Input,
}

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ButtonsInnerWrapper = styled.div`
  padding: 0 15px 15px 15px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

const UndistributedMoneyContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 120px;
`
const UndistributedMoneyText = styled.p`
  color: ${(props: { textColor: string }) => props.textColor};
  font-size: 14px;
  font-family: ${(props: { fontFamily: string }) => props.fontFamily};
  padding: 15px 0 5px;
  margin: 0;
`

const AddMoneyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 120px;
`


const Input = styled.input`
  color: ${(props: { textColor: string }) => props.textColor};
  box-sizing: border-box;
  border-bottom: ${(props: { secondary: string }) => `2px solid ${props.secondary}`};
  //border-bottom: 2px solid rgb(78, 216, 218);
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
  padding: 10px 0 0;
  margin-bottom: 10px;
`

export const InputContainer = styled.div`
  box-shadow: 0 2px 6px 0 #00000066;
`

export const SButton = styled(Button)`
  margin-bottom: 20px;
`
