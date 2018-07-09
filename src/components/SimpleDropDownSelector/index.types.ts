export interface IProps {
  options: { value: string | number; label: string | number }[]
  style?: any
  handleChange: Function
  name?: string
  id?: string
  value: string | number
}
