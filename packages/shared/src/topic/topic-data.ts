import { Location, LocationGroup } from '../location'
import { MeasureType } from '../measure'
import { TopicRecord } from './topic-record'

export interface TopicData {
  readonly rootLocation: Location
  readonly locationGroups: LocationGroup[]
  readonly measureTypes: MeasureType[]
  readonly dates: string[]
  readonly topicRecords: TopicRecord[]
}
