import { LocationType } from '../location'

export interface LocationGroupConfig {
  readonly locationType: LocationType
  readonly unknownCodes?: string[]
}
