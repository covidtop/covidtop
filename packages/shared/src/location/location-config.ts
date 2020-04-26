import { LocationType } from './location-type'

export interface LocationConfig {
  readonly locationTypes: LocationType[]
  readonly unknownCodes?: string[]
}
