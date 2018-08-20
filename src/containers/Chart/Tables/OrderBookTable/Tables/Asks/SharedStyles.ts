import { red } from '@material-ui/core/colors'
import { Cell } from '@components/Table/Table'

export const EmptyCell = Cell.extend`
  position: relative;

  &: before {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: ${(props: { colored?: string }) => Number(props.colored)}%;
    height: 100%;
    content: '';
    background-color: ${red[400]};
  }
`
