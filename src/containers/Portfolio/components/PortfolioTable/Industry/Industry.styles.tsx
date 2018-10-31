import { Grid, Card } from '@material-ui/core'
import styled from 'styled-components'
import { customAquaScrollBar } from '@styles/cssUtils'
import { navBarHeight } from '@components/NavBar/NavBar.styles'

export const Container = styled(Grid)`
  && {
    overflow-y: auto;
    height: calc(100vh - ${navBarHeight}px);
    padding: 0.5rem 0;
    width: 100%;
  }
`

export const ChartWrapper = styled(Card)`
  max-height: 100%;
  height: 75%;
  width: 100%;
  ${customAquaScrollBar};
`

export const Wrapper = styled(Card)`
  max-height: 100%;
  display: flex;
  margin: 0 20px 5px;
  flex-direction: column;
  overflow-x: auto;
  ${customAquaScrollBar};
`
