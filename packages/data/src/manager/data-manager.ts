import { DatasetSummary, MainData, ReferenceSummary } from '@covidtop/shared/lib/dataset'
import { getMinutesBetween } from '@covidtop/shared/lib/utils'

import { allDatasetLoaders, DatasetLoader } from '../dataset'
import { dataIo } from './data-io'

const mainDataByDatasetId: Record<string, MainData> = {}

interface RefreshDatasetResult {
  readonly mainData: MainData
  readonly datasetSummary: DatasetSummary
}

const runDatasetLoader = async (datasetLoader: DatasetLoader): Promise<RefreshDatasetResult> => {
  const { datasetConfig } = datasetLoader
  const mainData: MainData = await datasetLoader.loadData()
  mainDataByDatasetId[datasetConfig.id] = mainData

  await dataIo.ensureDatasetDir(datasetConfig)
  const previousDatasetSummary = await dataIo.getDatasetSummary(datasetConfig)

  const { dates } = mainData.referenceData
  const referenceSummary: ReferenceSummary = {
    minDate: dates[0],
    maxDate: dates[dates.length - 1],
  }
  const datasetSummary = await dataIo.updateDatasetSummary(
    mainData,
    referenceSummary,
    datasetConfig,
    previousDatasetSummary,
  )

  return {
    mainData,
    datasetSummary,
  }
}

const refreshDataset = async (datasetLoader: DatasetLoader): Promise<RefreshDatasetResult | undefined> => {
  const { datasetConfig } = datasetLoader
  const datasetMessage = `Refresh dataset ${datasetConfig.name} [${datasetConfig.id}]`
  try {
    console.log(new Date(), `${datasetMessage}: START`)
    const result = await runDatasetLoader(datasetLoader)
    console.log(new Date(), `${datasetMessage}: DONE`)
    return result
  } catch (err) {
    console.log(new Date(), `${datasetMessage}: FAILED`)
    console.log(err)
  }
}

const refreshData = async () => {
  for (const datasetLoader of allDatasetLoaders) {
    await refreshDataset(datasetLoader)
  }
}

const getMainData = async (datasetLoader: DatasetLoader): Promise<MainData | undefined> => {
  const { datasetConfig } = datasetLoader

  const mainDataFromMemory: MainData | undefined = mainDataByDatasetId[datasetConfig.id]
  if (mainDataFromMemory) {
    return mainDataFromMemory
  }

  const datasetSummary = await dataIo.getDatasetSummary(datasetConfig)
  if (datasetSummary && getMinutesBetween(new Date(), new Date(datasetSummary.lastChecked)) < 5) {
    const mainDataFromFile: MainData | undefined = await dataIo.getMainData(datasetSummary)
    if (mainDataFromFile) {
      mainDataByDatasetId[datasetConfig.id] = mainDataFromFile
      return mainDataFromFile
    }
  }

  const result = await refreshDataset(datasetLoader)
  return result ? result.mainData : undefined
}

export const dataManager = {
  refreshData,
  getMainData,
}
