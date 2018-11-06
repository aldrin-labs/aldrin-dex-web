import styled from 'styled-components'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'


export const InputTable = styled.input`
  max-width: 60px;
  background: ${(props: { background: string }) => props.background};
  border: none;
  outline: none;
  color: ${(props: { isPercentSumGood?: boolean, red: string }) =>
    props.isPercentSumGood ? 'inherit' : props.red};
`

export const TableWrapper = styled.div`
  position: relative;
  width: 80%;
  display: flex;
  box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2),
    0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12);
`

export const SAddIcon = styled(AddIcon)`
  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }
`

export const SDeleteIcon = styled(DeleteIcon)`
  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }
`

export const LoaderWrapper = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    
    & > div {
      z-index: 1;
    }
`

export const LoaderInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const ContentInner = styled.div`
  width: 100%;
  display: flex;
  ${(props: { loading: boolean }) =>
  props.loading ? `
  filter: blur(10px);
  user-select: none;
  pointer-events: none;
  ` : ``};
`
