import styled from 'styled-components'
import Arrow from 'react-icons/lib/md/keyboard-arrow-left'

export const AccountsListItem = styled.li`
  display: flex;
  align-items: center;
  font-family: Roboto, sans-serif;
  font-size: 1em;
  font-weight: 500;
  text-align: left;
  color: #4ed8da;
  margin-bottom: 24px;
`

export const AccountsList = styled.ul`
  list-style: none;
  margin-top: 34px;
  display: flex;
  flex-direction: column;
  padding-left: 8px;
`

export const AccountsWalletsHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledIcon = styled(Arrow)`
  font-family: Roboto, sans-serif;
  color: #4ed8da;
  text-align: center;
  opacity: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '1' : '0'};
  font-size: 2rem;
  right: 10.7rem;

  position: absolute;
  bottom: 47%;
  transition: opacity 0.2s linear;
`

export const Span = styled.span``

export const Label = styled.label``

export const Checkbox = styled.input`
  display: none;

  & + ${Label} ${Span} {
    display: inline-block;

    width: 22px;
    height: 22px;

    cursor: pointer;
    vertical-align: middle;

    border: 1.5px solid #909294;
    border-radius: 3px;
    background-color: transparent;
  }

  & + ${Label}:hover ${Span} {
    border-color: #4ed8da;
  }

  & :checked + ${Label} ${Span} {
    border-color: #4ed8da;
    background-color: #4ed8da;
    background-image: url('https://image.flaticon.com/icons/png/128/447/447147.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 14px;
  }
`

export const CloseContainer = styled.div`
  height: 100%;
`

export const SelectAll = styled.div`
  margin-top: 32px;
  padding-left: 8px;
`

export const AccountName = styled.span`
  color: ${(props: { isChecked: boolean }) =>
    props.isChecked ? '#4ed8da' : '#fff'};

  font-family: Roboto, sans-serif;
  font-size: 1em;
  font-weight: 500;
  text-align: left;
  margin-left: 24px;
`

export const Headline = styled.div`
  font-family: Roboto, sans-serif;
  color: #4ed8da;
  opacity: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '0' : '1'};
  font-size: 0.7em;
  transform: rotate(-90deg);
  left: -0.6rem;
  transform-origin: right, top;
  position: absolute;
  bottom: 50%;
  transition: opacity 0.4s linear;

  @media (min-width: 1000px) {
    font-size: 1rem;
    right: 10.8rem;
  }
`
