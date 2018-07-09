export interface IProps {
  options: { value: string | number; label: string | number }[]
  handleChange: Function
  name?: string
  id?: string
  value: string | number
}
