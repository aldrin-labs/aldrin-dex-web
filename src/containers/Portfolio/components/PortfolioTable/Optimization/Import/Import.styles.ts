import styled from 'styled-components'

export {
  SwitchButtonsWrapper,
  HelperForCentering,
  InputContainer,
  TableContainer,
  Input,
  ImportData,
  Chart,
}

const SwitchButtonsWrapper = styled.div`
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
`

const HelperForCentering = styled.div`
  width: 224px;
  min-width: 100px;
  opacity: 0;
`

const InputContainer = styled.div`
  min-height: 400px;
  box-shadow: 0 2px 6px 0 #00000066;
  background: ${(props: { background: string }) => props.background};
  margin-right: 2rem;
`

const TableContainer = styled.div`
  flex-grow: 1;
  justify-content: flex-start;
  min-height: 400px;
  background: ${(props: { background: string }) => props.background};
  box-shadow: 0 2px 6px 0 #00000066;
  margin: 0;
  
  display: flex;
  flex-direction: column;
  width: 30%;
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

const Chart = styled.div`
  height: 360px;
  padding: 0.5rem;
  flex-grow: 1;
  border-radius: 1rem;
  background: ${(props: { background: string }) => props.background};

  @media (max-width: 1080px) {
    width: 100%;
    flex-basis: 100%;
  }
`

const ImportData = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 0 2rem;
`
