import { TopicLoader } from '../common'
import { globalConfig } from './global-config'
import { loadGlobalTopicData } from './global-data'

export const globalLoader: TopicLoader = {
  topicConfig: globalConfig,
  loadTopicData: loadGlobalTopicData,
}
