import { WithStyles } from '@material-ui/core'

type T = string | number
type TObj = {
  text: string
  color: string
  number: boolean
  style: any
}
export type Row = Array<T | TObj>

export interface Props extends WithStyles {
  withCheckboxes?: boolean
  padding: 'default' | 'checkbox' | 'dense' | 'none'
  rows?: { head: TObj[]; body: Row[]; footer: Row }
  checkedRows?: number[]
  title?: string | number
  onChange?: (e: Event, id: number) => void
  onSelectAllClick?: (e: Event, id: number) => void
}
