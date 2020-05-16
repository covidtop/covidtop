import { TopicConfig } from './topic-config'
import { TopicData } from './topic-data'
import { TopicInfo } from './topic-info'

export interface TopicHolder {
  readonly topicConfig: TopicConfig
  readonly topicInfo: TopicInfo
  readonly topicData: TopicData
}
