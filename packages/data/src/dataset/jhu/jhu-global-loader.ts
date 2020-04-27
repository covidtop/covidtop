import { DatasetLoader } from '../common'
import { jhuGlobalConfig } from './jhu-global-config'
import { loadJhuGlobalData } from './jhu-global-data'

export const jhuGlobalLoader: DatasetLoader = {
  datasetConfig: jhuGlobalConfig,
  loadData: loadJhuGlobalData,
}
