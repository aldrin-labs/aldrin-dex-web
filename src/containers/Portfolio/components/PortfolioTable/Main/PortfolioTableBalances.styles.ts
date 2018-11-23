import styled from 'styled-components'
import { Paper, Grid, Card } from '@material-ui/core'

import { customAquaScrollBar } from '@styles/cssUtils'
import { Container } from '../Industry/Industry.styles'

export const GridContainer = styled(Container)`
  flex-wrap: nowrap;
  flex-direction: column;
  @media (max-width: 960px) {
    flex-wrap: wrap;
    flex-direction: row;
  }
  && {
    margin: 0;
  }
`

export const ChartWrapper = styled(Card)`
  position: relative;
  height: 100%;
  width: 100%;
  ${customAquaScrollBar};
`

export const TableContainer = styled(Grid)`
  && {
    height: 60%;
  }
`
export const ChartContainer = styled(Grid)`
  flex-basis: 51%;
  padding: 0 8px;
  @media (max-width: 960px) {
    flex-basis: 100%;
    padding: 0 8px;
  }
  && {
    height: 40%;
  }
`

export const PTWrapper = styled(Paper)`
  grid-column: 2;
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 1.5rem auto;
  padding: 1rem 0;
  height: calc(100vh - 130px);
  overflow-y: auto;
  @media (max-width: 840px) {
    margin: 1.5rem auto;
  }

  @media (max-width: 550px) {
    width: calc(100% - 90px);
    margin: 0.625rem auto;
  }

  @media (max-width: 425px) {
    width: calc(100% - 20px);
  }

  ${customAquaScrollBar};
`

export const TableWrapper = styled(Card)`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  ${customAquaScrollBar};
`

export const TablesWrapper = styled(Grid)`
  max-height: 50%;
  flex-basis: inherit;
  padding: 0 !important;
  margin: 0;
  @media (max-width: 960px) {
    max-height: inherit;
  }
`

export const PTChartContainer = styled(Grid)`
  position: relative;
  grid-column: 1 / span 2;
  height: 100%;
  @media (max-width: 500px) {
    display: none;
  }

  @media (max-height: 650px) {
    display: none;
  }
`
