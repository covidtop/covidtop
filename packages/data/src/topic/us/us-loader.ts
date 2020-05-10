import { TopicLoader } from '../common'
import { usConfig } from './us-config'
import { loadUsTopicData } from './us-data'

export const usLoader: TopicLoader = {
  topicConfig: usConfig,
  loadTopicData: loadUsTopicData,
}
