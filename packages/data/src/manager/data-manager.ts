import { TopicConfig, TopicData, TopicSummary } from '@covidtop/shared/lib/topic'
import { getNowText } from '@covidtop/shared/lib/utils'

import { allTopicLoaders, TopicLoader } from '../topic'
import { dataIo } from './data-io'

const updateTopicSummary = async (
  topicData: TopicData,
  topicConfig: TopicConfig,
  previousTopicSummary?: TopicSummary,
): Promise<TopicSummary> => {
  const lastChecked = getNowText()
  const dataHash = dataIo.hash(topicData)

  if (previousTopicSummary && previousTopicSummary.dataHash === dataHash) {
    return dataIo.writeTopicSummary({
      ...previousTopicSummary,
      lastChecked,
    })
  }

  const { locationGroups, dates } = topicData
  const dataPath = await dataIo.writeTopicData(topicData, dataHash, topicConfig)

  return dataIo.writeTopicSummary({
    topicConfig,
    lastChecked,
    lastUpdated: lastChecked,
    dataHash,
    dataPath,
    locationGroups,
    minDate: dates[0],
    maxDate: dates[dates.length - 1],
  })
}

export interface RefreshOptions {
  readonly skipIfExists: boolean
}

const refreshTopic = async (topicLoader: TopicLoader, { skipIfExists }: RefreshOptions): Promise<TopicSummary> => {
  const { topicConfig } = topicLoader

  await dataIo.ensureTopicDataDir(topicConfig)
  const previousTopicSummary = await dataIo.readTopicSummary(topicConfig)

  if (skipIfExists && previousTopicSummary) {
    return previousTopicSummary
  }

  const topicData: TopicData = await topicLoader.loadTopicData()
  return updateTopicSummary(topicData, topicConfig, previousTopicSummary)
}

let cachedTopicSummaries: TopicSummary[] = []

const refreshAllTopics = async (options: RefreshOptions): Promise<void> => {
  console.log('Refresh all topics: START')
  const topicSummaries: TopicSummary[] = []
  for (const topicLoader of allTopicLoaders) {
    try {
      console.log(`Refresh topic '${topicLoader.topicConfig.id}': START`)
      topicSummaries.push(await refreshTopic(topicLoader, options))
      console.log(`Refresh topic '${topicLoader.topicConfig.id}': DONE`)
    } catch (err) {
      console.log(`Refresh topic '${topicLoader.topicConfig.id}': FAILED`)
      console.log(err)
    }
  }
  cachedTopicSummaries = topicSummaries
  console.log('Refresh all topics: DONE')
}

const getTopicSummaries = (): TopicSummary[] => {
  return cachedTopicSummaries
}

const getTopicData = async (topicLoader: TopicLoader): Promise<TopicData | undefined> => {
  const { topicConfig } = topicLoader
  const topicSummary = await dataIo.readTopicSummary(topicConfig)

  if (!topicSummary) {
    return
  }

  return dataIo.readTopicData(topicSummary)
}

export const dataManager = {
  refreshAllTopics,
  getTopicSummaries,
  getTopicData,
}
