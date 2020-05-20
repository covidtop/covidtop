import { MetricParams } from '@covidtop/shared/lib/params'
import { TopicConfig, TopicData } from '@covidtop/shared/lib/topic'

export interface MetricContext {
  readonly topicConfig: TopicConfig
  readonly topicData: TopicData
  readonly metricParams: MetricParams
}
