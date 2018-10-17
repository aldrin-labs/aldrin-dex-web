import styled from 'styled-components'
import { TypographyFullWidth } from '@styles/cssUtils'
import { Cell, Row, Body } from '@components/OldTable/Table'

export const EmptyCell = styled(Cell)`
  position: relative;
`

export const NotScrollableBody = styled(Body)`
  overflow-y: hidden;
`

export const StyledTypography = styled(TypographyFullWidth)`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
  }
`

export const RowWithVolumeChart = styled(Row)`
  &:before {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: ${(props: { colored?: string }) => Number(props.colored)}%;
    height: 100%;
    content: '';
    background: ${(props: { volumeColor?: string; colored?: string }) =>
      props.volumeColor};
  }
`
