import { ReferenceData } from './reference-data'

export interface MainRecord {
  readonly locationCode: string
  // array of measure numbers by the order of `DatasetConfig.measureConfig` and `ReferenceData.dates`
  readonly dailyMeasures: number[][]
}

export interface MainData {
  readonly datasetId: string
  readonly referenceData: ReferenceData
  readonly mainRecordsByLocationType: Readonly<Record<string, MainRecord[]>>
}
