export interface PiePiece {
  angle: number
  label: string
  opacity?: number
  color?: string | number
  style?: Object
}

export interface Props {
  data: PiePiece[]
  width?: number
  height?: number
  radius?: number
  innerRadius?: number
  flexible?: boolean
}

export interface State {
  data: PiePiece[]
  value: PiePiece | null
}
