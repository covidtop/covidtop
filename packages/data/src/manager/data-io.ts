import { TopicConfig, TopicData, TopicInfo } from '@covidtop/shared/lib/topic'
import fse from 'fs-extra'
import path from 'path'

const TOPIC_VERSION = 'v1.2'

const topicDataPath = path.join(__dirname, `../../../../data/${process.env.NODE_ENV}`)

const getFullPath = (shortPath: string) => {
  return path.join(topicDataPath, shortPath)
}

const joinShortPath = (...parts: string[]) => parts.join('/')

const getTopicShortPath = (topicConfig: TopicConfig) => {
  return joinShortPath('topic', TOPIC_VERSION, topicConfig.id)
}

const getTopicInfoShortPath = (topicConfig: TopicConfig) => {
  return joinShortPath(getTopicShortPath(topicConfig), 'info.json')
}

const ensureTopicDataDir = async (topicConfig: TopicConfig) => {
  await fse.ensureDir(getFullPath(getTopicShortPath(topicConfig)))
}

const readTopicInfo = async (topicConfig: TopicConfig): Promise<TopicInfo | undefined> => {
  const topicInfoFullPath = getFullPath(getTopicInfoShortPath(topicConfig))
  const topicInfoExists = await fse.pathExists(topicInfoFullPath)
  if (!topicInfoExists) {
    return
  }
  return fse.readJson(topicInfoFullPath)
}

const writeTopicInfo = async (topicInfo: TopicInfo, topicConfig: TopicConfig): Promise<TopicInfo> => {
  await fse.writeJson(getFullPath(getTopicInfoShortPath(topicConfig)), topicInfo)
  return topicInfo
}

const readTopicData = async (topicInfo: TopicInfo): Promise<TopicData | undefined> => {
  const topicDataFullPath = getFullPath(topicInfo.dataPath)

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
  readTopicInfo,
  writeTopicInfo,
  readTopicData,
  writeTopicData,
  getChartPaths,
}
