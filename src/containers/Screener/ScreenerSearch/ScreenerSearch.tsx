import * as React from 'react'
import styled from 'styled-components'
import {IProps, IState} from './ScreenerSearch.types'
import Input from 'material-ui/Input'


export default class ScreenerSearch extends React.Component <IProps, IState> {
  state: IState = {
    inputSearchText: ''
  }

  onChangeSearchText = (e: any) => {
    this.onUpdateGlobalFilterValue(e.target.value)
    this.setState({inputSearchText: e.target.value})
  }

  onUpdateGlobalFilterValue = (newSearchText: string) => {
    this.props.onChangeSearchText(newSearchText)
  }

  render() {

    // console.log(this.state.inputSearchText);
    // console.log('render');


    return (
      <SearchWrapper>
        <InputWrapper>
        <Input type="text" onChange={this.onChangeSearchText} value={this.state.inputSearchText} placeholder='Search ticker...' />
        </InputWrapper>
      </SearchWrapper>
    )
  }

}

const SearchWrapper = styled.div`
    width: 1520px;
    margin: 0 auto;
    padding: 20px;
`

const InputWrapper = styled.div`
  
`
