import { Location } from '@covidtop/shared/lib/location'

export interface JhuRecord {
  readonly locations: Location[]
  readonly totalByDate: Record<string, number>
}
