export interface IValue {
  x: string
  y: string
}
export interface IState {
  value: IValue | { x: null; y: null }
}

export interface IProps {
  data: {
    risk: string[]
    percentages: number[]
    activeButton: number
  }
}
