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
  padding: 15px;
  box-shadow: 0 2px 6px 0 #00000066;
  background: ${(props: { background: string }) => props.background};
  margin-right: 2rem;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  min-width: 100px;

  @media (max-width: 1080px) {
    margin: auto;
    flex-wrap: wrap;
  }
`

const TableContainer = styled.div`
  background: ${(props: { background: string }) => props.background};
  box-shadow: 0 2px 6px 0 #00000066;
  margin: 15px 0 0 0;

  display: flex;
  flex-direction: column;
  place-content: flex-end;
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
  padding: 0.5rem;
  //margin: 1rem 0 0 2.5rem;
  flex-grow: 1;
  //min-width: 0;
  height: 300px;
  border-radius: 1rem;
  background: ${(props: { background: string }) => props.background};

  @media (max-width: 1080px) {
    width: 100%;
    flex-basis: 100%;
  }
`

const ImportData = styled.div`
  //width: 80%;
  //display: flex;
  //justify-content: center;
  //margin: 0 auto;
  //
  //@media (max-width: 1080px) {
  //  justify-content: space-between;
  //  width: 100%;
  //  flex-wrap: wrap;
  //}

  display: flex;
  align-items: flex-end;
  margin: 0 2rem;
`
