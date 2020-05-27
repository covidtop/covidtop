import { LocationGroupSummary } from './location-group-summary'
import { TopicConfig } from './topic-config'
import { TopicInfo } from './topic-info'

export interface TopicSummary {
  readonly topicConfig: TopicConfig
  readonly topicInfo: TopicInfo
  readonly locationGroupSummaries: LocationGroupSummary[]
  readonly minDate: string
  readonly maxDate: string
}
