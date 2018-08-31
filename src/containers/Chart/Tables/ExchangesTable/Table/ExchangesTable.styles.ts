import { Button } from '@material-ui/core'
import styled from 'styled-components'
import { FaCircle } from 'react-icons/lib/fa'

import { Table, HeadCell, FullWidthBlock, Cell } from '@components/Table/Table'

export const Icon = styled(FaCircle)`
  font-size: 0.5rem;
  min-width: 20%;
  flex-basis: 20%;
  color: ${(props: { color: string }) => props.color};
`

export const FlexCell = Cell.extend`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
`

export const FullWidthBlockMovedLeft = FullWidthBlock.extend`
  position: relative;
  left: 20%;
`

export const StyledHeadCell = styled(HeadCell)`
  line-height: 37px;
  padding: 0.25rem 0.4rem;
`

export const StyledTable = styled(Table)`
  overflow-x: hidden;
`

export const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max-width: 1080px) {
      display: block;
    }
  }
`
