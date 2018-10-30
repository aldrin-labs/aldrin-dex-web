import styled from 'styled-components'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'


export const InputTable = styled.input`
  max-width: 60px;
  background-color: #2d3136;
  border: none;
  outline: none;
  color: ${(props: { isPercentSumGood?: boolean, red: string }) =>
    props.isPercentSumGood ? 'inherit' : props.red};
`

export const TableWrapper = styled.div`
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
