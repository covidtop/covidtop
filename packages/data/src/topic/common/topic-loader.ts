import { TopicConfig, TopicData } from '@covidtop/shared/lib/topic'

export type LoadTopicData = () => Promise<TopicData>

export interface TopicLoader {
  readonly topicConfig: TopicConfig
  readonly loadTopicData: LoadTopicData
}
