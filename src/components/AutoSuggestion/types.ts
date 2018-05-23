export type Suggestion = {
  name: string
  value: string | number
}

export interface Props {
  placeholder: string
}

export interface State {
  list: Suggestion[]
  value: string
  suggestions: Suggestion[]
}
