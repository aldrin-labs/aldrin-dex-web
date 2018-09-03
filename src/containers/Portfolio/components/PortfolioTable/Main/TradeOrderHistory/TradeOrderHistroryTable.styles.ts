import { customAquaScrollBar } from '@utils/cssUtils'
import { css } from 'styled-components'
import styled from 'styled-components'

export {Wrapper, Table, PT, PTH, PTHC, PTHead, PTR, PTD, PTDC, PTBody, Icon}

const Wrapper = styled.div`
  ${customAquaScrollBar};
`
const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
`

const PT = css`
  display: table;
  width: 100%;
  position: sticky;

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }
`

const PTH = css`
  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: left;
  font-weight: 500;
  position: relative;
  padding: 10px 16px 10px 10px;
  user-select: none;
`

const PTHC = styled.th`
  ${PTH};
  min-width: 100px;
  padding-right: 0;

  &:nth-child(1) {
    min-width: 80px;
  }

  &:nth-child(2) {
    min-width: 70px;
  }

  &:nth-child(4) {
    min-width: 80px;
  }

  &:nth-child(5) {
    min-width: 50px;
  }

  &:nth-child(6) {
    min-width: 150px;
  }
`

const PTHead = styled.thead`
  ${PT};
  top: 0;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
  props.isSelected ? '#2d3136' : '#393e44'};

  &:nth-child(even) {
    background-color: ${(props: { isSelected?: boolean }) =>
  props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }
`

const PTD = css`
  color: ${(props: { isSelected?: boolean }) =>
  props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;

  & svg {
    width: 15px;
    height: 15px;
  }
`
const PTDC = styled.td`
  ${PTD};
  min-width: 100px;
  padding-right: 0;

  &:nth-child(1) {
    min-width: 80px;
    text-overflow: ellipsis;
  }

  &:nth-child(2) {
    min-width: 70px;
    text-overflow: ellipsis;
  }

  &:nth-child(4) {
    min-width: 80px;
  }

  &:nth-child(5) {
    min-width: 50px;
  }

  &:nth-child(6) {
    min-width: 150px;
    text-overflow: ellipsis;
  }
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
  border-bottom: 1px solid #fff;
`

const Icon = styled.i`
  padding-right: 5px;
`
