import { TopicConfig, TopicData } from '@covidtop/shared/lib/topic'

export interface MetricContext {
  readonly topicData: TopicData
  readonly topicConfig: TopicConfig
}
