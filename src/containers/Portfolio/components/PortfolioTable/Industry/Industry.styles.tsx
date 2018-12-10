import { Grid, Card } from '@material-ui/core'
import styled from 'styled-components'
import { customAquaScrollBar } from '@styles/cssUtils'
import { navBarHeight } from '@components/NavBar/NavBar.styles'

export const Container = styled(Grid)`
  && {
    overflow-y: auto;
    height: calc(100vh - ${navBarHeight}px);

    margin: 0;
    width: 100%;
  }
`

export const Wrapper = styled(Card)`
  max-height: 100%;
  display: flex;
  width: 100%;

  flex-direction: column;
  overflow-x: auto;
  ${customAquaScrollBar};
`

export const ChartWrapper = styled(Wrapper)`
  max-height: 100%;
  height: 100%;
`
