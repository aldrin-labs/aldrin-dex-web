import styled from 'styled-components'

export { ActionButtonsContainer, ActionButton, EditIconWrapper }

const ActionButton = styled.button`
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
  justify-content: center;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  & svg {
    color: white;
    padding-bottom: 7px;
  }

  &:hover svg {
    color: #4ed8da;
  }
`

const ActionButtonsContainer = styled.div`
  display: flex;
  min-width: 150px;
  justify-content: space-around;
  padding-left: 10px;

  & ${ActionButton} {
    visibility: ${(props: { isEditModeEnabled?: boolean }) =>
  props.isEditModeEnabled ? 'visible' : 'hidden'};
  }
`

const EditIconWrapper = styled.div`
  &:hover {
    color: ${(props: { isEditModeEnabled?: boolean }) =>
  props.isEditModeEnabled ? '#f44336' : '#4caf50'};
  }

  & svg {
    padding-bottom: ${(props: { isEditModeEnabled?: boolean }) =>
  props.isEditModeEnabled ? '4px' : '7px'};
  }
`
