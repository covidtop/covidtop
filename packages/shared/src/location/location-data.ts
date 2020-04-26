import { Location } from './location'

export interface LocationRecord {
  readonly hasGeography: boolean
  readonly locationByCode: Readonly<Record<string, Location>>
}

export interface LocationData {
  readonly rootLocation: Location
  readonly locationRecordByType: Readonly<Record<string, LocationRecord>>
}
