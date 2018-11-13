import { Grid, Card, Paper } from '@material-ui/core'
import styled from 'styled-components'
import { navBarHeight } from '@components/NavBar/NavBar.styles'

export const GridContainer = styled(Grid)`
  && {
    padding: 0.5rem;
    justify-content: center;
    min-height: 600px;
    height: 100%;
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${navBarHeight}px);
  z-index: 0;
`

export const TableWrapper = styled(Card)`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`

export const DonutChatWrapper = styled(TableWrapper)`
  height: 50vh;
`

export const TableContainer = styled(Grid)`
  && {
    height: 100%;
  }
`

export const ChartWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
`