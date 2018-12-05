import styled from 'styled-components'

import DeleteIcon from '@material-ui/icons/Delete'
import { Card } from '@material-ui/core'

export const InputTable = styled.input`
  max-width: 60px;
  background: ${(props: { background: string }) => props.background};
  font-family: ${(props: { fontFamily: string }) => props.fontFamily};
  font-size: 14px;
  border: none;
  outline: none;
  color: ${(props: { isPercentSumGood?: boolean; red: string }) =>
    props.isPercentSumGood ? 'inherit' : props.red};
  
`

export const TableWrapper = styled.div`
  position: relative;
  width: 80%;
  display: flex;
`

export const SDeleteIcon = styled(DeleteIcon)`
  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }
`

export const LoaderWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props: { background: string }) => props.background};

  z-index: 1000;

  & > div {
    z-index: 1;
  }
`

export const LoaderInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const ContentInner = styled(Card)`
  height: 100%;
  display: flex;
`

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const TitleItem = styled.div``
