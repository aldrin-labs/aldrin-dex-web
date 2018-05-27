export interface Serie {
  x: number
  y: number
  label: string
}

export interface Props {
  data: Serie[][]
}

export interface State {
  crosshairValues: Serie[]
}
