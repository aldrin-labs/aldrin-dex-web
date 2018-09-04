import styled from 'styled-components'

import { customAquaScrollBar } from '@styles/cssUtils'
import { PT, PTH, PTD, PTF } from '../sharedStyles/sharedStyles'

export { TableAndHeadingWrapper, PTHead, PTFoot, PTDC, PTBody, PTHC, PTR }

const TableAndHeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;

  &:not(:first-child) {
    padding-left: 60px;
  }

  ${customAquaScrollBar};
`

const PTHead = styled.thead`
  ${PT};
  top: 0;
  user-select: none;
`

const PTFoot = styled.tfoot`
  ${PT};
  ${PTF};
`

const PTDC = styled.td`
  ${PTD};
  min-width: 100px;
  overflow: hidden;

  &:nth-child(2) {
    min-width: 70px;
    text-align: left;
  }
  &:nth-child(3) {
    text-align: right;
  }
  &:nth-child(4) {
    text-align: right;
    min-width: 100px;
    &:hover {
      & svg {
        color: #ffffff;
      }
    }
  }
  &:nth-child(5) {
    text-align: right;
    min-width: 100px;
  }
  &:nth-child(6) {
    text-align: left;
    min-width: 150px;
  }
  &:nth-child(7) {
    padding: 1.75px 5px;
    min-width: 30px;
    text-align: left;
  }
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
  border-bottom: 1px solid #fff;
`

const PTHC = styled.th`
  ${PTH};
  min-width: 100px;

  &:nth-child(2) {
    min-width: 70px;
    text-align: left;
  }
  &:nth-child(3),
  &:nth-child(4) {
    text-align: right;
  }
`
const PTR = styled.tr`
  cursor: pointer;
  background-color: #393e44;

  &:nth-child(even) {
    background-color: #3a4e4e;
  }
`
