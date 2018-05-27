export interface Serie {
  x: number
  y: number
  label: string
}

export interface Props {
  data: Serie[][]
  activeLine: number | null
}

export interface State {
  crosshairValues: Serie[]
}
