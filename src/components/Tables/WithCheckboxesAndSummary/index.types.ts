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
  onChange?: (e: Event, id: number) => void
  onSelectAllClick?: (e: Event, id: number) => void
}
