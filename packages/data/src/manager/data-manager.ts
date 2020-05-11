import { TopicConfig, TopicData, TopicHolder, TopicInfo } from '@covidtop/shared/lib/topic'
import { getNowText } from '@covidtop/shared/lib/utils'

import { objectHasher } from '../source/common'
import { allTopicLoaders, TopicLoader } from '../topic'
import { dataIo } from './data-io'

const updateTopicInfo = async (
  topicData: TopicData,
  topicConfig: TopicConfig,
  previousTopicInfo?: TopicInfo,
): Promise<TopicInfo> => {
  const lastChecked = getNowText()
  const dataHash = objectHasher.hash(topicData)

  if (previousTopicInfo && previousTopicInfo.dataHash === dataHash) {
    return dataIo.writeTopicInfo(
      {
        ...previousTopicInfo,
        lastChecked,
      },
      topicConfig,
    )
  }

  const dataPath = await dataIo.writeTopicData(topicData, dataHash, topicConfig)

  return dataIo.writeTopicInfo(
    {
      lastChecked,
      lastUpdated: lastChecked,
      dataHash,
      dataPath,
    },
    topicConfig,
  )
}

export interface RefreshOptions {
  readonly skipIfExists: boolean
}

const refreshTopic = async (topicLoader: TopicLoader, { skipIfExists }: RefreshOptions): Promise<TopicHolder> => {
  const { topicConfig } = topicLoader

  await dataIo.ensureTopicDataDir(topicConfig)
  const previousTopicInfo = await dataIo.readTopicInfo(topicConfig)

  if (skipIfExists && previousTopicInfo) {
    const previousTopicData = await dataIo.readTopicData(previousTopicInfo)

    if (previousTopicData) {
      console.log(`Refresh topic '${topicConfig.id}': SKIPPED`)

      return {
        topicConfig,
        topicInfo: previousTopicInfo,
        topicData: previousTopicData,
      }
    }
  }

  const topicData: TopicData = await topicLoader.loadTopicData()

  return {
    topicConfig,
    topicInfo: await updateTopicInfo(topicData, topicConfig, previousTopicInfo),
    topicData,
  }
}

let cachedTopicHolders: TopicHolder[] = []

const refreshAllTopics = async (options: RefreshOptions): Promise<void> => {
  console.log('Refresh all topics: START')
  const topicHolders: TopicHolder[] = []
  for (const topicLoader of allTopicLoaders) {
    try {
      console.log(`Refresh topic '${topicLoader.topicConfig.id}': START`)
      topicHolders.push(await refreshTopic(topicLoader, options))
      console.log(`Refresh topic '${topicLoader.topicConfig.id}': DONE`)
    } catch (err) {
      console.log(`Refresh topic '${topicLoader.topicConfig.id}': FAILED`)
      console.log(err)
    }
  }
  cachedTopicHolders = topicHolders
  console.log('Refresh all topics: DONE')
}

const getTopicHolders = (): TopicHolder[] => {
  return cachedTopicHolders
}

export const dataManager = {
  refreshAllTopics,
  getTopicHolders,
}
