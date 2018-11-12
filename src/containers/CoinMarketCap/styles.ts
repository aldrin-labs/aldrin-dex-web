import { Grid, Card } from '@material-ui/core'
import styled from 'styled-components'

import { navBarHeight } from '@components/NavBar/NavBar.styles'

export const Container = styled(Grid)`
  && {
    overflow-y: auto;
    height: calc(100vh - ${navBarHeight}px);
    padding: 0.5rem 0;
    width: 100%;
  }
`
export const TableWrapper = styled(Card)`
  max-height: 100%;
  display: flex;
  flex-direction: column;
`

export const TableContainer = styled(Grid)`
  && {
    height: 80%;
  }
`
