import { DatasetConfig, MainData } from '@covidtop/shared/lib/dataset'

export type LoadData = () => Promise<MainData>

export interface DatasetLoader {
  readonly datasetConfig: DatasetConfig
  readonly loadData: LoadData
}
