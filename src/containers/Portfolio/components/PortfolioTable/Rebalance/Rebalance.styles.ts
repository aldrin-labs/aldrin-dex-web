import { customAquaScrollBar } from '@styles/cssUtils'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'

export { Content, ChartWrapper, ChartContainer, Chart, PTextBox, Container }

const Content = styled.div`
  overflow: auto;
  height: 100%;

  @media (min-height: 1080px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  ${customAquaScrollBar};
`

const ChartWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  //height: 25vh;
  padding: 20px;
  justify-content: center;
  align-items: center;

  //@media (max-height: 1200px) {
  //  height: 20vh;
  //  padding-bottom: 1.5%;
  //}
`

const ChartContainer = styled(Paper)`
  background: ${(props: { background: string }) => props.background};

  && {
    width: 100%;
    height: inherit;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
  }

  @media (max-width: 1150px) {
    width: 100%;
  }
`

const Chart = styled.div`
  width: 100%;
  height: inherit;
  border-radius: 1rem;
  padding: 0.5rem;
  background: ${(props: { background: string }) => props.background};

  & > div {
    height: inherit;
  }
`

const PTextBox = styled.div`
  font-size: 30px;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3136;
`

const Container = styled.div`
  display: flex;
  justify-content: ${(props: { isEditModeEnabled: boolean }) => props.isEditModeEnabled ? 'space-between' : 'left'};
  padding: 0 20px 20px;
`
