import styled from 'styled-components'

export {
  ButtonsWrapper,
  ButtonsInnerWrapper,
  UndistributedMoneyContainer,
  UndistributedMoneyText,
  AddMoneyContainer,
  Button,
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

const Button = styled.button`
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.12);
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: ${(props: { secondary: string }) => props.secondary};
  cursor: pointer;
  text-transform: uppercase;
  margin-top: 10px;

  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 9px -5px,
    rgba(0, 0, 0, 0.14) 0px 15px 22px 2px, rgba(0, 0, 0, 0.12) 0px 6px 28px 5px;

  &:disabled {
    cursor: not-allowed;
    background-color: gray;
  }
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
