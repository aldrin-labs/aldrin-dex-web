import React from 'react'
import Input from 'material-ui/Input'
import styled from 'styled-components'

const SLogin = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const SInput = styled(Input)`
`

const Login = () => {
  return (
    <SLogin>
      <SInput
        defaultValue="Hello world"
        inputProps={{
          'aria-label': 'Description',
        }}
      />
      <SInput
        value="Disabled"
        disabled
        inputProps={{
          'aria-label': 'Description',
        }}
      />
      <SInput
        defaultValue="Error"
        error
        inputProps={{
          'aria-label': 'Description',
        }}
      />
    </SLogin>
  );
}

export default withStyles(styles)(Inputs);
