import { Location, LocationType } from '../location'

export interface LocationGroup {
  readonly locationType: LocationType
  readonly locationByCode: Record<string, Location>
}
