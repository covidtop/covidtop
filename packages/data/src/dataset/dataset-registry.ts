import { keyBy } from '@covidtop/shared/lib/utils'

import { DatasetLoader } from './common'
import { jhuGlobalLoader } from './jhu'

export const allDatasetLoaders: DatasetLoader[] = [jhuGlobalLoader]

export const datasetLoaderById: Readonly<Record<string, DatasetLoader>> = keyBy(
  allDatasetLoaders,
  ({ datasetConfig }) => datasetConfig.id,
)
