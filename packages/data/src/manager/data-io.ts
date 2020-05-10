import { TopicConfig, TopicData, TopicSummary } from '@covidtop/shared/lib/topic'
import fse from 'fs-extra'
import path from 'path'

const TOPIC_VERSION = 'v1.0'

const topicDataPath = path.join(__dirname, `../../../../data/${process.env.NODE_ENV}`)

const getFullPath = (shortPath: string) => {
  return path.join(topicDataPath, shortPath)
}

const joinShortPath = (...parts: string[]) => parts.join('/')

const getTopicShortPath = (topicConfig: TopicConfig) => {
  return joinShortPath('topic', TOPIC_VERSION, topicConfig.id)
}

const getTopicSummaryShortPath = (topicConfig: TopicConfig) => {
  return joinShortPath(getTopicShortPath(topicConfig), 'summary.json')
}

const ensureTopicDataDir = async (topicConfig: TopicConfig) => {
  await fse.ensureDir(getFullPath(getTopicShortPath(topicConfig)))
}

const readTopicSummary = async (topicConfig: TopicConfig): Promise<TopicSummary | undefined> => {
  const topicSummaryFullPath = getFullPath(getTopicSummaryShortPath(topicConfig))
  const topicSummaryExists = await fse.pathExists(topicSummaryFullPath)
  if (!topicSummaryExists) {
    return
  }
  return fse.readJson(topicSummaryFullPath)
}

const writeTopicSummary = async (topicSummary: TopicSummary): Promise<TopicSummary> => {
  await fse.writeJson(getFullPath(getTopicSummaryShortPath(topicSummary.topicConfig)), topicSummary)
  return topicSummary
}

const readTopicData = async (topicSummary: TopicSummary): Promise<TopicData | undefined> => {
  const topicDataFullPath = getFullPath(topicSummary.dataPath)

  const topicDataExists = await fse.pathExists(topicDataFullPath)
  if (!topicDataExists) {
    return
  }

  return fse.readJson(topicDataFullPath)
}

const writeTopicData = async (topicData: TopicData, dataHash: string, topicConfig: TopicConfig): Promise<string> => {
  const topicDataShortPath = joinShortPath(getTopicShortPath(topicConfig), 'data', `${dataHash}.json`)
  const topicDataFullPath = getFullPath(topicDataShortPath)

  const topicDataExists = await fse.pathExists(topicDataFullPath)
  if (!topicDataExists) {
    await fse.ensureDir(path.dirname(topicDataFullPath))
    await fse.writeJson(topicDataFullPath, topicData)
  }

  return topicDataShortPath
}

const getChartShortPath = (imageId: string) => {
  return joinShortPath('chart', `${imageId}.png`)
}

const getChartPaths = (imageId: string) => {
  const chartShortPath = getChartShortPath(imageId)
  const chartFullPath = getFullPath(chartShortPath)

  return {
    chartShortPath,
    chartFullPath,
  }
}

export const dataIo = {
  ensureTopicDataDir,
  readTopicSummary,
  writeTopicSummary,
  readTopicData,
  writeTopicData,
  getChartPaths,
}
