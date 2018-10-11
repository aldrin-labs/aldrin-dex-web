import styled from 'styled-components'
import { Typography, Divider, Paper } from '@material-ui/core'

import { customAquaScrollBar } from '@styles/cssUtils'

export const GridContainer = styled.div`
  align-self: center;

  display: Grid;
  height: 70%;
  grid-template-columns: 1fr;
  width: 100%;
  grid-template-rows: 58% 1% 40%;
  max-width: 100rem;

  @media (min-width: 1400px) {
    height: 100%;
  }
  @media (min-width: 1800px) {
    justify-content: center;

    grid-template-rows: 58% 1% 40%;
  }
  @media (min-width: 3000px) {
    align-items: center;
  }
`

export const ChartTitle = styled(Typography)`
  margin-left: 1.2rem;
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

export const StyledDivider = styled(Divider)`
  margin-bottom: 1rem;
  grid-column: 1 / span 2;
`

export const TableWrapper = styled(Paper)`
  display: flex;
  margin: 0 20px 5px;
  width: 100%;
  overflow-x: scroll;

  ${customAquaScrollBar};
`

export const PTChartContainer = styled.div`
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
