import { opacityAnimation } from '@styles/keyframes'
import { Cell, Row } from '@components/Table/Table'
import { TypographyFullWidth } from '@utils/cssUtils'

export const EmptyCell = Cell.extend`
  position: relative;
`

export const StyledTypography = TypographyFullWidth.extend`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
    ${(props: { anime?: boolean }) =>
      props.anime
        ? `animation: ${opacityAnimation} 300ms cubic-bezier(0.4, 0, 1, 1) 0s 1 normal none running;`
        : ''};
  }
`

export const RowWithVolumeChart = Row.extend`
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
