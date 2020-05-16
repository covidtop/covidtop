import { TopicLoader } from '../common'
import { nswConfig } from './nsw-config'
import { loadNswTopicData } from './nsw-data'

export const nswLoader: TopicLoader = {
  topicConfig: nswConfig,
  loadTopicData: loadNswTopicData,
}
