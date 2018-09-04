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
  display: ${(props: { isEditModeEnabled?: boolean }) =>
    props.isEditModeEnabled ? 'block' : 'none'};
`

const ButtonsInnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const UndistributedMoneyContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 120px;
`
const UndistributedMoneyText = styled.p`
  font-family: Roboto, sans-serif;
  color: white;
  font-size: 14px;
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
  background-color: #4c5055;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
  text-transform: uppercase;
  margin-top: 10px;

  &:disabled {
    cursor: not-allowed;
    background-color: gray;
  }
`

const Input = styled.input`
  box-sizing: border-box;
  border-bottom: 2px solid rgb(78, 216, 218);
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
  color: rgb(255, 255, 255);
`
