import { Location } from './location'
import { LocationType } from './location-type'

export interface LocationConfig {
  readonly rootLocation: Location
  readonly locationTypes: LocationType[]
}
