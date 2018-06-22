import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Input from '@components/Input/Input'

class Inputs extends PureComponent {
  state = {
    searchSymbol: '',
    addChart: '',
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  render() {
    const { searchSymbol, addChart } = this.state

    return (
      <InputContainer>
        <Input
          name="searchSymbol"
          onChange={this.handleChange}
          value={searchSymbol}
          placeholder="Search symbol"
        />
        <Input
          name="addChart"
          onChange={this.handleChange}
          value={addChart}
          placeholder="Multiple charts"
        />
      </InputContainer>
    )
  }
}

const InputContainer = styled.div`
  padding: 0.5rem;
  margin: auto 2rem auto 0;
  display: flex;
  width: 30%;
  justify-content: center;
`

export default Inputs
