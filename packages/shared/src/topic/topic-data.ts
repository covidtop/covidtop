import { Location } from '../location'
import { LocationGroup } from './location-group'
import { MeasureGroup } from './measure-group'

export interface TopicData {
  readonly rootLocation: Location
  readonly locationGroups: LocationGroup[]
  readonly dates: string[]
  readonly measureGroups: MeasureGroup[]
}
