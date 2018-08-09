import { keyframes } from 'styled-components'
import { red, green } from '@material-ui/core/colors'

export const fromLightRedToDeffaultRed = keyframes`
  0% {
  color: ${red[100]};
  }
  color: ${red[400]};
`
export const fromLightGreenToDeffaultGreen = keyframes`
  0% {
  color: ${green[100]};
  }
  color: ${green[500]};
`
