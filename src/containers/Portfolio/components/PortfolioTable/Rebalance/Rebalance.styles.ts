import { customAquaScrollBar } from '@styles/cssUtils'
import styled from 'styled-components'
import { Card, Grid, IconButton, CardContent } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

export { Content, ChartWrapper, ChartContainer, Chart, Container }

const Content = styled(Grid)`
  overflow: auto;
  height: 100vh;
  width: 100%;
  margin: 0;

  ${customAquaScrollBar};
`

const ChartWrapper = styled(Grid)`
  display: flex;
  position: relative;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  height: 45%;
`

const ChartContainer = styled(Card)`
  && {
    height: 100%;
    width: 100%;
  }
`

//  minus card header height
const Chart = styled(CardContent)`
  width: 100%;
  height: calc(100% - 68px);
  padding: 0.5rem;
`

const Container = styled(Grid)`
  justify-content: ${(props: { isEditModeEnabled: boolean }) =>
    props.isEditModeEnabled ? 'space-between' : 'left'};

  max-height: 55%;
`

export const BtnsWrapper = styled(Grid)`
  display: flex;
  flex-direction: column;
`

export const IconButtonWithHover = styled(IconButton)`
  will-change: color;

  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }
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
