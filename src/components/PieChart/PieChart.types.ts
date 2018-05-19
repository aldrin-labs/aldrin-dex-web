export interface PiePiece {
  angle: number
  label: string
  color?: string
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
  value: PiePiece | null
}
