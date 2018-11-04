import { customAquaScrollBar } from '@styles/cssUtils'
import styled from 'styled-components'
import { Paper, Card } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import CardHeader from '@components/CardHeader'

export { Content, ChartWrapper, ChartContainer, Chart, Container }

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
  padding: 20px;
  justify-content: center;
  align-items: center;
`

const ChartContainer = styled(Card)`

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

const Container = styled.div`
  display: flex;
  justify-content: ${(props: { isEditModeEnabled: boolean }) => props.isEditModeEnabled ? 'space-between' : 'left'};
  padding: 0 20px 20px;
  max-height: 60vh;
`

export const InnerChartContainer = styled.div`
  padding: 0 15px 15px 15px;
`

export const BtnsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const Label = styled(Typography)`
  padding: 6px 6px 6px 6px;
  margin-bottom: 15px;
  font-size: 0.875rem;
  background-color: #263238;
  font-weight: bold;
  white-space: nowrap;
  text-transform: uppercase;
`

export const StyledCardHeader = styled(CardHeader)`
  margin-bottom: 1rem;
`
