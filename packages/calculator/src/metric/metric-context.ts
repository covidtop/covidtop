import { DatasetConfig, MainData } from '@covidtop/shared/lib/dataset'

export interface MetricContext {
  readonly mainData: MainData
  readonly datasetConfig: DatasetConfig
}
