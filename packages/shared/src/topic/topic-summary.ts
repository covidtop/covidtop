import { LocationGroup } from '../location'
import { TopicConfig } from './topic-config'

export interface TopicSummary {
  readonly topicConfig: TopicConfig
  readonly lastChecked: string
  readonly lastUpdated: string
  readonly dataHash: string
  readonly dataPath: string
  readonly locationGroups: LocationGroup[]
  readonly minDate: string
  readonly maxDate: string
}
