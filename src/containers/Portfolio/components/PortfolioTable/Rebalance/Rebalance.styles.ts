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
  height: 25vh;
  padding: 20px;
  justify-content: center;
  align-items: center;

  @media (max-height: 1200px) {
    height: 20vh;
    padding-bottom: 1.5%;
  }

  @media (max-height: 1080px) {
    height: 400px;
    margin-top: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? '180px' : '40px'};
  }
`

const ChartContainer = styled(Paper)`
  && {
    width: 1120px;
    height: inherit;
    border-radius: 20px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
    padding: 15px;
  }

  @media (max-width: 1150px) {
    width: 100%;
  }
`

const Chart = styled.div`
  width: calc(100% - 15px);
  height: 100%;

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
  min-height: 400px;
  display: flex;
  justify-content: center;
  height: 45vh;
  padding: 0 20px 20px;
`
