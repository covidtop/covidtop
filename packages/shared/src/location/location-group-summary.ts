import { LocationType } from './location-type'

export interface LocationGroupSummary {
  readonly locationType: LocationType
  readonly lengthOfLocations: number
}
