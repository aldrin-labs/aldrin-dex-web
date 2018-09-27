import styled, { css } from 'styled-components'
import { customAquaScrollBar } from '@styles/cssUtils'
import SelectReact from 'react-select'

import { PT, PTH, PTD, PTF } from '../sharedStyles/sharedStyles'
import ReactSelectComponent from '@components/ReactSelectComponent'

export {
  TableAndHeadingWrapper,
  PTHR,
  PTD,
  PTDR,
  PTR,
  PTBody,
  PTHRNoEditMode,
  PTHREditMode,
  PTHead,
  PTFoot,
  TableButton,
  InputTable,
}

const TableAndHeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  color: ${(props: { textColor: string }) => props.textColor};


  &:not(:first-child) {
    min-height: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? '55vh' : ''};
  }

  &:not(:first-child) {
    padding-left: 60px;
  }

  ${customAquaScrollBar};
`

const PTHR = styled.th`
  ${PTH};
`

const PTDRNoEditMode = css`
  min-width: 100px;

  &:nth-child(2) {
    min-width: 70px;
  }

  &:nth-child(3) {
    text-align: right;
  }

  &:nth-child(4) {
    text-align: right;
  }

  &:nth-child(4) {
    text-align: right;
    &:hover {
      & svg {
        color: inherit;
      }
    }
  }
  &:nth-child(5) {
    min-width: 150px;
  }
  &:nth-child(6) {
    display: none;
  }
`

const PTDR = styled.td`
  ${PTD};
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
  border-bottom: 1px solid #fff;

  & ${PTDR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? PTDREditMode : PTDRNoEditMode};
  }
`

const PTHRNoEditMode = css`
  min-width: 100px;
  &:nth-child(1) {
  }

  &:nth-child(2) {
    text-align: left;
    min-width: 70px;
  }

  &:nth-child(3) {
    text-align: right;
  }

  &:nth-child(4) {
    text-align: right;
  }

  &:nth-child(5) {
    min-width: 150px;
  }
  &:nth-child(6) {
    display: none;
  }
`
const PTHREditMode = css`
  &:nth-child(1) {
    padding: 10px;
    text-align: left;
  }

  &:nth-child(2) {
    text-align: left;
    min-width: 100px;
  }

  &:nth-child(3) {
    min-width: 100px;
  }

  &:nth-child(4),
  &:nth-child(5) {
    text-align: right;
    min-width: 100px;
  }
  &:nth-child(6) {
    text-align: left;
    min-width: 150px;
  }
  &:nth-child(7) {
    width: 30px;
    text-align: left;
    padding: 1.75px 5px;
  }
`

const PTHead = styled.thead`
  ${PT};
  top: 0;
  user-select: none;
  
  & ${PTHR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? PTHREditMode : PTHRNoEditMode}
`

const PTFoot = styled.tfoot`
  ${PT};
  ${PTF};
  
  & ${PTHR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? PTHREditMode : PTHRNoEditMode};
`

const PTDREditMode = css`
  ${PTD};

  &:nth-child(1) {
    padding: 1.75px 10px;
  }

  &:nth-child(2) {
    min-width: 100px;
  }
  &:nth-child(3) {
    min-width: 100px;
  }
  &:nth-child(4) {
    text-align: right;
    min-width: 100px;
    &:hover {
      & svg {
        color: inherit;
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

const InputTable = styled.input`
  max-width: 60px;
  background-color: #2d3136;
  border: none;
  outline: none;
  color: ${(props: { isPercentSumGood?: boolean, red: string }) =>
    props.isPercentSumGood ? 'inherit' : props.red};
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { 
    isSelected?: boolean,
    background: string,
    selectedBackground: string
  }) =>
    props.isSelected ? props.selectedBackground : props.background};

  & ${InputTable} {
    background-color: ${(props: { 
    isSelected?: boolean,
    background: string,
    selectedBackground: string
  }) =>
    props.isSelected ? props.selectedBackground : props.background};

    border: 1px solid #928282;
  }

  &:nth-child(even) {
    background-color: ${(props: { 
    isSelected?: boolean,
    evenBackground: string,
    selectedBackground: string
  }) =>
    props.isSelected ? props.selectedBackground : props.evenBackground};
  }

  &:nth-child(even) ${InputTable} {
    background-color: ${(props: { 
    isSelected?: boolean,
    evenBackground: string,
    selectedBackground: string
  }) =>
    props.isSelected ? props.selectedBackground : props.evenBackground};
  }
`

const TableButton = styled.button`
  border: none;
  margin: 0;
  padding: 1.75px 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  text-align: inherit;
  outline: none;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  &:hover {
    & svg {
      color: ${(props: { isDeleteColor?: boolean, red: string, green: string }) =>
        props.isDeleteColor ? props.green : props.red};
    }
  }
  & svg {
    width: 18px;
    height: 18px;
  }
`
