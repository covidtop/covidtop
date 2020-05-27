import { LocationType } from '../location'

export interface LocationGroupSummary {
  readonly locationType: LocationType
  readonly lengthOfLocations: number
}
