import { Location } from './location'
import { LocationType } from './location-type'

export interface LocationGroup {
  readonly locationType: LocationType
  readonly locationByCode: Record<string, Location>
}
