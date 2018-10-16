import { Paper, Grid } from '@material-ui/core'
import styled from 'styled-components'
import { customAquaScrollBar } from '@styles/cssUtils'

export const Container = styled(Grid)`
  && {
    height: calc(100vh - 80px);
    padding: 0.5rem 0;
    width: 100%;
  }
`

export const ChartWrapper = styled(Paper)`
  max-height: 100%;
  height: 75%;
  width: 100%;
  ${customAquaScrollBar};
`

export const Wrapper = styled(Paper)`
  max-height: 100%;
  display: flex;
  margin: 0 20px 5px;
  flex-direction: column;
  overflow-x: scroll;
  ${customAquaScrollBar};
`
