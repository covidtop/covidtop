import { Location } from '../location'
import { LocationGroupConfig } from './location-group-config'

export interface LocationConfig {
  readonly rootLocation: Location
  readonly locationGroups: LocationGroupConfig[]
}
