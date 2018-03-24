import { ProfileQueryQuery } from '../profile-annotation'

export interface Props {
  coin?: ProfileQueryQuery['assetById']
  style?: Object
}

export interface State {
  activeChart: number
  lastDrawLocation: any
}
