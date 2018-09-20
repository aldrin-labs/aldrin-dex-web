import styled, { css } from 'styled-components'
import { customAquaScrollBar } from '@styles/cssUtils'

export { Span, Label, Wrapper, Table, TableHeading, PTD, PT, PTF, PTH }

const Span = styled.span``

const Label = styled.label``

const Wrapper = styled.div`
  overflow-y: scroll;
  padding-right: 2px;

  ${customAquaScrollBar};
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
`

const TableHeading = styled.div`
  display: flex;
  text-transform: uppercase;
  font-family: Roboto, sans-serif;
  font-size: 17px;
  color: inherit;
  font-weight: bold;
  letter-spacing: 1.1px;
  min-height: 30px;
`

const PT = css`
  display: table;
  width: 100%;
  position: sticky;
  z-index: 1;

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid #fff;
  }
`

const PTF = css`
  bottom: 0;

  &::before {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px solid #fff;
  }
`

const PTH = css`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  color: inherit;
  text-align: left;
  font-weight: 500;
  position: relative;
  padding: 10px 16px 10px 10px;
`

const PTD = css`
  color: ${(props: { isSelected?: boolean, secondary?: string }) =>
  props.isSelected ? props.secondary : 'inherit'};

  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  white-space: nowrap;

  & svg {
    width: 15px;
    height: 15px;
  }
`
