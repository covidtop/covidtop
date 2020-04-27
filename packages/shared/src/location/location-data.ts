import { Location } from './location'

export type LocationByCode = Readonly<Record<string, Location>>

export interface LocationRecord {
  readonly hasGeography: boolean
  readonly locationByCode: LocationByCode
}

export interface LocationData {
  readonly rootLocation: Location
  readonly locationRecordByType: Readonly<Record<string, LocationRecord>>
}
