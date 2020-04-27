import { DatasetConfig, DatasetSummary, MainData, ReferenceSummary } from '@covidtop/shared/lib/dataset'
import { getNowText } from '@covidtop/shared/lib/utils'
import fse from 'fs-extra'
import createObjectHasher from 'node-object-hash'
import path from 'path'

const DATA_VERSION = 'v1.0'
const dataPath = `${DATA_VERSION}`

const baseDirPath = path.join(__dirname, `../../../../data/${process.env.NODE_ENV}`)
const objectHasher = createObjectHasher()

const joinPath = (...parts: string[]) => parts.join('/')

const toFullPath = (filePath: string) => {
  return path.join(baseDirPath, filePath)
}

const getDatasetPath = (datasetConfig: DatasetConfig) => {
  return joinPath(dataPath, datasetConfig.id)
}

const getJsonPath = (parentPath: string, name: string) => {
  return joinPath(parentPath, `${name}.json`)
}

const getSummaryPath = (datasetConfig: DatasetConfig) => {
  return getJsonPath(getDatasetPath(datasetConfig), 'summary')
}

const ensureDatasetDir = async (datasetConfig: DatasetConfig) => {
  await fse.ensureDir(toFullPath(getDatasetPath(datasetConfig)))
}

const getDatasetSummary = async (datasetConfig: DatasetConfig): Promise<DatasetSummary | undefined> => {
  const datasetSummaryPath = toFullPath(getSummaryPath(datasetConfig))
  const datasetSummaryExists = await fse.pathExists(datasetSummaryPath)
  if (!datasetSummaryExists) {
    return
  }
  return fse.readJson(datasetSummaryPath)
}

const writeDatasetSummary = async (
  datasetSummary: DatasetSummary,
  datasetConfig: DatasetConfig,
): Promise<DatasetSummary> => {
  await fse.writeJson(toFullPath(getSummaryPath(datasetConfig)), datasetSummary)
  return datasetSummary
}

const updateDatasetSummary = async (
  mainData: MainData,
  referenceSummary: ReferenceSummary,
  datasetConfig: DatasetConfig,
  previousSummary?: DatasetSummary,
): Promise<DatasetSummary> => {
  const lastChecked = getNowText()
  const mainDataHash = objectHasher.hash(mainData)

  if (previousSummary && previousSummary.mainDataHash === mainDataHash) {
    return writeDatasetSummary(
      {
        ...previousSummary,
        lastChecked,
      },
      datasetConfig,
    )
  }

  const mainDataDirPath = joinPath(getDatasetPath(datasetConfig), 'main')
  const mainDataPath = getJsonPath(mainDataDirPath, mainDataHash)
  const mainDataExists = await fse.pathExists(toFullPath(mainDataPath))
  if (!mainDataExists) {
    await fse.ensureDir(toFullPath(mainDataDirPath))
    await fse.writeJson(toFullPath(mainDataPath), mainData)
  }

  return writeDatasetSummary(
    {
      lastChecked,
      lastUpdated: lastChecked,
      mainDataHash,
      mainDataPath,
      referenceSummary,
    },
    datasetConfig,
  )
}

const getMainData = async (datasetSummary: DatasetSummary): Promise<MainData | undefined> => {
  const { mainDataPath } = datasetSummary
  const mainDataExists = await fse.pathExists(toFullPath(mainDataPath))
  if (!mainDataExists) {
    return
  }
  return fse.readJson(toFullPath(mainDataPath))
}

export const dataIo = {
  ensureDatasetDir,
  getDatasetSummary,
  updateDatasetSummary,
  getMainData,
}
