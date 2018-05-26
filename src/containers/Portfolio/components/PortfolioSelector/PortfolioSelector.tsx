import * as React from 'react'
import { graphql } from 'react-apollo'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import CloseIcon from 'react-icons/lib/md/close'
import { getKeysQuery } from '../../api'
import { IProps, IState } from './PortfolioSelector.types'

class PortfolioSelector extends React.Component<IProps, IState> {
  state: IState = {
    checkedCheckboxes: null,
    checkboxes: null,
  }

  componentDidMount() {
    if (!this.props.isShownMocks) {
      return
    }

    const checkboxes = ['Test1', 'Test2']
    const checkedCheckboxes = checkboxes.map((ck, i) => i)

    if (checkboxes) {
      this.setState({ checkboxes, checkedCheckboxes }, () => {
        const { onChangeActive } = this.props

        onChangeActive(checkboxes)
      })
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    // called once
    if (nextProps.data && nextProps.data.getProfile && !this.state.checkboxes) {
      const { keys } = nextProps.data.getProfile
      const checkboxes =
        (keys && keys.map((key) => key && key.name).filter(Boolean)) || []
      if (
        nextProps.isShownMocks &&
        checkboxes.indexOf('Test1') === -1 &&
        checkboxes.indexOf('Test2') === -1
      ) {
        checkboxes.push('Test1', 'Test2')
      }
      const checkedCheckboxes = checkboxes.map((ck, i) => i)

      if (checkboxes) {
        this.setState({ checkboxes, checkedCheckboxes }, () => {
          const { onChangeActive } = this.props

          onChangeActive(checkboxes)
        })
      }
    }
  }

  onToggleCheckbox = (index: number) => {
    const { onChangeActive } = this.props

    const checkedCheckboxes =
      (this.state.checkedCheckboxes && this.state.checkedCheckboxes.slice()) ||
      []

    const hasIndex = checkedCheckboxes.indexOf(index)
    if (hasIndex >= 0) {
      checkedCheckboxes.splice(hasIndex, 1)
    } else {
      checkedCheckboxes.push(index)
    }

    this.setState({ checkedCheckboxes }, () => {
      if (!this.state.checkboxes) {
        return
      }
      const checkboxes = this.state.checkboxes
        .map((ck, idx) => {
          if (checkedCheckboxes.indexOf(idx) >= 0) {
            return ck
          }

          return null
        })
        .filter(Boolean)
      onChangeActive(checkboxes)
    })
  }

  onToggleAll = () => {
    const { checkedCheckboxes, checkboxes } = this.state
    if (!checkboxes) {
      return
    }

    if (checkedCheckboxes && checkedCheckboxes.length === checkboxes.length) {
      this.setState({ checkedCheckboxes: null }, () => {
        this.props.onChangeActive([])
      })
    } else {
      const allAccounts = checkboxes.map((ck, i) => i)

      this.setState({ checkedCheckboxes: allAccounts }, () => {
        if (!this.state.checkboxes) {
          return
        }
        const checkboxesAgain = this.state.checkboxes
        checkboxesAgain
          .map((ck, idx) => {
            if (allAccounts.indexOf(idx) >= 0) {
              return ck
            }

            return null
          })
          .filter(Boolean)
        this.props.onChangeActive(checkboxesAgain)
      })
    }
  }

  render() {
    const { checkedCheckboxes, checkboxes } = this.state

    if (!checkboxes) {
      return null
    }

    const isCheckedAll =
      (checkedCheckboxes && checkedCheckboxes.length === checkboxes.length) ||
      false

    return (
      <AccountsWalletsBlock isSideNavOpen={this.props.isSideNavOpen}>
        {console.log(this.props.isSideNavOpen)}
        <AccountsWalletsHeadingWrapper>
          <AccountsWalletsHeading>Api keys</AccountsWalletsHeading>
          <CloseButton onClick={this.props.toggleWallets}>
            <StyledIcon />
          </CloseButton>
        </AccountsWalletsHeadingWrapper>

        <SelectAll>
          <Checkbox
            type="checkbox"
            id="all"
            defaultChecked={true}
            checked={isCheckedAll}
            onClick={this.onToggleAll}
          />
          <Label htmlFor="all">
            <Span />
          </Label>
          <AccountName isChecked={isCheckedAll}>Select All</AccountName>
        </SelectAll>

        <AccountsList>
          {checkboxes.map((checkbox, i) => {
            if (!checkbox) {
              return null
            }
            const isChecked =
              (checkedCheckboxes && checkedCheckboxes.indexOf(i) >= 0) || false

            return (
              <AccountsListItem key={checkbox}>
                <Checkbox
                  type="checkbox"
                  id={checkbox}
                  defaultChecked={true}
                  checked={isChecked}
                  onClick={() => this.onToggleCheckbox(i)}
                />
                <Label htmlFor={checkbox}>
                  <Span />
                </Label>

                <AccountName isChecked={isChecked}>{checkbox}</AccountName>
              </AccountsListItem>
            )
          })}
        </AccountsList>
      </AccountsWalletsBlock>
    )
  }
}

const SelectAll = styled.div`
  margin-top: 32px;
  padding-left: 8px;
`

const AccountName = styled.span`
  color: ${(props: { isChecked: boolean }) =>
    props.isChecked ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 1em;
  font-weight: 500;
  text-align: left;
  margin-left: 24px;
`

const Span = styled.span``

const Label = styled.label``

const Checkbox = styled.input`
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

const AccountsListItem = styled.li`
  display: flex;
  align-items: center;
  font-family: Roboto;
  font-size: 1em;
  font-weight: 500;
  text-align: left;
  color: #4ed8da;
  margin-bottom: 24px;
`

const AccountsList = styled.ul`
  list-style: none;
  margin-top: 34px;
  display: flex;
  flex-direction: column;
  padding-left: 8px;
`

const AccountsWalletsBlock = styled.div`
  min-width: 200px;
  background-color: #2d3136;
  padding: 16px;

  @media (max-width: 840px) {
    display: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
      isSideNavOpen ? 'static' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1301;
    height: 100vh;
  }
`

const AccountsWalletsHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledIcon = styled(CloseIcon)`
  display: none;
  color: #4ed8da;
  font-size: 2rem;
  text-align: center;

  @media (max-width: 840px) {
    display: block;
  }
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`

const AccountsWalletsHeading = styled.span`
  font-family: Roboto;
  font-size: 1.25em;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  color: #ffffff;
`

const mapStateToProps = (store) => ({ isShownMocks: store.user.isShownMocks })

const storeComponent = connect(mapStateToProps)(PortfolioSelector)

export default compose(graphql(getKeysQuery))(storeComponent)
