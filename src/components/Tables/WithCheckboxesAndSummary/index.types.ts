import { WithStyles } from '@material-ui/core'

type T = string | number
type TObj = {
  text: string
  color: string
  style: any
}
type Row = T[] | TObj[]

export interface Props extends WithStyles {
  withCheckboxes?: boolean
  rows?: { head: Row; body: Row[]; footer: Row }
  checkedRows?: number
  title?: string | number
  // Shadow depth, corresponds to dp in the spec. It's accepting values between 0 and 24 inclusive.
  elevation?: number
  onChange?: (e: Event, id: number) => void
  onSelectAllClick?: (e: Event, id: number) => void
}
