import styled from 'styled-components'


export { SwitchButtonsWrapper, HelperForCentering, InputContainer, TableContainer, Input }

const SwitchButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const HelperForCentering = styled.div`
  width: 224px;
  min-width: 100px;
  opacity: 0;
`

const InputContainer = styled.div`
  margin: auto 2rem auto 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 100px;

  @media (max-width: 1080px) {
    margin: auto;
    flex-wrap: wrap;
  }
`

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  place-content: flex-end;
  width: 50%;
  max-width: 50rem;
  @media (max-width: 600px) {
    margin-top: 1rem;
  }
`

const Input = styled.input`
  color: ${(props: { color: boolean }) => props.color};
  box-sizing: border-box;
  background: transparent;
  border-top: none;
  border-left: none;
  border-bottom: 2px solid rgba(78, 216, 218, 0.3);
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 10px 0 0px;
  transition: all 0.25s ease-out;

  &:focus {
    border-bottom: 2px solid rgb(78, 216, 218);
  }
`
