import styled from 'styled-components'
import Arrow from '@material-ui/icons/ChevronLeft'
import { TypographyFullWidth } from '@styles/cssUtils'

export const AccountsListItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 1em;
  font-weight: 500;
  text-align: left;
  color: #4ed8da;
`

export const AccountsList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  margin: 0;
`

export const AccountsWalletsHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledIcon = styled(Arrow)`
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

export const CloseContainer = styled.div`
  height: 100%;
`

export const SelectAll = styled.div`
  margin-top: 1rem;
  padding-left: 0.5rem;
  display: flex;
`

export const AccountName = TypographyFullWidth.extend`
  height: 50%;
  margin: auto;
`

export const Headline = styled.div`
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
