import styled from 'styled-components'
import { Select } from '@material-ui/core'
export const StyledSelect = styled(Select)`
&& > div > div::after {
  content: "Last 24h";
  margin-left: 16px;
  font-size: 1rem;
  box-sizing: content-box;
  font-weight: 400;
  line-height: 1.5em;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
}`;