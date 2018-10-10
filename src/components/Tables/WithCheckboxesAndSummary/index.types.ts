import { WithStyles } from '@material-ui/core'
import React from 'react'

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
  // use NaN if you want to select nothing
  expandedRow?: number
  padding: 'default' | 'checkbox' | 'dense' | 'none'
  rows?: { head: TObj[]; body: Row[]; footer: Row }
  checkedRows?: number[]
  title?: string | number
  onChange?: (e: React.ChangeEvent, id: number) => void
  onSelectAllClick?: (e: Event, id: number) => void
}
